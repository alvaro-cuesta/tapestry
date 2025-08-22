import packageJson from '../../package.json';

export async function shareBlob(blob: Blob, filename: string): Promise<void> {
  const file = new File([blob], filename, { type: blob.type });

  // Only `url` seems to do something in Android when files are also shared... but keeping everything just in case it's
  // ever supported
  const shareData = {
    title: 'Check out my wallpaper!',
    text: `I created this wallpaper with ${packageJson.config.name}!`,
    url: packageJson.config.url,
    files: [file],
  };

  if (!navigator.canShare(shareData)) {
    throw new Error('Browser prevented sharing');
  }

  await navigator.share(shareData);
}

export async function copyBlobToClipboard(blob: Blob): Promise<void> {
  if (!ClipboardItem.supports(blob.type)) {
    throw new Error('File type not supported');
  }

  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob,
      /* @todo Currently this works in desktop (text or image is pasted depending on paste context) but on Android it is
               a bit inconsistent: if there is `text/plain` data in clipboard, the image is not shown as pastable for
               some reason...

               This is unfortunate because in Firefox Mobile image write seems to just fail completely for some reason,
               so it would be nice to at least copy some ad text.

         @todo Maybe we can fake this by creating an image, selecting it and then calling execCommand('copy')??

      'text/plain': `I created this wallpaper with ${packageJson.config.name}!

${packageJson.config.url}`,
*/
    }),
  ]);
}

export function openBlobInNewTab(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
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
}

export function downloadBlob(blob: Blob, filename: string): void {
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = filename;
  link.href = blobUrl;
  link.click();

  URL.revokeObjectURL(blobUrl);
}
