import type { Pattern } from '..';
import SquareWorkerConstructor from './worker?worker';

export const SquarePattern: Pattern = {
  name: 'Square',
  WorkerConstructor: SquareWorkerConstructor,
};
