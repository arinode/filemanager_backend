import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PREVIEW_DIR, SHARED_DIR } from '../index.js';

export const getPreviewPath = async (absolutePath, suffix) => {
  // already a preview
  if (absolutePath.indexOf(PREVIEW_DIR) === 0) {
    return absolutePath;
  }

  const relativePath = path.relative(SHARED_DIR, absolutePath);
  const size = (await fs.stat(absolutePath)).size;
  const previewFilename = getPreviewFilename(relativePath, size, suffix);

  return path.join(PREVIEW_DIR, previewFilename);
};

export const getPreviewFilename = (relativePath, size, suffix) => {
  const hash = crypto.createHash('sha256').update(relativePath).update(
    size.toString(),
  ).digest('hex');

  return `${hash}_${suffix}.jpg`;
};
