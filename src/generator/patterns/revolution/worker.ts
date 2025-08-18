import { newRand, randInt, randItem } from '../../../utils/rand';
import { registerPatternWorker } from '../worker';

function drawLine(
  ctx: OffscreenCanvasRenderingContext2D,
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
  {
    width,
    color,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
  }: {
    width: number;
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
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();

  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
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

registerPatternWorker('Lines', ({ width, height, seed }) => {
  const rand = newRand(seed);

  const offscreen = new OffscreenCanvas(width, height);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we just created the canvas so there's no chance of it already having a previous
  const ctx = offscreen.getContext('2d')!;

  // Draw background
  ctx.fillStyle = randItem(PALLETTE, rand);
  ctx.fillRect(0, 0, width, height);

  // Fill with lines filling the canvas
  const foregroundPalette = PALLETTE.filter((color) => color !== ctx.fillStyle);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know the array is not empty
  const color = randItem(foregroundPalette, rand)!;
  const angle = rand() * Math.PI * 2;
  const lineWidth = randInt(1, 30, rand);
  const lineSeparation = randInt(lineWidth, lineWidth + 50, rand);

  for (let i = 0; i < width + height; i += lineSeparation) {
    const x1 = -i * Math.cos(angle);
    const y1 = -i * Math.sin(angle);
    const x2 = width + i * Math.cos(angle);
    const y2 = height + i * Math.sin(angle);

    drawLine(ctx, [x1, y1], [x2, y2], {
      width: lineWidth,
      color,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
    });
  }

  return offscreen.transferToImageBitmap();
});
