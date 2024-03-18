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

const getVisualStreamInfo = async (filePath) => {
  const output = await getRawOutput(filePath);

  if (
    output.includes('nb_frames=N/A') || output.includes('avg_frame_rate=0/0')
  ) {
    return VisualStreamInfo.newImage();
  }

  const regex = /duration=(.*)$/m;
  const durationMatches = output.match(regex);

  if (durationMatches === null) {
    return null;
  }

  const duration = parseFloat(durationMatches[1]);

  if (isNaN(duration)) {
    return null;
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
    'stream=avg_frame_rate,duration,nb_frames',
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
