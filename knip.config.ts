import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    'src/main.tsx',
    // used by @vite-pwa/assets-generator
    'pwa-assets.config.ts',
  ],
  project: ['**/*.{js,jsx,ts,tsx}'],
};

export default config;
