import express from 'express';
import { readDirAsEntryMetadata, resolvePath } from '../lib/index.js';

const router = express.Router();

router.get('*', async (req, res) => {
  if (req.query.type === undefined) {
    req.query.type = 'file';
  }

  if (req.query.type === 'file') {
    const absolutePath = resolvePath(req.path);
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
});

export default router;
