import { registerPostFxWorker } from '../worker';

registerPostFxWorker('None', ({ bitmap }) => {
  return bitmap;
});
