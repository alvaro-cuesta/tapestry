import { registerPatternWorker } from '..';
import { newRand } from '../../../utils/rand';

registerPatternWorker(({ width, height, seed }) => {
  const rand = newRand(seed);

  const offscreen = new OffscreenCanvas(width, height);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we just created the canvas so there's no chance of it already having a previous
  const ctx = offscreen.getContext('2d')!;

  // Draw blue background
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, width, height);

  // Draw a white circles with a grey border and a black outer drop shadow
  const xOffset = rand() * 100 - 50;
  const yOffset = rand() * 100 - 50;

  ctx.shadowColor = 'black';
  ctx.shadowBlur = 100;
  ctx.shadowOffsetX = xOffset;
  ctx.shadowOffsetY = yOffset;
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(
    width / 2 + xOffset,
    height / 2 + yOffset,
    Math.min(width, height) / 4,
    0,
    Math.PI * 2,
  );
  ctx.closePath();
  ctx.fill();

  // Disable shadow for the stroke and draw the border
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'grey';
  ctx.lineWidth = 5;
  ctx.stroke();

  return offscreen.transferToImageBitmap();
});
