import type { Pattern } from '..';
import CirclesWorkerConstructor from './worker?worker';

export const CirclesPattern: Pattern = {
  name: 'Circles',
  WorkerConstructor: CirclesWorkerConstructor,
};
