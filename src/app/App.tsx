import { useCallback, useState } from 'react';
import styles from '../app/App.module.css';
import { PATTERNS } from '../generator/patterns';
import { POST_FXS } from '../generator/postfxs';
import useWindowSize from '../hooks/useWindowSize';
import { randInt32 } from '../utils/rand';
import { BackgroundCanvas } from './BackgroundCanvas';

export function App() {
  const [patternIdx, setPatternIdx] = useState(0);
  const [postFxIdx, setPostFxIdx] = useState(0);
  const [seed, setSeed] = useState(() => randInt32());

  const { width, height } = useWindowSize();

  const handleRegenerateClick = useCallback(() => {
    setSeed(randInt32());
  }, []);

  const handlePatternChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newIndex = Number(event.target.value);
      setPatternIdx(newIndex);
    },
    [],
  );

  const handlePostFxChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newIndex = Number(event.target.value);
      setPostFxIdx(newIndex);
    },
    [],
  );

  const pattern = PATTERNS[patternIdx]!;
  const postFx = POST_FXS[postFxIdx]!;

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

        <select
          value={postFxIdx}
          onChange={handlePostFxChange}
        >
          {POST_FXS.map((postFx, index) => (
            <option
              // eslint-disable-next-line react-x/no-array-index-key -- we only have indices as keys and they are stable
              key={index}
              value={index}
            >
              {postFx.name}
            </option>
          ))}
        </select>
      </div>
      <BackgroundCanvas
        pattern={pattern}
        postFx={postFx}
        width={width}
        height={height}
        seed={seed}
      />
    </>
  );
}
