import type { PostFx } from '..';
import VignetteWorkerConstructor from './worker?worker';

export const VignettePostFx: PostFx = {
  name: 'Vignette',
  WorkerConstructor: VignetteWorkerConstructor,
};
