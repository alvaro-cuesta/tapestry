# Tapestry TODO

## Features

- Palettes
- Add thumbnails to patterns and postfxs
- Allow applying multiple post fxs in series
- Allow palettes/effects to define their variables and show them in UI
  - E.g. the blur postfx probably wants to expose the blur radius as a slider

## Performance

- Caché the pattern so applying postfx is "free"
- Reconsider a different strategy that `.terminate()` and keep the workers alive (and even re-use the offscreen canvas for same sizes?)
  - But first measure if this makes any actual difference!

## Bugs

## QoL/Cosmetics

- [PWA](https://vite-pwa-org.netlify.app/)
- Favicons and other crap like tiles, theme color, etc.
- Spinner for long wallpaper generations

## Chores

- Remove crap from initial Vite commit
- Circular dependency checker
- GH pages action
- Strongly typed CSS modules
- Ensure that vendor CSS is also split
- CSS source maps?

## Research

- Transfer OffscreenCanvas and not the ImageBitmap? Has drawbacks like e.g. having a context tied to it
