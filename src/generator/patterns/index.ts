import { CirclePattern } from './circle';
import { SquarePattern } from './square';

export type ToPatternWorkerMessage = {
  width: number;
  height: number;
  seed: number;
};

export type FromPatternWorkerMessage =
  | { type: 'success'; bitmap: ImageBitmap }
  | { type: 'error'; error: string };

export type Pattern = {
  name: string;
  WorkerConstructor: new () => Worker;
};

export const PATTERNS: readonly Pattern[] = [CirclePattern, SquarePattern];
