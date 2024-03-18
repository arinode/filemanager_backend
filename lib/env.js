export { PORT, SHARED_DIR };

import fs from 'node:fs';
import path from 'node:path';

const PORT = getPort();
const SHARED_DIR = resolveEnvDir('SHARED_DIR');

function getPort() {
  const port = parseInt(process.env.PORT);

  if (isNaN(port)) {
    return 25401;
  }

  return port;
}

function resolveEnvDir(envVar) {
  const dir = process.env[envVar];

  if (dir === undefined) {
    throw new Error(`${envVar} environment variable is not set`);
  }

  if (!fs.existsSync(dir)) {
    throw new Error(`${envVar} does not exist: "${dir}"`);
  }

  return path.resolve(dir);
}
