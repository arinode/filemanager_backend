import child_process from 'node:child_process';

export const spawnFfmpeg = (args) => {
  const process = child_process.spawn('ffmpeg', args);

  return (
    new Promise((resolve, reject) => {
      process.on('exit', () => {
        if (process.exitCode === 0) {
          resolve();
        }

        process.stderr.setEncoding('utf8');
        const errorMessage =
          `exitCode: ${process.exitCode}\nstderr:\n${process.stderr.read()}`;
        reject(new Error(errorMessage));
      });
    })
  );
};
