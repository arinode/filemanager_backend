import { VisualStreamInfo } from './visual_stream_info.js';
import { getPreviewFilename } from './utils.js';
import { isFileExists, PREVIEW_DIR, SHARED_DIR } from '../index.js';
import { spawnFfmpeg } from './ffmpeg.js';
import path from 'node:path';
import fs from 'node:fs/promises';

export const getOrGenerateCover = async (absolutePath) => {
  // already a preview (don't generate a preview for a preview)
  if (absolutePath.indexOf(PREVIEW_DIR) === 0) {
    return absolutePath;
  }

  const relativePath = path.relative(SHARED_DIR, absolutePath);
  const size = (await fs.stat(absolutePath)).size;
  const coverFilename = getPreviewFilename(relativePath, size, 'cover');

  const coverPath = path.join(PREVIEW_DIR, coverFilename);

  if (await isFileExists(coverPath)) {
    return coverPath;
  }

  await generateCover(absolutePath, coverPath);

  return coverPath;
};

const generateCover = async (inputPath, outputPath) => {
  const info = await VisualStreamInfo.fromFile(inputPath);

  if (info.type !== 'image') {
    throw new Error(
      'cover only works with images or files containing image streams',
    );
  }

  const args = [
    '-hide_banner',
    '-n',
    '-i',
    inputPath,
    '-map_metadata',
    '-1',
    '-qscale:v',
    '3',
    '-vf',
    "scale=-2:'min(512,ih)'",
  ];

  args.push(outputPath);

  // console.log(`ffmpeg ${args.join(' ')}`);

  return spawnFfmpeg(args);
};
