import { registerPostFxWorker } from '../worker';

registerPostFxWorker('Blue', ({ bitmap }) => {
  const { width, height } = bitmap;

  const offscreen = new OffscreenCanvas(width, height);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we just created the canvas so there's no chance of it already having a previous
  const ctx = offscreen.getContext('2d')!;

  // @todo Do better blur -- this technique is somewhat vignetting because it seems to be getting darker towards the edges
  // I assume because it's reading black pixels from the edges -- WebGL with clamping texture sampling will probably be better
  const blurRadius = 40;
  ctx.filter = `blur(${blurRadius}px)`;
  ctx.drawImage(bitmap, 0, 0, width, height);

  return offscreen.transferToImageBitmap();
});
