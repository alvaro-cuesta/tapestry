import type { Tagged } from 'type-fest';

export type TaskId = Tagged<string, 'TaskId'>;

export function makeTaskId(): TaskId {
  const taskId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  return taskId as TaskId;
}

export function makeLogPrefix(taskId: TaskId, taskName: string) {
  return `[${taskId}] [${taskName}]`;
}

export function checkForNonZeroPixels(
  taskId: TaskId,
  taskName: string,
  stepName: string,
  bitmap: ImageBitmap,
): void {
  const prefix = makeLogPrefix(taskId, `${taskName}-${stepName}`);

  const offscreen = new OffscreenCanvas(bitmap.width, bitmap.height);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we just created the canvas so there's no chance of it already having a previous context
  const ctx = offscreen.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);

  const data = ctx.getImageData(0, 0, offscreen.width, offscreen.height).data;

  let foundNonZeroPixel = false;
  for (const pixel of data) {
    if (pixel !== 0) {
      foundNonZeroPixel = true;
      break;
    }
  }

  if (foundNonZeroPixel) {
    console.debug(prefix, 'Non-zero pixel found ✅');
  } else {
    console.warn(prefix, 'Non-zero pixel missing ❌');
  }
}
