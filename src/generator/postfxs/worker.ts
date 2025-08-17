export type ToPostFxWorkerMessage = {
  bitmap: ImageBitmap;
  seed: number;
};

export type FromPostFxWorkerMessage =
  | { type: 'success'; bitmap: ImageBitmap }
  | { type: 'error'; error: string };

export const registerPostFxWorker = (
  cb: (message: ToPostFxWorkerMessage) => ImageBitmap,
) => {
  self.onmessage = (event: MessageEvent<ToPostFxWorkerMessage>) => {
    try {
      const bitmap = cb(event.data);
      self.postMessage({ type: 'success', bitmap }, { transfer: [bitmap] });
    } catch (error) {
      console.error('Error in worker callback:', error);
      self.postMessage({ type: 'error', error: 'Failed to process post fx' });
      return;
    }
  };
};
