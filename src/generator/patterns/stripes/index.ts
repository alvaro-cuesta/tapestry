import type { Pattern } from '..';
import StripesWorkerConstructor from './worker?worker';

export const StripesPattern: Pattern = {
  name: 'Stripes',
  WorkerConstructor: StripesWorkerConstructor,
};
