# Tapestry TODO

Also remember to do a global search for `@todo` since there are some in-code comments.

## Features

- Palettes
- Add thumbnails to patterns and postfxs
- Allow applying multiple post fxs in series
- Allow palettes/effects to define their variables and show them in UI
  - E.g. the blur postfx probably wants to expose the blur radius as a slider
- Add more patterns
- Add more postfxs
- Better UI/UX
- Some way to hide UI
- Download button (at multiple sizes)
- Consider having normalized coordinates so sizes don't matter that much (think more in vectorial terms)
  - Which also allows patterns/postfxs ignoring width/height
  - But maybe some effect wants width/height? Why? Aspect ratio only maybe?

## Performance

- Caché the pattern if pattern inputs don't change, so changing postfx is less expensive
- Reconsider a different strategy that `.terminate()` and keep the workers alive (and even re-use the offscreen canvas for same sizes?)
  - But first measure if this makes any actual difference!

## Bugs

## QoL/Cosmetics

- [PWA](https://vite-pwa-org.netlify.app/)
- Favicons and other crap like tiles, theme color, etc.
- Spinner for long wallpaper generations

## Chores

- Remove crap from initial Vite commit
- Strongly typed CSS modules
- Ensure that vendor CSS is also split
- CSS source maps?
