import type { PostFx } from '..';
import NoneWorkerConstructor from './worker?worker';

export const NonePostFx: PostFx = {
  name: 'None',
  WorkerConstructor: NoneWorkerConstructor,
};
