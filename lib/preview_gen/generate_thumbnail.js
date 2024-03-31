import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import child_process from 'node:child_process';
import { PREVIEW_DIR, SHARED_DIR, VisualStreamInfo } from '../index.js';

export { getOrGenerateThumbnail };

const getOrGenerateThumbnail = async (absolutePath) => {
  // already a preview (don't generate a preview for a preview)
  if (absolutePath.indexOf(PREVIEW_DIR) === 0) {
    return absolutePath;
  }

  const relativePath = path.relative(SHARED_DIR, absolutePath);
  const size = (await fs.stat(absolutePath)).size;
  const previewFilename = getPreviewFilename(relativePath, size);

  const previewPath = path.join(PREVIEW_DIR, previewFilename);

  if (await isFileExists(previewPath)) {
    return previewPath;
  }

  await generateThumbnail(absolutePath, previewPath);

  return previewPath;
};

const generateThumbnail = async (inputPath, outputPath) => {
  const args = [
    '-hide_banner',
    '-n',
    '-i',
    inputPath,
    '-qscale:v',
    '10',
    '-frames:v',
    '1',
  ];

  let filterGraph = '';

  const info = await VisualStreamInfo.fromFile(inputPath);
  if (info.duration !== undefined) {
    const samples = 512;
    const fps = Math.min(samples / info.duration, 5);
    filterGraph += `fps=${fps},`;
  }

  filterGraph += "scale=-2:'min(128,ih)',thumbnail=4096";

  args.push('-vf', filterGraph, outputPath);

  // console.log(`ffmpeg ${args.join(' ')}`);

  const ffmpeg = child_process.spawn('ffmpeg', args);

  return (
    new Promise((resolve, reject) => {
      ffmpeg.on('exit', () => {
        if (ffmpeg.exitCode === 0) {
          resolve();
        }

        ffmpeg.stderr.setEncoding('utf8');
        const errorMessage =
          `exitCode: ${ffmpeg.exitCode}\nstderr:\n${ffmpeg.stderr.read()}`;
        reject(new Error(errorMessage));
      });
    })
  );
};

const getPreviewFilename = (relativePath, size) => {
  return crypto.createHash('sha256').update(relativePath).update(
    size.toString(),
  )
    .digest('hex') + '.jpg';
};

const isFileExists = async (absolutePath) => {
  try {
    await fs.access(absolutePath);
    return true;
  } catch {
    return false;
  }
};
