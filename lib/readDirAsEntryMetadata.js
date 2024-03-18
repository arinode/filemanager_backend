import fs from 'node:fs/promises';
import path from 'node:path';
import { EntryMetadata } from './index.js';

const readDirAsEntryMetadata = async (dirPath) => {
  const names = await fs.readdir(dirPath);

  const entries = names.map((name) => {
    const entryPath = path.resolve(dirPath, name);
    return EntryMetadata.fromPath(entryPath);
  });

  return Promise.all(entries);
};

export { readDirAsEntryMetadata };
