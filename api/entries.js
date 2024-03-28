import express from 'express';
import {
  EntryChildren,
  EntryKind,
  EntryMetadata,
  resolvePath,
} from '../lib/index.js';

const router = express.Router();

const handleGet = async (req, res) => {
  const absolutePath = resolvePath(req.path);
  const actualType = (await EntryKind.fromFile(absolutePath)).toString();

  req.query.type ??= actualType;

  if (req.query.type !== actualType) {
    throw new Error(
      `invalid type, received: ${req.query.type}, while entry is: ${actualType}`,
    );
  }

  if (req.query.type === 'file') {
    res.sendFile(absolutePath, { etag: false });
    return;
  }

  if (req.query.type === 'dir') {
    const children = await EntryChildren.fromDir(absolutePath);
    res.send(children);
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
