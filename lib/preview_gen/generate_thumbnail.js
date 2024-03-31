import { spawnFfmpeg } from './ffmpeg.js';
import { getPreviewPath } from './utils.js';
import { isFileExists, VisualStreamInfo } from '../index.js';

export { getOrGenerateThumbnail };

const getOrGenerateThumbnail = async (absolutePath) => {
  const thumbnailPath = await getPreviewPath(absolutePath, 'thumb');

  if (await isFileExists(thumbnailPath)) {
    return thumbnailPath;
  }

  await generateThumbnail(absolutePath, thumbnailPath);

  return thumbnailPath;
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
