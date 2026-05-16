# AI for PM · Unit 1 Demo

> Direction A · "Karpathy whiteboard online" · 单页 scrollytelling for iPad-first reading
> Light + dark theme. Excalifont + LXGW WenKai. rough.js for hand-drawn borders.

## What's in here

```
u1-demo/
├── index.html              # Unit 1 page — 12 sections (start + 10 steps + end)
├── styles.css              # design tokens, both themes, layout
├── app.js                  # interactive widgets, theme toggle
├── rough.min.js            # hand-drawn SVG library (28KB, self-hosted)
└── fonts/
    └── Excalifont-Regular.woff2  # Excalidraw's font (25KB, self-hosted)
```

Total page weight (uncompressed): **~95KB** of HTML/CSS/JS + 25KB Excalifont + 1 CDN call for LXGW WenKai (smart-subsetted by the page's actual chars, ~50-100KB on first load).

## How to run

**Locally**

```sh
cd u1-demo
python3 -m http.server 8080
# open http://localhost:8080 in Safari / Chrome / iPad
```

Or just double-click `index.html` — works file:// for everything except the LXGW WenKai CDN call (which means Chinese will fall back to PingFang SC / KaiTi system fonts; that's still readable but loses the brush feel).

**Deploy**

The whole folder is static. Drop into:
- **Vercel** — `vercel deploy` from this folder, done in 30 seconds
- **Netlify** — drag the folder onto netlify.com/drop
- **GitHub Pages** — push to `gh-pages` branch
- **Cloudflare Pages** — connect repo, free

No build step. No framework. No package manager.

## Interactives included

1. **Theme toggle** (top-right sun/moon icon) — flips between paper-white and chalkboard, persists to `localStorage`, respects OS `prefers-color-scheme` on first load
2. **Probability bars** (step 4) — animate widths in when scrolled into view (IntersectionObserver)
3. **Autoregressive demo** (step 6) — click "下一轮 →" to generate "今天天气真" + tokens one-by-one, see the candidate distribution per round
4. **Temperature slider** (step 8) — drag from 0 to 1.5, see different generated outputs + Vitamin recommendations
5. **Step rail** (left side, desktop only) — sticky nav showing current step, click to jump
6. **Scroll progress bar** (top, gradient) — shows how far you've read

## Design system

The CSS exposes design tokens via custom properties so you can theme any new content with the same palette:

- Colors: `--ink`, `--ink-soft`, `--ink-muted`, `--blue`, `--green`, `--red`, `--amber`, `--purple` (each with `-bg` and `-bg-soft` variants for backgrounds)
- Highlighter: `mark.hl` — applies yellow with `mix-blend-mode: multiply` (light) or `screen` (dark)
- Cards: `.callout.callout-{color}` — sketchy paper card with tilt
- Wobble: `transform: rotate(-1deg / +0.5deg / ...)` baked into card classes for organic feel

## Adding a new unit

1. Copy `index.html` → `u2.html`
2. Replace the section content (keep the `start / s1...s10 / end` structure)
3. The CSS classes you'll reuse most:
   - `.step` + `.step-num` + `.step-title` + `.step-lede` + `.step-foot`
   - `.callout.callout-{amber|blue|green|red}` for highlighted boxes
   - `.big-question` for the giant red "凭什么???" attention-grabber
   - `mark.hl` to highlight inline phrases
   - Special widgets (prob table, autoregressive, temp slider) live in `app.js` — copy the patterns
4. Update the `<nav class="step-rail">` to match your step count (currently 12 = 1 start + 10 steps + 1 end)

## Why this stack

- **No framework** — vanilla HTML/CSS/JS. Easy to hand off to Claude Code for the remaining 131 units. Each unit is one MDX-equivalent file.
- **Self-hosted Excalifont + rough.js** — page works without the CDN. If you ever go offline, only the LXGW WenKai falls back.
- **Excalifont for Latin display, LXGW WenKai (CDN, smart-subsetted) for Chinese** — keeps the hand-drawn whiteboard feel without sacrificing iPad reading comfort. Both fonts open source.
- **rough.js used sparingly** — only on the 4 most prominent boxes. CSS borders + tilts handle the other 90%, which keeps the page fast.
- **iPad-first** — viewport tested at 820×1180. Tap targets ≥ 44px. Sticky elements use `position: sticky` not fixed (Safari-friendly). No `100vh` traps. No hover-only states.

## Next steps when you're ready

When you scale this to all 132 units, the biggest workflow gain comes from moving to **Astro + MDX**:

```
src/content/
  c1-discover/
    m1-llm/
      u1-llm-is-what.mdx      ← the markdown content + <Tokenizer> imports
      u2-token.mdx
      ...
  components/
    Hero.astro
    Wonder.astro
    Tokenizer.tsx              ← React island, real GPT tokenizer in browser
    TempSlider.tsx
    ProbTable.tsx
```

Then per-unit content is ~100 lines of markdown + a few component imports, instead of 600 lines of HTML. The widgets you build once and reuse across all 4 courses.

But for the first 1-2 units, this hand-rolled HTML demo is faster to iterate on visually — you see exactly what you get, no build step in the way.
