import path from 'node:path';
import { SHARED_DIR } from './index.js';

const resolvePath = (paramPath, disallowRoot = false) => {
  const decodedPath = decodeURIComponent(paramPath);

  if (!paramPath.startsWith('/')) {
    throw new Error('relative paths are not supported');
  }

  const resolved = path.resolve(SHARED_DIR, decodedPath.slice(1));

  console.log(
    `decodedPath: "${decodedPath}", resolved: "${resolved}"`,
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
