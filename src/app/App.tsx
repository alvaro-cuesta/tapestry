import {
  RiArrowRightUpFill,
  RiDiceLine,
  RiDownload2Fill,
  RiGithubFill,
} from '@remixicon/react';
import cx from 'classnames';
import { useCallback, useRef, useState } from 'react';
import styles from '../app/App.module.css';
import { PATTERNS } from '../generator/patterns';
import { POST_FXS } from '../generator/postfxs';
import useWindowSize from '../hooks/useWindowSize';
import { randInt } from '../utils/rand';
import { CircularButton } from './CircularButton';
import circularLinkStyles from './CircularLink.module.css';
import { WallpaperCanvas } from './WallpaperCanvas';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [patternIdx, setPatternIdx] = useState(0);
  const [postFxIdx, setPostFxIdx] = useState(0);
  const [seed, setSeed] = useState(() => randInt(0, 2 ** 32));

  const { width, height } = useWindowSize();

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

  const handleReseedClick = useCallback(() => {
    setSeed(randInt(0, 2 ** 32));
  }, []);

  const getCanvasBlob = useCallback(() => {
    return new Promise<Blob>((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('Canvas reference is not set');
        reject(new Error('Canvas reference is not set'));
        return;
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Failed to generate image. Please try again.');
          reject(new Error('Failed to generate image'));
          return;
        }

        resolve(blob);
      }, 'image/png');
    });
  }, []);

  const handleOpenInNewTabClick = useCallback(() => {
    void getCanvasBlob().then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      // @hack If we revoke the URL the opened tab cannot be refreshed or opened in a new tab
      //
      // This is a trade-off between memory usage and usability -- I don't expect users to open many tabs so I'll just
      // leave the URL alive and let the browser handle it when this page closes.
      //
      // DataURLs do not have this problem, but they have other tradeoffs (`window.open` does not work with them in
      // Chrome unless you create an image manually inside the new tab... also they can be large and might be an
      // issue in some browsers due to URL length limits...)
      //
      // URL.revokeObjectURL(blobUrl);
    });
  }, [getCanvasBlob]);

  const handleDownloadClick = useCallback(() => {
    void getCanvasBlob().then((blob) => {
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `wallpaper-${Date.now()}.png`;
      link.href = blobUrl;
      link.click();

      URL.revokeObjectURL(blobUrl);
    });
  }, [getCanvasBlob]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know the index is always valid since it's a <select> on the list itself
  const pattern = PATTERNS[patternIdx]!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know the index is always valid since it's a <select> on the list itself
  const postFx = POST_FXS[postFxIdx]!;

  return (
    <>
      <div className={styles['ui-container']}>
        <div className={styles['ui-top-left']}>
          <select
            name="pattern"
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
            name="postFx"
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

        <div className={styles['ui-bottom-left']}>
          <CircularButton
            className={styles['ui-button']}
            onClick={handleReseedClick}
          >
            <RiDiceLine className={styles['ui-button-icon']} />
          </CircularButton>
        </div>

        <div className={styles['ui-bottom-right']}>
          <CircularButton
            className={styles['ui-button']}
            onClick={handleOpenInNewTabClick}
          >
            <RiArrowRightUpFill
              className={cx(
                styles['ui-button-icon'],
                styles['download-button-icon'],
              )}
            />
          </CircularButton>

          <CircularButton
            className={styles['ui-button']}
            onClick={handleDownloadClick}
          >
            <RiDownload2Fill
              className={cx(
                styles['ui-button-icon'],
                styles['download-button-icon'],
              )}
            />
          </CircularButton>
        </div>

        <div className={styles['ui-top-right']}>
          <a
            className={cx(
              circularLinkStyles['circular-link'],
              styles['ui-button'],
            )}
            href="https://github.com/alvaro-cuesta/tapestry/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiGithubFill
              className={cx(
                circularLinkStyles['circular-link-icon'],
                styles['ui-button-icon'],
                styles['github-button-icon'],
              )}
            />
          </a>
        </div>
      </div>
      <WallpaperCanvas
        canvasRef={canvasRef}
        pattern={pattern}
        postFx={postFx}
        width={width}
        height={height}
        seed={seed}
      />
    </>
  );
}
