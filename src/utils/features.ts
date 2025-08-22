const ua = navigator.userAgent;

const isFirefoxMobile = /Firefox/i.test(ua) && /Mobile/i.test(ua);

export const isApple = /iPad|iPhone|iPod|Macintosh|MacIntel|MacPPC|Mac68K/.test(
  ua,
);

export const isImageShareSupported =
  // Firefox Mobile has share capabilities but fails to share images
  !isFirefoxMobile && 'share' in navigator && 'canShare' in navigator;

export const isClipboardImageWriteSupported =
  // Firefox Mobile has clipboard write capabilities and supports image/png ClipboardItem... but fails to write images
  // to clipboard anyways
  !isFirefoxMobile &&
  'clipboard' in navigator &&
  typeof ClipboardItem !== 'undefined' &&
  ClipboardItem.supports('image/png');
