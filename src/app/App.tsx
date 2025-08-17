import { useCallback, useState } from 'react';
import styles from '../app/App.module.css';
import { PATTERNS } from '../generator/patterns';
import useWindowSize from '../hooks/useWindowSize';
import { randInt } from '../utils/rand';
import { BackgroundCanvas } from './BackgroundCanvas';

export function App() {
  const [patternIdx, setPatternIdx] = useState(0);
  const [seed, setSeed] = useState(() => randInt());
  const { width, height } = useWindowSize();

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

  const pattern = PATTERNS[patternIdx];
  if (!pattern) {
    throw new Error(`Pattern not found for index: ${patternIdx}`);
  }

  return (
    <>
      <div className={styles['ui-container']}>
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
      <BackgroundCanvas
        pattern={pattern}
        width={width}
        height={height}
        seed={seed}
      />
    </>
  );
}
