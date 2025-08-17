import { InvertPostFx } from './invert';
import { VignettePostFx } from './vignette';

export type PostFx = {
  name: string;
  WorkerConstructor: new () => Worker;
};

export const POST_FXS: readonly PostFx[] = [VignettePostFx, InvertPostFx];
