import type { TaskId } from '../utils';
import { InvertPostFx } from './invert';
import { VignettePostFx } from './vignette';
import type { FromPostFxWorkerMessage, ToPostFxWorkerMessage } from './worker';

type ApplyPostFxOptions = {
  bitmap: ImageBitmap;
  seed: number;
};

export function applyPostFx(
  taskId: TaskId,
  worker: Worker,
  options: ApplyPostFxOptions,
): Promise<ImageBitmap> {
  return new Promise((resolve, reject) => {
    worker.onmessage = ({ data }: MessageEvent<FromPostFxWorkerMessage>) => {
      switch (data.type) {
        case 'success': {
          resolve(data.bitmap);
          break;
        }
        case 'error': {
          reject(new Error(data.message));
          break;
        }
        default: {
          console.error('Unexpected message from worker:', data);
          reject(new Error('Unexpected message from worker'));
          break;
        }
      }
    };

    worker.onerror = (error) => {
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- we do not control the worker, so we can't guarantee the error type
      reject(error.error);
    };

    worker.postMessage(
      {
        taskId,
        bitmap: options.bitmap,
        seed: options.seed,
      } satisfies ToPostFxWorkerMessage,
      { transfer: [options.bitmap] },
    );
  });
}

export type PostFx = {
  name: string;
  WorkerConstructor: new () => Worker;
};

export const POST_FXS: readonly PostFx[] = [VignettePostFx, InvertPostFx];
