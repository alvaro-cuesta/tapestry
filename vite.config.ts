/// <reference types="node" />

import react from '@vitejs/plugin-react';
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import { patchCssModules } from 'vite-css-modules';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- we want to default to '/' if BASE is empty string too
  const base = env['BASE'] || '/';

  return {
    base,
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
      __PROFILE__:
        env['PROFILE'] !== undefined && env['PROFILE'] !== 'false'
          ? true
          : false,
    },
    build: {
      sourcemap: true,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }

            return null;
          },
        },
      },
    },
  };
});
