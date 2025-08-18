import type { TaskId } from '../utils';
import { CirclesPattern } from './circles';
import { SquarePattern } from './square';
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
): Promise<ImageBitmap> {
  return new Promise((resolve, reject) => {
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

export const PATTERNS: readonly Pattern[] = [CirclesPattern, SquarePattern];
