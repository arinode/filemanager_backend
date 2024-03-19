import express from 'express';
import { getOrGeneratePreview, resolvePath } from '../lib/index.js';

const router = express.Router();

const handleGet = async (req, res) => {
  const absolutePath = resolvePath(req.path);
  const previewPath = await getOrGeneratePreview(absolutePath);
  res.sendFile(previewPath, { etag: false });
};

router.get('*', (req, res, next) => {
  handleGet(req, res).catch(next);
});

export default router;
