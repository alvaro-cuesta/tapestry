import { useCallback, useEffect, useRef } from 'react';
import { generateBackground } from '../generator';
import type { Pattern } from '../generator/patterns';
import type { PostFx } from '../generator/postfxs';
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
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      generateBackground(pattern.WorkerConstructor, postFx.WorkerConstructor, {
        width,
        height,
        seed,
        signal: abortRef.current.signal,
      })
        .then((bitmap) => {
          const canvas = canvasRef.current;
          if (!canvas) {
            console.error('Canvas element not found');
            return;
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.error('Failed to get canvas context');
            return;
          }

          requestAnimationFrame(() => {
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            ctx.drawImage(bitmap, 0, 0);
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
