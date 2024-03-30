import fs from 'node:fs/promises';
import path from 'node:path';
import mime from 'mime';

import { EntryKind } from './index.js';

export class EntryMetadata {
  constructor(basename, size, isSymlink, kind, created, modified, mediaType) {
    this.basename = basename;
    this.size = size;
    this.isSymlink = isSymlink;
    this.kind = kind;
    this.created = created;
    this.modified = modified;
    this.mediaType = mediaType;
  }

  static async fromPath(entryPath) {
    const lstat = await fs.lstat(entryPath);

    const modified = Math.round(lstat.mtime.getTime() / 1000);
    const created = Math.round(lstat.birthtime.getTime() / 1000);
    const isSymlink = lstat.isSymbolicLink();

    let size = lstat.size;
    let kind = EntryKind.fromStats(lstat);

    if (isSymlink) {
      const stat = await fs.stat(entryPath);

      kind = EntryKind.fromStats(stat);
      size = stat.size;
    }

    const basename = path.basename(entryPath);

    const mediaType = mime.getType(entryPath);

    return new EntryMetadata(
      basename,
      size,
      isSymlink,
      kind,
      created,
      modified,
      mediaType,
    );
  }
}
