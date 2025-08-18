import type { Pattern } from '..';
import RevolutionWorkerConstructor from './worker?worker';

export const RevolutionPattern: Pattern = {
  name: 'Revolution',
  WorkerConstructor: RevolutionWorkerConstructor,
};
