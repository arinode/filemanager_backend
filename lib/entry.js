import fs from 'node:fs/promises';
import path from 'node:path';

import { EntryKind, SHARED_DIR } from './index.js';

export default class Entry {
  constructor(basename, localPath, size, isSymlink, kind, created, modified) {
    this.basename = basename;
    this.localPath = localPath;
    this.size = size;
    this.isSymlink = isSymlink;
    this.kind = kind;
    this.created = created;
    this.modified = modified;
  }

  static async fromPath(entryPath) {
    const normalized = path.normalize(entryPath);

    if (normalized.indexOf(SHARED_DIR) !== 0) {
      throw new Error(`entryPath outside of SHARED_DIR: "${entryPath}"`);
    }

    const lstat = await fs.lstat(entryPath);

    const modified = lstat.mtime.getTime();
    const created = lstat.birthtime.getTime();
    const isSymlink = lstat.isSymbolicLink();

    let size = lstat.size;
    let kind = EntryKind.fromStats(lstat);

    if (isSymlink) {
      const stat = await fs.stat(entryPath);

      kind = EntryKind.fromStats(stat);
      size = stat.size;
    }

    const basename = path.basename(entryPath);
    const localPath = path.relative(SHARED_DIR, entryPath);

    return new Entry(
      basename,
      localPath,
      size,
      isSymlink,
      kind,
      created,
      modified,
    );
  }
}
