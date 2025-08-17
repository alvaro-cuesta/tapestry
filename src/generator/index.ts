import type {
  FromPatternWorkerMessage,
  ToPatternWorkerMessage,
} from './patterns';

type GenerateBackgroundOptions = {
  width: number;
  height: number;
  seed: number;
  signal: AbortSignal;
};

export async function generateBackground(
  PatternWorkerConstructor: new () => Worker,
  options: GenerateBackgroundOptions,
): Promise<ImageBitmap> {
  const patternWorker = new PatternWorkerConstructor();

  options.signal.addEventListener('abort', () => {
    patternWorker.terminate();
  });

  return new Promise((resolve, reject) => {
    patternWorker.onmessage = (
      event: MessageEvent<FromPatternWorkerMessage>,
    ) => {
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

      patternWorker.terminate();
    };

    patternWorker.onerror = (error) => {
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- we do not control the worker, so we can't guarantee the error type
      reject(error.error);
      patternWorker.terminate();
    };

    patternWorker.postMessage({
      width: options.width,
      height: options.height,
      seed: options.seed,
    } satisfies ToPatternWorkerMessage);
  });
}
