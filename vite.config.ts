/// <reference types="node" />

import viteReact from '@vitejs/plugin-react';
import { exec } from 'node:child_process';
import process from 'node:process';
import util from 'node:util';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import { patchCssModules } from 'vite-css-modules';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import { VitePWA } from 'vite-plugin-pwa';
import * as packageJson from './package.json';

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const env = loadEnv(mode, process.cwd(), '');
  const gitCommit = (
    await util.promisify(exec)('git rev-parse --short HEAD')
  ).stdout.trim();

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- we want to default to '/' if BASE is empty string too
  const base = env['BASE'] || '/';

  return {
    base,
    plugins: [
      viteReact(),
      patchCssModules({
        // @todo Had to comment this out because it was randomly not generating types for some reason
        // generateSourceTypes: true,
      }),
      ViteImageOptimizer(),
      ViteMinifyPlugin(),
      VitePWA({
        // Although I register as "prompt" I don't really want to prompt users...
        registerType: 'prompt',
        // ...so I register manually in main.tsx...
        injectRegister: false,
        // ...and always immediately activate the latest worker, while not claiming the already existing clients.
        //
        // What I am trying to achieve with this is:
        // - New tabs will always have the latest content and SW
        // - Old tabs will not be refreshed by being claimed
        //
        // I'm not sure if this keeps the old worker alive or if it dies immediately and old tabs just fall back to
        // regular navigation, but I am willing to live with this...
        // I am also really not sure if the tabs become controlled anyways (is skipWaiting causing a mass claim in any
        // case?) but I really don't care since we use name-hashed assets that won't have cache clashes (but the old
        // tabs might not use their old cache... still better that the terrible terrible SW lifecycle.)
        workbox: {
          clientsClaim: false,
          skipWaiting: true,
        },
        manifest: {
          name: packageJson.config.name,
          short_name: packageJson.config.shortName,
          description: packageJson.config.description,
          theme_color: packageJson.config.themeColor,
          background_color: packageJson.config.themeColor,
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        includeAssets: [
          'favicon.ico',
          'favicon.svg',
          'apple-touch-icon-180x180.png',
        ],
        devOptions: {
          enabled: false,
        },
      }),
    ],
    define: {
      __DEBUG__:
        env['DEBUG'] !== undefined && env['DEBUG'] !== 'false' ? true : false,
      __PROFILE__:
        env['PROFILE'] !== undefined && env['PROFILE'] !== 'false'
          ? true
          : false,

      'import.meta.env.GIT_COMMIT_SHORT_SHA': JSON.stringify(gitCommit),
      'import.meta.env.PACKAGE_DESCRIPTION': JSON.stringify(
        packageJson.description,
      ),
      'import.meta.env.PACKAGE_HOMEPAGE': JSON.stringify(packageJson.homepage),
      'import.meta.env.PACKAGE_CONFIG_NAME': JSON.stringify(
        packageJson.config.name,
      ),
      'import.meta.env.PACKAGE_CONFIG_SHORT_NAME': JSON.stringify(
        packageJson.config.shortName,
      ),
      'import.meta.env.PACKAGE_CONFIG_DESCRIPTION': JSON.stringify(
        packageJson.config.description,
      ),
      'import.meta.env.PACKAGE_CONFIG_THEME_COLOR': JSON.stringify(
        packageJson.config.themeColor,
      ),
      'import.meta.env.PACKAGE_CONFIG_URL': JSON.stringify(
        packageJson.config.url,
      ),
      'import.meta.env.PACKAGE_CONFIG_PUBLIC_URL_BASE': JSON.stringify(
        packageJson.config.publicUrlBase,
      ),
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
    server: {
      port: packageJson.config.devPort,
      allowedHosts: packageJson.config.localhostRunTld
        ? [`.${packageJson.config.localhostRunTld}`]
        : [],
    },
    preview: {
      port: packageJson.config.previewPort,
      allowedHosts: packageJson.config.localhostRunTld
        ? [`.${packageJson.config.localhostRunTld}`]
        : [],
    },
  };
});
