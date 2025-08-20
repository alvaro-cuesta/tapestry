import { makeLogPrefix, type TaskId } from '../utils';
import { CirclesPattern } from './circles';
import { RevolutionPattern } from './revolution';
import { StripesPattern } from './stripes';
import type {
  FromPatternWorkerMessage,
  ToPatternWorkerMessage,
} from './worker';

type GeneratePatternOptions = {
  width: number;
  height: number;
  seed: number;
};

export function generatePattern(
  taskId: TaskId,
  worker: Worker,
  options: GeneratePatternOptions,
  signal: AbortSignal,
): Promise<ImageBitmap> {
  const prefix = makeLogPrefix(taskId, 'generatePattern');

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

    worker.onmessage = ({ data }: MessageEvent<FromPatternWorkerMessage>) => {
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

    worker.postMessage({
      taskId,
      width: options.width,
      height: options.height,
      seed: options.seed,
    } satisfies ToPatternWorkerMessage);
  });
}

export type Pattern = {
  name: string;
  WorkerConstructor: new () => Worker;
};

export const PATTERNS: readonly Pattern[] = [
  CirclesPattern,
  StripesPattern,
  RevolutionPattern,
];
