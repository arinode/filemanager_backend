import child_process from 'node:child_process';

export { getVisualStreamInfo };

class VisualStreamInfo {
  constructor(type, duration) {
    this.type = type;
    this.duration = duration;
  }

  static newImage() {
    return new VisualStreamInfo('image');
  }

  static newVideo(duration) {
    return new VisualStreamInfo('video', duration);
  }
}

const imageCodecs = ['png', 'mjpeg', 'webp'];

const getVisualStreamInfo = async (filePath) => {
  const output = await getRawOutput(filePath);

  if (output.includes('nb_frames=1')) {
    return VisualStreamInfo.newImage();
  }

  const codecRegex = /codec_name=(.*)$/m;
  const codecMatches = output.match(codecRegex);

  if (codecMatches === null) {
    throw new Error('unable to get codec name');
  }

  const codecName = codecMatches[1];

  if (imageCodecs.includes(codecName)) {
    return VisualStreamInfo.newImage();
  }

  const durationRegex = /duration=([\d.]*)$/m;
  const durationMatches = output.match(durationRegex);

  if (durationMatches === null) {
    throw new Error(
      `unable to get neither stream or format duration, codec_name: ${codecName}`,
    );
  }

  const duration = parseFloat(durationMatches[1]);

  if (isNaN(duration)) {
    throw new Error('unable to parse duration as float');
  }

  return VisualStreamInfo.newVideo(duration);
};

const getRawOutput = (filePath) => {
  const ffprobe = child_process.spawn('ffprobe', [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=codec_name,duration,nb_frames:format=duration',
    '-of',
    'default=nk=0:nw=1',
    filePath,
  ]);

  ffprobe.stdout.setEncoding('utf8');

  return (
    new Promise((resolve, _reject) => {
      ffprobe.on('exit', () => {
        resolve(ffprobe.stdout.read());
      });
    })
  );
};
