import type { PostFx } from '..';
import InvertWorkerConstructor from './worker?worker';

export const InvertPostFx: PostFx = {
  name: 'Invert',
  WorkerConstructor: InvertWorkerConstructor,
};
