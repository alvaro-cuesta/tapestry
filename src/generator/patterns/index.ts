import { CirclePattern } from './circle';
import { SquarePattern } from './square';

export type Pattern = {
  name: string;
  WorkerConstructor: new () => Worker;
};

export const PATTERNS: readonly Pattern[] = [CirclePattern, SquarePattern];
