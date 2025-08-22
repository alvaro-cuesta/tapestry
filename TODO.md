# Tapestry TODO

> [!NOTE]
> Also remember to do a global search for `@todo` since there are some in code comments.

## Features

- Use device screen size, not HTML size
  - Remember to scale accordingly, attending to aspect ratio
- Allow size selection
- Allow "parallax" mobile phone in size
- Palettes
- Add thumbnails to patterns and postfxs
- Allow applying multiple post fxs in series
- Allow palettes/effects to define their variables and show them in UI
  - E.g. the blur postfx probably wants to expose the blur radius as a slider
- Add more patterns
- Add more postfxs
- Better UI/UX
- Some way to hide UI
- Help button
- Download button (at multiple sizes)
- Consider having normalized coordinates so sizes don't matter that much (think more in vectorial terms)
  - Which also allows patterns/postfxs ignoring width/height
  - But maybe some effect wants width/height? Why? Aspect ratio only maybe?
- Allow downloading at bigger sizes than rendered

## Performance

- Caché the pattern if pattern inputs don't change, so changing postfx is less expensive
- Reconsider a different strategy that `.terminate()` and keep the workers alive (and even re-use the offscreen canvas for same sizes?)
  - But first measure if this makes any actual difference!

## Bugs

- Sometimes scrollbars appear if resizing pixel by pixel... but I don't want to fix this hacking with `scroll: hidden`
- When address bar is hidden in firefox mobile the icons do not go to the bottom

## QoL/Cosmetics

- CSS is currently so ugly
- Spinner for long wallpaper generations
- Can I somehow have a better interaction with the address bar in mobile? It's terrible when it hides
- Disable pull to refresh (at least on PWA)
- Disable pinch-to-zoom (at least on PWA) or make it work on the canvas element instead

## Chores

- Strongly typed CSS modules
- Ensure that vendor CSS is also split
- CSS source maps?

## Research
