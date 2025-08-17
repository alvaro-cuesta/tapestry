import type { Pattern } from '..';
import CircleWorkerConstructor from './worker?worker';

export const CirclePattern: Pattern = {
  name: 'Circle',
  WorkerConstructor: CircleWorkerConstructor,
};
