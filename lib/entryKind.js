export default class EntryKind {
  static Dir = new EntryKind('dir');
  static File = new EntryKind('file');
  static Other = new EntryKind('other');

  constructor(kind) {
    this.kind = kind;
  }

  toJSON() {
    return this.kind;
  }

  static fromStats(stats) {
    if (stats.isDirectory()) {
      return EntryKind.Dir;
    }

    if (stats.isFile()) {
      return EntryKind.File;
    }

    return EntryKind.Other;
  }
}
