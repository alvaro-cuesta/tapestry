import { registerPostFxWorker } from '../worker';

registerPostFxWorker('Invert', ({ bitmap }) => {
  const offscreen = new OffscreenCanvas(bitmap.width, bitmap.height);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we just created the canvas so there's no chance of it already having a previous
  const ctx = offscreen.getContext('2d')!;

  // Draw the original bitmap onto the offscreen canvas for manipulation
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  // Invert colors of all pixels
  const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- the data array is guaranteed to have 4 channels per pixel
    data[i] = 255 - data[i]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- the data array is guaranteed to have 4 channels per pixel
    data[i + 1] = 255 - data[i + 1]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- the data array is guaranteed to have 4 channels per pixel
    data[i + 2] = 255 - data[i + 2]!;
    // Alpha channel remains unchanged
  }
  ctx.putImageData(imageData, 0, 0);

  return offscreen.transferToImageBitmap();
});
