import { makeLogPrefix, type TaskId } from '../utils';
import { BlurPostFx } from './blur';
import { InvertPostFx } from './invert';
import { NonePostFx } from './none';
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
  signal: AbortSignal,
): Promise<ImageBitmap> {
  const prefix = makeLogPrefix(taskId, 'applyPostFx');

  return new Promise((resolve, reject) => {
    try {
      signal.throwIfAborted();
    } catch (err) {
      if (__DEBUG__) {
        console.debug(prefix, 'Signal already aborted, terminating worker');
      }
      worker.terminate();
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- we can't guarantee the error type
      reject(err);
      return;
    }

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

    signal.addEventListener(
      'abort',
      () => {
        if (__DEBUG__) {
          console.debug(prefix, 'Aborting worker');
        }
        worker.terminate();
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );

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

export const POST_FXS: readonly PostFx[] = [
  NonePostFx,
  BlurPostFx,
  VignettePostFx,
  InvertPostFx,
];
