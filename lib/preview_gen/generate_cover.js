import { VisualStreamInfo } from './visual_stream_info.js';
import { spawnFfmpeg } from './ffmpeg.js';

export const generateCover = async (inputPath, outputPath) => {
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
