import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/main.tsx'],
  project: ['**/*.{js,jsx,ts,tsx}'],
};

export default config;
