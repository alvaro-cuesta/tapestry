import type { ToPatternWorkerMessage } from '.';

export const registerPatternWorker = (
  cb: (message: ToPatternWorkerMessage) => ImageBitmap,
) => {
  self.onmessage = (event: MessageEvent<ToPatternWorkerMessage>) => {
    try {
      const bitmap = cb(event.data);
      self.postMessage({ type: 'success', bitmap }, { transfer: [bitmap] });
    } catch (error) {
      console.error('Error in worker callback:', error);
      self.postMessage({ type: 'error', error: 'Failed to process pattern' });
      return;
    }
  };
};
