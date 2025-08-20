# Tapestry: the best wallpaper generator

Generate wallpapers/backgrounds for your mobile phone or desktop at a click's distance. Supports multiple beautiful
patterns, custom palettes, post-processing effects...

<div align="center" style="font-size:24px; text-decoration:none; font-weight:bold;">
  Try it on <a href="https://tapestry.cuesta.dev">tapestry.cuesta.dev</a>!
</div>

> [!IMPORTANT]
> Currently _best_ is **not guaranteed**. Actually not even _wallpaper generator_ is guaranteed. This is just a very
> early work-in-progress!

## Development

It's easy to contribute even if you are not familiar with [Node.js](https://nodejs.org) development. E.g., if you are
well-versed with procedural image generation your contributions are appreciated to grow our effect collection!

Install [Node.js](https://nodejs.org), clone this repository and run this in the root of the project to install the
required dependencies:

```sh
npm install
```

### Local development

Just run this to start a local development server and follow the instructions:

```sh
npm run dev
```

### Lints

You should periodically run linters to ensure the code passes some basic checks:

```sh
npm run lint:tsc
npm run lint:eslint
npm run lint:prettier
# Or just let your IDE do the work with TypeScript/ESLint/Prettier integrations
npm run lint:knip
npm run lint:madge
```

These are automatically run as checks on GitHub Actions, but it's better if you keep lints up to date as you code!

### Things to do

- See [`TODO.md`](TODO.md) for outstanding general tasks.
- You can add new patterns in [`/src/generator/patterns/`](./src/generator/patterns/). See e.g.
  [`/src/generator/patterns/circles/`](./src/generator/patterns/circles/).
- You can add new post fxs in [`/src/generator/postfxs/`](./src/generator/postfxs/). See e.g.
  [`/src/generator/postfxs/vignette/`](./src/generator/postfxs/vignette/).

### Additional information

See `DEBUG` and `PROFILE` env vars in [`vite.config.ts](./vite.config.ts).

## Build

```sh
npm run build
npm run preview
```
