/// <reference types="node" />

import react from '@vitejs/plugin-react';
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import { patchCssModules } from 'vite-css-modules';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      patchCssModules({
        // @todo Had to comment this out because it was randomly not generating types for some reason
        // generateSourceTypes: true,
      }),
    ],
    define: {
      __DEBUG__:
        env['DEBUG'] !== undefined && env['DEBUG'] !== 'false' ? true : false,
    },
  };
});
