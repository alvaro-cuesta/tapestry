import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App.tsx';
import './index.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- root element exists in index.html
const root = document.getElementById('root')!;

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
