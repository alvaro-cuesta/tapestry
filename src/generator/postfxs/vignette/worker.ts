import { registerPostFxWorker } from '../worker';

registerPostFxWorker('Vignette', ({ bitmap }) => {
  const offscreen = new OffscreenCanvas(bitmap.width, bitmap.height);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we just created the canvas so there's no chance of it already having a previous
  const ctx = offscreen.getContext('2d')!;

  // Draw the original bitmap onto the offscreen canvas for manipulation
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  // Apply vignette effect
  const gradient = ctx.createRadialGradient(
    offscreen.width / 2,
    offscreen.height / 2,
    0,
    offscreen.width / 2,
    offscreen.height / 2,
    Math.max(offscreen.width, offscreen.height) / 2,
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, offscreen.width, offscreen.height);

  return offscreen.transferToImageBitmap();
});
