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

  // Generate random line parameters
  const foregroundPalette = PALLETTE.filter((color) => color !== ctx.fillStyle);

  const lineProps = {
    width: randInt(50, 100, rand),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know the array is not empty
    color: randItem(foregroundPalette, rand)!,
    shadowColor: 'black',
    shadowBlur: 40,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  };

  const angle = rand() * Math.PI * 2;
  const lineSeparation = randInt(50, 400, rand); // distance between lines

  // Calculate the diagonal of the canvas
  // Lines need to be at least this long to guarantee they cross the entire canvas, regardless of their rotation
  const diagonal = Math.sqrt(width * width + height * height);

  // Determine how many lines we need to draw on either side of the center to fully cover the canvas
  const numLinesHalf = Math.ceil(diagonal / 2 / lineSeparation);

  for (let i = -numLinesHalf; i <= numLinesHalf; i++) {
    // Calculate the center point of the current line
    // We start at the canvas center (width/2, height/2) and move outwards along the  direction perpendicular to the
    // line's angle (angle + PI/2)
    const lineCenterX =
      width / 2 + i * lineSeparation * Math.cos(angle + Math.PI / 2);
    const lineCenterY =
      height / 2 + i * lineSeparation * Math.sin(angle + Math.PI / 2);

    // From the line's center point, calculate its start and end points
    // We extend half the diagonal length in both directions along the line's angle
    const x1 = lineCenterX - (diagonal / 2) * Math.cos(angle);
    const y1 = lineCenterY - (diagonal / 2) * Math.sin(angle);
    const x2 = lineCenterX + (diagonal / 2) * Math.cos(angle);
    const y2 = lineCenterY + (diagonal / 2) * Math.sin(angle);

    drawLine(ctx, [x1, y1], [x2, y2], lineProps);
  }

  return offscreen.transferToImageBitmap();
});
