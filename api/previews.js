import express from 'express';
import { getOrGeneratePreview, resolvePath } from '../lib/index.js';

const router = express.Router();

const handleGet = (relativeURL) => {
  const absolutePath = resolvePath(relativeURL);
  return getOrGeneratePreview(absolutePath);
};

router.get('*', (req, res, next) => {
  handleGet(req.path)
    .then((previewPath) => {
      res.sendFile(previewPath, { etag: false });
    })
    .catch(next);
});

export default router;
