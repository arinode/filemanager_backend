export { PORT, SHARED_DIR };

import fs from 'node:fs';

const PORT = getPort();
const SHARED_DIR = getSharedDir();

function getPort() {
  const port = parseInt(process.env.PORT);

  if (isNaN(port)) {
    return 25401;
  }

  return port;
}

function getSharedDir() {
  const dir = process.env.SHARED_DIR;

  if (typeof dir === 'undefined') {
    throw new Error('SHARED_DIR variable is not set');
  }

  if (!fs.existsSync(dir)) {
    throw new Error('SHARED_DIR does not exist: "${dir}"');
  }

  return dir;
}
