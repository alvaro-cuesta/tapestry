# Tapestry: the best wallpaper generator

Generate wallpapers/backgrounds for your mobile phone or desktop at a click's distance. Supports multiple beautiful
patterns, custom palettes, post-processing effects...

Try it on https://tapestry.cuesta.dev/

> [!IMPORTANT]
> Currently _best_ is **not guaranteed**. Actually not even _wallpaper generator_ is guaranteed. This is just a very
> early work-in-progress!

## Development

```sh
npm run dev
```

Run lints using:

```sh
npm run lint:tsc
npm run lint:eslint
npm run lint:prettier
# Or just let your IDE do the work with TypeScript/ESLint/Prettier integrations
npm run lint:knip
npm run lint:madge
```

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
