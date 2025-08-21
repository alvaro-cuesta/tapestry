#!/usr/bin/env tsx

import path from 'node:path';
import sharp from 'sharp';

const pathCwd = process.cwd();
const pathPublicSrc = path.join(pathCwd, 'public-src');
const pathPublic = path.join(pathCwd, 'public');

await Promise.all([
  sharp(path.join(pathPublicSrc, 'tapestry-og-center.svg'))
    .png()
    .toFile(path.join(pathPublic, 'tapestry-og-center.png')),
  sharp(path.join(pathPublicSrc, 'tapestry-twitter.svg'))
    .png()
    .toFile(path.join(pathPublic, 'tapestry-twitter.png')),
]);
