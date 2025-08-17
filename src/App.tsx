import { useRef, useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import type { FromPatternWorkerMessage } from './patterns';
import CirclePattern from './patterns/circle?worker';
import viteLogo from '/vite.svg';

export function App() {
  const workerRef = useRef<Worker | null>(null);
  if (!workerRef.current) {
    workerRef.current = new CirclePattern();
    workerRef.current.onmessage = (
      event: MessageEvent<FromPatternWorkerMessage>,
    ) => {
      switch (event.data.type) {
        case 'success': {
          const { bitmap } = event.data;
          console.log('Worker sent bitmap:', bitmap);
          const canvas = document.createElement('canvas');
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(bitmap, 0, 0);
            document.body.appendChild(canvas);
          }
          return;
        }
        case 'error': {
          const { error } = event.data;
          console.error('Worker error:', error);
          // Display the error in an alert or log it
          // You can also handle it in the UI if needed
          alert(`Error from worker: ${error}`);
          // Optionally, you could log it to the console or display it in the UI
          // For example:
          // document.body.innerHTML += `<p>Error: ${error}</p>`;
          return;
        }
        default: {
          // Handle unexpected messages
          console.warn('Unexpected message from worker:', event.data);
        }
      }
    };
  }

  const worker = workerRef.current;

  const [count, setCount] = useState(0);

  function handleClick() {
    console.log('Button clicked, sending message to worker');
    worker.postMessage({ width: 800, height: 600 });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
      >
        Click me
      </button>
      <div>
        <a
          href="https://vite.dev"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src={viteLogo}
            className="logo"
            alt="Vite logo"
          />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src={reactLogo}
            className="logo react"
            alt="React logo"
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          type="button"
          onClick={() => {
            setCount((count) => count + 1);
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
