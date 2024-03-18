import express from 'express';
import { resolvePath } from '../lib/index.js';

const router = express.Router();

router.get('*', (req, res) => {
  if (req.query.type === undefined) {
    req.query.type = 'file';
  }

  if (req.query.type === 'file') {
    const absolutePath = resolvePath(req.path);
    res.sendFile(absolutePath, { etag: false });
    return;
  }

  throw new Error(`invalid type: ${req.query.type}`);
});

export default router;
