import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './App.module.css';
import { generateBackground } from './generator';
import { PATTERNS, type Pattern } from './generator/patterns';
import useWindowSize from './hooks/useWindowSize';
import { randInt } from './utils/rand';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [patternIdx, setPatternIdx] = useState(0);
  const [seed, setSeed] = useState(() => randInt());
  const { width, height } = useWindowSize();

  const generate = useCallback(
    (pattern: Pattern, width: number, height: number, seed: number) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      generateBackground(pattern.WorkerConstructor, {
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
    const pattern = PATTERNS[patternIdx];

    if (!pattern) {
      console.error('Pattern not found for index:', patternIdx);
      return;
    }

    generate(pattern, width, height, seed);
  }, [patternIdx, width, height, seed, generate]);

  const handleRegenerateClick = useCallback(() => {
    setSeed(randInt());
  }, []);

  const handlePatternChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newIndex = Number(event.target.value);
      if (newIndex >= 0 && newIndex < PATTERNS.length) {
        setPatternIdx(newIndex);
      } else {
        console.error('Invalid pattern index:', newIndex);
      }
    },
    [],
  );

  return (
    <>
      <div className={styles.App}>
        <button
          type="button"
          onClick={handleRegenerateClick}
        >
          Regenerate
        </button>

        <select
          value={patternIdx}
          onChange={handlePatternChange}
        >
          ç
          {PATTERNS.map((pattern, index) => (
            <option
              // eslint-disable-next-line react-x/no-array-index-key -- we only have indices as keys and they are stable
              key={index}
              value={index}
            >
              {pattern.name}
            </option>
          ))}
        </select>
      </div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
      />
    </>
  );
}
