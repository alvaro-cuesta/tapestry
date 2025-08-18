import { useCallback, useEffect, useRef } from 'react';
import { generateBackground } from '../generator';
import type { Pattern } from '../generator/patterns';
import type { PostFx } from '../generator/postfxs';
import { makeLogPrefix, makeTaskId } from '../generator/utils';
import styles from './BackgroundCanvas.module.css';

type BackgroundCanvasProps = {
  pattern: Pattern;
  postFx: PostFx;
  width: number;
  height: number;
  seed: number;
};

export const BackgroundCanvas = ({
  pattern,
  postFx,
  width,
  height,
  seed,
}: BackgroundCanvasProps) => {
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

      const prefix = makeLogPrefix(taskId, 'BackgroundCanvas');

      if (__DEBUG__) {
        console.debug(prefix, 'Requesting draw with', {
          pattern,
          postFx,
          width,
          height,
          seed,
        });
      }

      abortRef.current?.abort();
      const abortController = new AbortController();
      abortRef.current = abortController;
      const signal = abortController.signal;

      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }

      generateBackground(pattern.WorkerConstructor, postFx.WorkerConstructor, {
        taskId,
        width,
        height,
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

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              console.error('Failed to get canvas context');
              return;
            }

            drawBitmap(ctx);
          });
        })
        .catch((error: unknown) => {
          console.error('Error generating pattern:', error);
          alert(
            `Error generating pattern: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        });
    },
    [],
  );

  useEffect(() => {
    draw(pattern, postFx, width, height, seed);
  }, [pattern, postFx, width, height, seed, draw]);

  return (
    <div
      className={styles['canvas-container']}
      style={{ width, height }}
    >
      <canvas
        ref={canvasRef}
        className={styles['canvas']}
      />
    </div>
  );
};
