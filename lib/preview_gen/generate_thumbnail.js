import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnFfmpeg } from './ffmpeg.js';
import { getPreviewFilename } from './utils.js';
import {
  isFileExists,
  PREVIEW_DIR,
  SHARED_DIR,
  VisualStreamInfo,
} from '../index.js';

export { getOrGenerateThumbnail };

const getOrGenerateThumbnail = async (absolutePath) => {
  // already a preview (don't generate a preview for a preview)
  if (absolutePath.indexOf(PREVIEW_DIR) === 0) {
    return absolutePath;
  }

  const relativePath = path.relative(SHARED_DIR, absolutePath);
  const size = (await fs.stat(absolutePath)).size;
  const previewFilename = getPreviewFilename(relativePath, size, 'thumb');

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
    '-map_metadata',
    '-1',
    '-qscale:v',
    '10',
    '-frames:v',
    '1',
  ];

  let filterGraph = '';

  const info = await VisualStreamInfo.fromFile(inputPath);
  if (info.duration !== undefined) {
    const offest = info.duration * 0.2;
    args.splice(0, 0, '-ss', offest.toString(), '-t', '120');
    filterGraph += 'fps=2,';
  }

  filterGraph += "scale=-2:'min(128,ih)',thumbnail=4096";

  args.push('-vf', filterGraph, outputPath);

  // console.log(`ffmpeg ${args.join(' ')}`);

  return spawnFfmpeg(args);
};
