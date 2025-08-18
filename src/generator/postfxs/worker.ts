import type { TaskId } from '../utils';
import { checkForNonZeroPixels, makeLogPrefix } from '../utils';

export type ToPostFxWorkerMessage = {
  taskId: TaskId;
  bitmap: ImageBitmap;
  seed: number;
};

export type FromPostFxWorkerMessage =
  | { type: 'success'; bitmap: ImageBitmap }
  | { type: 'error'; message: string };

export function registerPostFxWorker(
  taskName: string,
  cb: (message: ToPostFxWorkerMessage) => ImageBitmap,
): void {
  self.onmessage = ({ data }: MessageEvent<ToPostFxWorkerMessage>) => {
    const { taskId, bitmap } = data;

    const prefix = makeLogPrefix(taskId, `PostFx-${taskName}`);

    if (__DEBUG__) {
      console.debug(prefix, 'Worker called');
      console.debug(prefix, 'Input bitmap', bitmap);
      checkForNonZeroPixels(taskId, `PostFx-${taskName}`, 'input', bitmap);
    }

    try {
      const bitmap = cb(data);

      if (__DEBUG__) {
        console.debug(prefix, 'Worker finished successfully', bitmap);
        checkForNonZeroPixels(taskId, `PostFx-${taskName}`, 'output', bitmap);
      }

      self.postMessage({ type: 'success', bitmap }, { transfer: [bitmap] });
    } catch (error) {
      console.error(prefix, 'Error in worker callback:', error);

      const message = error instanceof Error ? error.message : 'Unknown error';
      self.postMessage({ type: 'error', message });
    }
  };
}
