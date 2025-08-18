import { generatePattern } from './patterns';
import { applyPostFx } from './postfxs';
import { checkForNonZeroPixels, makeLogPrefix, type TaskId } from './utils';

type GenerateWallpaperOptions = {
  taskId: TaskId;
  width: number;
  height: number;
  seed: number;
  signal: AbortSignal;
};

export async function generateWallpaper(
  PatternWorkerConstructor: new () => Worker,
  PostFxWorkerConstructor: new () => Worker,
  options: GenerateWallpaperOptions,
): Promise<(ctx: CanvasRenderingContext2D) => void> {
  const { taskId } = options;

  const prefix = makeLogPrefix(taskId, 'GenerateWallpaper');

  const patternWorker = new PatternWorkerConstructor();
  const postFxWorker = new PostFxWorkerConstructor();

  function terminate() {
    if (__DEBUG__) {
      console.debug(prefix, 'Terminating workers');
    }

    patternWorker.terminate();
    postFxWorker.terminate();
  }

  options.signal.addEventListener('abort', terminate);

  try {
    const patternBitmap = await generatePattern(taskId, patternWorker, {
      width: options.width,
      height: options.height,
      seed: options.seed,
    });

    if (__DEBUG__) {
      console.debug(prefix, 'patternBitmap', patternBitmap);
      checkForNonZeroPixels(
        taskId,
        'GenerateWallpaper',
        'patternBitmap',
        patternBitmap,
      );
    }

    const postFxBitmap = await applyPostFx(taskId, postFxWorker, {
      bitmap: patternBitmap,
      seed: options.seed,
    });

    if (__DEBUG__) {
      console.debug(prefix, 'postFxBitmap', postFxBitmap);
      checkForNonZeroPixels(
        taskId,
        'GenerateWallpaper',
        'postFxBitmap',
        postFxBitmap,
      );
    }

    // This pattern is weird -- why don't we just return the bitmap and let the caller draw it?
    //
    // Turns out there's a subtle bug in Chrome where calling `worker.terminate()` before the bitmap is drawn might
    // occasionally cause the bitmap to not render correctly (the receiver sees all 0 pixels). I think this is because
    // the bitmap handle exists but the `transfer` (possibly the underlying buffer transfer) has not completed yet, and
    // `terminate()` might be clearing the buffer as if it was still part of the worker's memory.
    //
    // So we return a function that the caller can call to draw the bitmap, ensuring that the transfer is complete and
    // the bitmap is ready to be drawn, so we can call `terminate()` right after drawing. We do it like this to avoid
    // the caller having to maange the worker lifecycle and maybe forget to call `terminate()` after drawing.
    return function drawBitmap(ctx: CanvasRenderingContext2D) {
      ctx.drawImage(postFxBitmap, 0, 0);
      terminate();
    };
  } finally {
    options.signal.removeEventListener('abort', terminate);
  }
}
