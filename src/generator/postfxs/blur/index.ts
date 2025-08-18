import type { PostFx } from '..';
import BlurWorkerConstructor from './worker?worker';

export const BlurPostFx: PostFx = {
  name: 'Blur',
  WorkerConstructor: BlurWorkerConstructor,
};
