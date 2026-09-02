# Chandra Prakash — Portfolio Site

## Structure
```
project/
├── index.html
├── css/
│   ├── main.css              # Entry point — @imports every file below, in cascade order
│   ├── base/
│   │   ├── variables.css     # Design tokens (colors, fonts, layout, per-component text vars)
│   │   └── reset.css         # Box-model reset + bare element defaults (body, a, ::selection, .maxw)
│   ├── components/           # One file per UI component, self-contained
│   │   ├── cursor.css        # .cursor / .spotlight / .grain
│   │   ├── nav.css           # .nav
│   │   ├── hero.css          # .hero, marquee headline, scroll cue
│   │   ├── toolsbar.css      # .toolsbar (scrolling tool names)
│   │   ├── section.css       # shared <section> padding + .eyebrow label
│   │   ├── statement.css     # .statement bio paragraph
│   │   ├── work.css          # .work-item grid, ghost number, info column
│   │   ├── video-player.css  # .video-frame embedded player + play badge
│   │   ├── services.css      # .svc-grid "What I Do" cards
│   │   ├── timeline.css      # .timeline "Experience" rail
│   │   ├── education.css     # .edu-row
│   │   ├── closing.css       # .magnetic-btn contact button + phone link
│   │   └── footer.css        # footer
│   └── utilities/
│       ├── animations.css    # .reveal scroll-in transition + reduced-motion override
│       └── responsive.css    # cross-component breakpoint overrides (<900px)
└── js/
    └── main.js                # Custom cursor/spotlight, scroll-reveal, magnetic button, inline video playback
```

## CSS architecture
Files are layered **base → components → utilities**, so each layer only ever
overrides what came before it:

1. **base/** — design tokens and the reset. No component-specific selectors.
2. **components/** — one file per UI block (nav, hero, work item, video
   player, services grid, timeline, education row, closing, footer). Each
   file only contains the selectors that belong to that component, so you
   can find, edit, or delete a whole section without touching anything else.
3. **utilities/** — rules that cut across multiple components (scroll-reveal
   animation, responsive breakpoints).

`css/main.css` is the single file `index.html` links to; it just `@import`s
the partials above in the correct order.

**Naming:** classes stay as they were in the original markup (`.work-item`,
`.svc-card`, `.clip-title`, etc.) — already effectively component-scoped
(`block-element` style, close to BEM without the `__`/`--` delimiters) — so
no HTML changes were required. Color values are exposed as per-component
CSS custom properties in `base/variables.css` (e.g. `--text-work-desc`,
`--text-eyebrow`) rather than hard-coded, so any single component's palette
can be retargeted without touching shared tokens.

## Running it
Just open `index.html` in a browser — no build step needed, everything is
plain HTML/CSS/JS. `@import` works natively in all browsers.

For local development with correct relative paths, it's best to serve the
folder rather than double-click the file:
```
cd project
python3 -m http.server 8000
```
then visit `http://localhost:8000`.

## Production note
`@import` issues one HTTP request per partial. That's fine for development,
but for production run the `css/` folder through a bundler (or a simple
`cat`/build script) to concatenate the partials into one file, or replace
the `@import` list in `main.css` with individual `<link rel="stylesheet">`
tags in `index.html` if you'd rather parallelize the requests.

## Notes
- Fonts are still loaded from Google Fonts via `<link>` tags in `index.html`
  (unchanged).
- No content, classes, or behavior were changed — this was a structural
  split of the single `style.css` into component-scoped partials, verified
  rule-for-rule against the original (113 declaration blocks before and
  after the split).
