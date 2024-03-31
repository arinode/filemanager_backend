import { getPreviewPath } from './utils.js';
import { isFileExists } from '../index.js';
import { generateCover, generateThumbnail } from '../index.js';

export const getOrGeneratePreview = async (absolutePath, kind) => {
  if (!['cover', 'thumb'].includes(kind)) {
    throw new Error(`kind "${kind}" is not either "cover" or "thumb"`);
  }

  const previewPath = await getPreviewPath(absolutePath, kind);

  if (await isFileExists(previewPath)) {
    return previewPath;
  }

  if (kind === 'cover') {
    await generateCover(absolutePath, previewPath);
  }

  if (kind === 'thumb') {
    await generateThumbnail(absolutePath, previewPath);
  }

  return previewPath;
};
