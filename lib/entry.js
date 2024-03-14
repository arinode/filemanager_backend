import fs from 'node:fs/promises';
import path from 'node:path';

import { EntryKind } from './index.js';

export default class Entry {
  constructor(basename, size, isSymlink, kind, created, modified) {
    this.basename = basename;
    this.size = size;
    this.isSymlink = isSymlink;
    this.kind = kind;
    this.created = created;
    this.modified = modified;
  }

  static async fromPath(entryPath) {
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

    return new Entry(basename, size, isSymlink, kind, created, modified);
  }
}
