import crypto from 'node:crypto';

export const getPreviewFilename = (relativePath, size, suffix) => {
  const hash = crypto.createHash('sha256').update(relativePath).update(
    size.toString(),
  ).digest('hex');

  return `${hash}_${suffix}.jpg`;
};
