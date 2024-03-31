import crypto from 'node:crypto';

export const getPreviewFilename = (relativePath, size) => {
  return crypto.createHash('sha256').update(relativePath).update(
    size.toString(),
  )
    .digest('hex') + '.jpg';
};
