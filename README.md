<a id="tapestry-the-best-wallpaper-generator"></a>

<h1><a href="https://tapestry.cuesta.dev"><img src="./public/favicon.svg" width="24" height="24" /></a> Tapestry: the best wallpaper generator</h1>

<p align="center">
  <a href="#tapestry-the-best-wallpaper-generator">
    <img src="https://img.shields.io/github/package-json/v/alvaro-cuesta/tapestry" alt="Version" /></a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/alvaro-cuesta/tapestry" alt="License" /></a>
  <a href="https://github.com/alvaro-cuesta/tapestry/actions/workflows/ci.yml">
    <img src="https://github.com/alvaro-cuesta/tapestry/actions/workflows/ci.yml/badge.svg" alt="CI Status" /></a>
  <a href="https://github.com/alvaro-cuesta/tapestry/issues">
    <img src="https://img.shields.io/github/issues/alvaro-cuesta/tapestry" alt="Issues" /></a>
  <a href="#development">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" /></a>
  <a href="https://pr.new/alvaro-cuesta/tapestry" alt="Start new PR in StackBlitz Codeflow">
    <img src="https://developer.stackblitz.com/img/start_pr_small.svg" /></a>
</p>

Generate wallpapers/backgrounds for your mobile phone or desktop at a click's distance. Supports multiple beautiful
patterns, custom palettes, post-processing effects...

<p align="center">
  <a href="https://tapestry.cuesta.dev"><img src="./public/favicon.svg" alt="Tapestry" width="128" height="128" /></a>
  <br />
  <b>Try it now on <a href="https://tapestry.cuesta.dev">tapestry.cuesta.dev</a>!</b>
</p>

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
