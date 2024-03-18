import express from 'express';
import fs from 'node:fs/promises';
import {
  EntryMetadata,
  readDirAsEntryMetadata,
  resolvePath,
} from '../lib/index.js';

const router = express.Router();

const handleGet = async (req, res) => {
  if (req.query.type === undefined) {
    req.query.type = 'file';
  }

  if (req.query.type === 'file') {
    const absolutePath = resolvePath(req.path);

    if (!(await fs.stat(absolutePath)).isFile()) {
      throw new Error('entry is not a file');
    }

    res.sendFile(absolutePath, { etag: false });
    return;
  }

  if (req.query.type === 'dir') {
    const absolutePath = resolvePath(req.path);
    const metadata = await readDirAsEntryMetadata(absolutePath);
    res.send(metadata);
    return;
  }

  throw new Error(`invalid type: ${req.query.type}`);
};

const handleHead = async (req, res) => {
  const absolutePath = resolvePath(req.path);
  const metadata = await EntryMetadata.fromPath(absolutePath);

  res.set('x-ar-basename', encodeURIComponent(metadata.basename));
  res.set('x-ar-kind', metadata.kind.toString());
  res.set('x-ar-size', metadata.size);
  res.set('x-ar-created', metadata.created);
  res.set('x-ar-modified', metadata.modified);
  res.set('x-ar-is-symlink', metadata.isSymlink);

  res.send();
};

router.head('*', (req, res, next) => {
  handleHead(req, res).catch(next);
});

router.get('*', (req, res, next) => {
  handleGet(req, res).catch(next);
});

export default router;
