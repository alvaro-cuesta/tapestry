import type { TaskId } from '../utils';
import { checkForNonZeroPixels, makeLogPrefix } from '../utils';

export type ToPatternWorkerMessage = {
  taskId: TaskId;
  width: number;
  height: number;
  seed: number;
};

export type FromPatternWorkerMessage =
  | { type: 'success'; bitmap: ImageBitmap }
  | { type: 'error'; message: string };

export const registerPatternWorker = (
  taskName: string,
  cb: (message: ToPatternWorkerMessage) => ImageBitmap,
) => {
  self.onmessage = ({ data }: MessageEvent<ToPatternWorkerMessage>) => {
    const { taskId } = data;

    const prefix = makeLogPrefix(taskId, `Pattern-${taskName}`);

    if (__DEBUG__) {
      console.debug(prefix, 'Worker called');
    }

    try {
      const bitmap = cb(data);

      if (__DEBUG__) {
        console.debug(prefix, 'Worker finished successfully', bitmap);
        checkForNonZeroPixels(taskId, `Pattern-${taskName}`, 'output', bitmap);
      }

      self.postMessage({ type: 'success', bitmap }, { transfer: [bitmap] });
    } catch (error) {
      console.error(prefix, 'Error in worker callback:', error);

      const message = error instanceof Error ? error.message : 'Unknown error';
      self.postMessage({ type: 'error', message });
    }
  };
};
