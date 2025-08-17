import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { patchCssModules } from 'vite-css-modules';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    patchCssModules({
      // @todo Had to comment this out because it was randomly not generating types for some reason
      // generateSourceTypes: true,
    }),
  ],
});
