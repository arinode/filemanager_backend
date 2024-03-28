import fs from 'node:fs/promises';
import path from 'node:path';
import { EntryMetadata } from './index.js';
import { SHARED_DIR } from './env.js';

export class EntryChildren {
  constructor(prefix, children) {
    this.prefix = prefix;
    this.children = children;
  }

  static async fromDir(dirPath) {
    const prefix = path.relative(SHARED_DIR, dirPath);
    const children = await readDirAsEntryMetadata(dirPath);

    return new EntryChildren(prefix, children);
  }
}

const readDirAsEntryMetadata = async (dirPath) => {
  const names = await fs.readdir(dirPath);

  const entries = names.map((name) => {
    const entryPath = path.resolve(dirPath, name);
    return EntryMetadata.fromPath(entryPath);
  });

  return Promise.all(entries);
};
