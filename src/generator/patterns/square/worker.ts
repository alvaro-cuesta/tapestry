import { newRand } from '../../../utils/rand';
import { registerPatternWorker } from '../worker';

registerPatternWorker(({ width, height, seed }) => {
  const rand = newRand(seed);

  const offscreen = new OffscreenCanvas(width, height);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we just created the canvas so there's no chance of it already having a previous
  const ctx = offscreen.getContext('2d')!;

  // Draw blue background
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, width, height);

  // Draw a white square with a grey border and a black outer drop shadow
  const xOffset = rand() * 100 - 50;
  const yOffset = rand() * 100 - 50;

  ctx.shadowColor = 'black';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = xOffset;
  ctx.shadowOffsetY = yOffset;
  ctx.fillStyle = 'white';
  ctx.fillRect(width / 2 - 50 + xOffset, height / 2 - 50 + yOffset, 100, 100);

  // Disable shadow for the stroke and draw the border
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'grey';
  ctx.lineWidth = 5;
  ctx.stroke();

  return offscreen.transferToImageBitmap();
});
