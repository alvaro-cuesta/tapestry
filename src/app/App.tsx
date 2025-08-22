import {
  RiClipboardFill,
  RiDiceLine,
  RiDownload2Fill,
  RiGithubFill,
  RiShare2Fill,
  RiShareBoxFill,
  RiShareFill,
} from '@remixicon/react';
import cx from 'classnames';
import { useCallback, useRef, useState } from 'react';
import * as packageJson from '../../package.json';
import styles from '../app/App.module.css';
import { PATTERNS } from '../generator/patterns';
import { POST_FXS } from '../generator/postfxs';
import useWindowSize from '../hooks/useWindowSize';
import {
  copyBlobToClipboard,
  downloadBlob,
  openBlobInNewTab,
  shareBlob,
} from '../utils/blob';
import { getErrorMessage } from '../utils/error';
import {
  isApple,
  isClipboardImageWriteSupported,
  isImageShareSupported,
} from '../utils/features';
import { randInt } from '../utils/rand';
import { CircularButton } from './CircularButton';
import circularLinkStyles from './CircularLink.module.css';
import { WallpaperCanvas } from './WallpaperCanvas';

function getImageFilename(width: number, height: number): string {
  return `wallpaper-${width}x${height}-${Date.now()}.png`;
}

// Apple and Android have different share icons
const RiShareGenericFill = isApple
  ? // This icon is not exactly like Apple's but it's probably coser to what an apple user expects
    RiShare2Fill
  : // Use Android's for everything else
    RiShareFill;

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

  const handleShareClick = useCallback(() => {
    getCanvasBlob()
      .then((blob) => shareBlob(blob, getImageFilename(width, height)))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return; // Ignore abort errors since they happen on user cancellation
        }

        console.error('Error sharing image', error);
        alert(`Error sharing image: ${getErrorMessage(error)}`);
      });
  }, [getCanvasBlob, width, height]);

  const handleCopyClick = useCallback(() => {
    getCanvasBlob()
      .then(copyBlobToClipboard)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch((error: unknown) => {
        console.error('Error copying image', error);
        alert(`Error copying image: ${getErrorMessage(error)}`);
      });
  }, [getCanvasBlob]);

  const handleOpenInNewTabClick = useCallback(() => {
    getCanvasBlob()
      .then(openBlobInNewTab)
      .catch((error: unknown) => {
        console.error('Error opening in new tab', error);
        alert(`Error opening in new tab: ${getErrorMessage(error)}`);
      });
  }, [getCanvasBlob]);

  const handleDownloadClick = useCallback(() => {
    getCanvasBlob()
      .then((blob) => {
        downloadBlob(blob, getImageFilename(width, height));
      })
      .catch((error: unknown) => {
        console.error('Error downloading', error);
        alert(`Error downloading: ${getErrorMessage(error)}`);
      });
  }, [getCanvasBlob, width, height]);

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
          {isImageShareSupported ? (
            <CircularButton
              className={styles['ui-button']}
              onClick={handleShareClick}
            >
              <RiShareGenericFill className={cx(styles['ui-button-icon'])} />
            </CircularButton>
          ) : null}

          {isClipboardImageWriteSupported ? (
            <CircularButton
              className={styles['ui-button']}
              onClick={handleCopyClick}
            >
              <RiClipboardFill className={cx(styles['ui-button-icon'])} />
            </CircularButton>
          ) : null}

          <CircularButton
            className={styles['ui-button']}
            onClick={handleOpenInNewTabClick}
          >
            <RiShareBoxFill
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
          <div>
            <a
              className={cx(styles['title-link'])}
              href={packageJson.homepage}
              target="_blank"
              rel="noopener noreferrer"
              title={`${packageJson.config.shortName} v${packageJson.version} (${import.meta.env.GIT_COMMIT_SHORT_SHA})`}
            >
              {packageJson.config.shortName}
            </a>
          </div>

          <a
            className={cx(
              circularLinkStyles['circular-link'],
              styles['ui-button'],
            )}
            href={packageJson.homepage}
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
