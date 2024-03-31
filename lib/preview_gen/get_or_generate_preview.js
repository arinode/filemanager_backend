import { getPreviewPath } from './utils.js';
import { isFileExists } from '../index.js';
import { generateCover, generateThumbnail } from '../index.js';

const PROMISES = new Map();

export const getOrGeneratePreview = async (absolutePath, kind) => {
  if (!['cover', 'thumb'].includes(kind)) {
    throw new Error(`kind "${kind}" is not either "cover" or "thumb"`);
  }

  const previewPath = await getPreviewPath(absolutePath, kind);

  if (await isFileExists(previewPath)) {
    return previewPath;
  }

  const pendingPromise = PROMISES.get(previewPath);
  if (pendingPromise !== undefined) {
    console.log(`Waiting for pending promise: ${previewPath}`);
    await pendingPromise;
    return previewPath;
  }

  const promise = generatePreview(absolutePath, previewPath, kind);
  PROMISES.set(previewPath, promise);
  console.log(`Created new promise: ${previewPath}`);

  await promise.finally(() => {
    PROMISES.delete(previewPath);
    console.log(`Removed promise: ${previewPath}`);
  });

  return previewPath;
};

const generatePreview = (absolutePath, previewPath, kind) => {
  if (kind === 'cover') {
    return generateCover(absolutePath, previewPath);
  }

  if (kind === 'thumb') {
    return generateThumbnail(absolutePath, previewPath);
  }

  throw new Error('unreachable: kind must be validated by caller');
};
