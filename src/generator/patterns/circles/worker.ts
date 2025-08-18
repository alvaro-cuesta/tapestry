import { newRand, randInt, randItem } from '../../../utils/rand';
import { registerPatternWorker } from '../worker';

function drawDonut(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  {
    radius,
    innerRadius,
    color,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
  }: {
    radius: number;
    innerRadius: number;
    color: string;
    shadowColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
  },
) {
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = shadowOffsetX;
  ctx.shadowOffsetY = shadowOffsetY;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.arc(x, y, innerRadius, Math.PI * 2, 0, true);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();
}

const PALLETTE = [
  '#5282f1',
  '#d379e1',
  '#ff7ab6',
  '#ff9986',
  '#ffc865',
  '#f9f871',
  '#d1e3ff',
  '#fff7fb',
  '#f0fff1',
  '#fffcf2',
] as const;

const DONUTS = 16;

registerPatternWorker('Circles', ({ width, height, seed }) => {
  const rand = newRand(seed);

  const offscreen = new OffscreenCanvas(width, height);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we just created the canvas so there's no chance of it already having a previous
  const ctx = offscreen.getContext('2d')!;

  // Draw background
  ctx.fillStyle = randItem(PALLETTE, rand);
  ctx.fillRect(0, 0, width, height);

  const foregroundPalette = PALLETTE.filter((color) => color !== ctx.fillStyle);

  // Draw donuts
  for (let i = 0; i < DONUTS; i++) {
    const radius = randInt(50, 150, rand);
    const innerRadius = randInt(20, radius - 10, rand);
    const x = randInt(radius, width - radius, rand);
    const y = randInt(radius, height - radius, rand);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know the array is not empty
    const color = randItem(foregroundPalette, rand)!;

    drawDonut(ctx, x, y, {
      radius,
      innerRadius,
      color,
      shadowColor: 'black',
      shadowBlur: radius / 5,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    });
  }

  return offscreen.transferToImageBitmap();
});
