import { useCallback, useEffect, useRef } from 'react';
import { generateWallpaper } from '../generator';
import type { Pattern } from '../generator/patterns';
import type { PostFx } from '../generator/postfxs';
import { makeLogPrefix, makeTaskId } from '../generator/utils';
import styles from './WallpaperCanvas.module.css';

type WallpaperCanvasProps = {
  pattern: Pattern;
  postFx: PostFx;
  width: number;
  height: number;
  seed: number;
  canvasRef?: React.Ref<HTMLCanvasElement> | undefined;
};

export const WallpaperCanvas = (props: WallpaperCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const draw = useCallback(
    (
      pattern: Pattern,
      postFx: PostFx,
      width: number,
      height: number,
      seed: number,
    ) => {
      const taskId = makeTaskId();

      const prefix = makeLogPrefix(taskId, 'WallpaperCanvas');

      if (__DEBUG__) {
        console.debug(prefix, 'Requesting draw with', {
          pattern,
          postFx,
          width,
          height,
          seed,
        });
      }

      const dpr = window.devicePixelRatio || 1;

      const realWidth = Math.floor(width * dpr);
      const realHeight = Math.floor(height * dpr);

      abortRef.current?.abort();
      const abortController = new AbortController();
      abortRef.current = abortController;
      const signal = abortController.signal;

      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }

      generateWallpaper(pattern.WorkerConstructor, postFx.WorkerConstructor, {
        taskId,
        width: realWidth,
        height: realHeight,
        seed,
        signal,
      })
        .then((drawBitmap) => {
          if (signal.aborted) {
            return;
          }

          requestAnimationFrame(() => {
            if (signal.aborted) {
              return;
            }

            abortRef.current = null;

            canvas.width = realWidth;
            canvas.height = realHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              console.error('Failed to get canvas context');
              return;
            }

            drawBitmap(ctx);
          });
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === 'AbortError') {
            return; // Ignore abort errors since they happen on user cancellation
          }

          console.error('Error generating pattern:', error);
          alert(
            `Error generating pattern: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        });
    },
    [],
  );

  useEffect(() => {
    draw(props.pattern, props.postFx, props.width, props.height, props.seed);
  }, [
    draw,
    props.pattern,
    props.postFx,
    props.width,
    props.height,
    props.seed,
  ]);

  return (
    <div
      className={styles['canvas-container']}
      style={{ width: props.width, height: props.height }}
    >
      <canvas
        ref={(ref) => {
          canvasRef.current = ref;

          if (props.canvasRef) {
            if (typeof props.canvasRef === 'function') {
              props.canvasRef(ref);
            } else {
              props.canvasRef.current = ref;
            }
          }
        }}
        className={styles['canvas']}
        style={{ width: props.width, height: props.height }}
      />
    </div>
  );
};
