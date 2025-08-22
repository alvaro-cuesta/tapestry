import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App.tsx';
import './index.css';

/**
 * How many seconds have to elapse between initial render and getting a SW update for the page to autoreload.
 *
 * This shouldn't be too small since you're likely to miss the SW update... but if it's too large it might irritate the
 * user because the page autoupdates under their feet.
 */
/* const REFRESH_SW_THRESHOLD_MSECS = 1 * 1000; */

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- root element exists in index.html
const root = document.getElementById('root')!;
const reactRoot = createRoot(root);

reactRoot.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

foobar

function foo(bar) {
  
}

// `virtual:pwa-register` (or automatic registration via `injectRegister`) cause all tabs to refresh. I don't want that
// because it might cause users to lose their WIP, so I just register the SW but don't refresh or anything on updates.
// See vite.config.js on why.
if ("serviceWorker" in navigator) {
  /* const startedAt = Date.now(); */

  void navigator.serviceWorker.register('/sw.js', { scope: '/' });
  /*
@todo This is commented-out for now since I hate that the page autorefreshes, no matter how small the delay.

Maybe with a "you can update" prompt it could feel less terrible, but it'll have to wait for now...

    .then((registration) => {
      // There's also an irritating issue with SW where visiting a page that has updates won't show the updates unless
      // you actively refresh. I understand _why_ this happens but I hate it, so I just refresh the page if it's been
      // recently visited.
      //
      // Dude, I hate service workers... I just want a PWA with a somewhat useful cache...
      registration.addEventListener('updatefound', () => {
        const newSw = registration.installing;
        if (!newSw) return;

        newSw.addEventListener('statechange', () => {
          if (newSw.state === 'activated') {
            if (Date.now() - startedAt <= REFRESH_SW_THRESHOLD_MSECS) {
              window.location.reload();
            }
          }
        });
      });
    });
*/
}

// @todo https://vite-pwa-org.netlify.app/guide/periodic-sw-updates -- we might still want this?
