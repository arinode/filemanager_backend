import path from 'node:path';
import { SHARED_DIR } from './index.js';

const resolvePath = (paramPath, disallowRoot = false) => {
  if (!paramPath.startsWith('/')) {
    throw new Error('relative paths are not supported');
  }

  const resolved = path.resolve(SHARED_DIR, paramPath.slice(1));

  console.log(
    `SHARED_DIR: "${SHARED_DIR}", paramPath: "${paramPath}", resolved: "${resolved}"`,
  );

  if (disallowRoot && resolved === SHARED_DIR) {
    throw new Error('this method is not allowed on the root');
  }

  if (resolved.indexOf(SHARED_DIR) !== 0) {
    throw new Error(`path outside of SHARED_DIR`);
  }

  return resolved;
};

export { resolvePath };
