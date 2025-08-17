import type {
  FromPatternWorkerMessage,
  ToPatternWorkerMessage,
} from './patterns/worker';
import type {
  FromPostFxWorkerMessage,
  ToPostFxWorkerMessage,
} from './postfxs/worker';

type GenerateBackgroundPatternOptions = {
  width: number;
  height: number;
  seed: number;
};

function generateBackgroundPattern(
  worker: Worker,
  options: GenerateBackgroundPatternOptions,
): Promise<ImageBitmap> {
  return new Promise((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<FromPatternWorkerMessage>) => {
      switch (event.data.type) {
        case 'success': {
          resolve(event.data.bitmap);
          break;
        }
        case 'error': {
          reject(new Error(event.data.error));
          break;
        }
        default: {
          // Handle unexpected messages
          console.warn('Unexpected message from worker:', event.data);
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
      width: options.width,
      height: options.height,
      seed: options.seed,
    } satisfies ToPatternWorkerMessage);
  });
}

type ApplyPostFxOptions = {
  bitmap: ImageBitmap;
  seed: number;
};

function applyPostFx(
  worker: Worker,
  options: ApplyPostFxOptions,
): Promise<ImageBitmap> {
  return new Promise((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<FromPostFxWorkerMessage>) => {
      switch (event.data.type) {
        case 'success': {
          resolve(event.data.bitmap);
          break;
        }
        case 'error': {
          reject(new Error(event.data.error));
          break;
        }
        default: {
          // Handle unexpected messages
          console.warn('Unexpected message from worker:', event.data);
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
      bitmap: options.bitmap,
      seed: options.seed,
    } satisfies ToPostFxWorkerMessage);
  });
}

type GenerateBackgroundOptions = {
  width: number;
  height: number;
  seed: number;
  signal: AbortSignal;
};

export async function generateBackground(
  PatternWorkerConstructor: new () => Worker,
  PostFxWorkerConstructor: new () => Worker,
  options: GenerateBackgroundOptions,
): Promise<ImageBitmap> {
  const patternWorker = new PatternWorkerConstructor();
  const postFxWorker = new PostFxWorkerConstructor();

  function terminate() {
    patternWorker.terminate();
    postFxWorker.terminate();
  }

  options.signal.addEventListener('abort', terminate);

  try {
    const patternBitmap = await generateBackgroundPattern(patternWorker, {
      width: options.width,
      height: options.height,
      seed: options.seed,
    });
    const postFxBitmap = await applyPostFx(postFxWorker, {
      bitmap: patternBitmap,
      seed: options.seed,
    });

    return postFxBitmap;
  } finally {
    options.signal.removeEventListener('abort', terminate);
    terminate();
  }
}
