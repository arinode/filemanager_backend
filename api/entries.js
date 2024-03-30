import express from 'express';
import {
  EntryChildren,
  EntryKind,
  EntryMetadata,
  getOrGeneratePreview,
  resolvePath,
} from '../lib/index.js';

const router = express.Router();

const handleGet = async (req, res) => {
  const absolutePath = resolvePath(req.path);
  const kind = await EntryKind.fromFile(absolutePath);

  req.query.alt ??= 'metadata';

  if (req.query.alt == 'metadata') {
    const metadata = await EntryMetadata.fromPath(absolutePath);
    res.send(metadata);
    return;
  }

  if (req.query.alt === 'raw') {
    if (kind !== EntryKind.File) {
      throw new Error(
        `alt=raw works only with files`,
      );
    }

    res.sendFile(absolutePath, { etag: false });
    return;
  }

  if (req.query.alt === 'children') {
    if (kind !== EntryKind.Dir) {
      throw new Error(
        `alt=raw works only with directories`,
      );
    }

    const children = await EntryChildren.fromDir(absolutePath);
    res.send(children);
    return;
  }

  if (req.query.alt === 'thumb') {
    const previewPath = await getOrGeneratePreview(absolutePath);
    res.sendFile(previewPath, { etag: false });
    return;
  }

  throw new Error(
    `invalid alt: ${req.query.alt} | valid values are: metadata, children, raw, thumb`,
  );
};

const handleHead = async (req, res) => {
  const absolutePath = resolvePath(req.path);
  const metadata = await EntryMetadata.fromPath(absolutePath);

  res.type('application/octet-stream');

  if (metadata.mediaType !== null) {
    res.type(metadata.mediaType);
  }

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
