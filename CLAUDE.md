# AI PM 课 · Project Instructions

## What this project is
A self-paced HTML/CSS/JS course teaching AI Product Management to a non-technical PM transitioning from sales. Single-page scrollytelling, optimized for iPad reading. The course will eventually contain 4 courses × 4 modules × ~8 units = 132 units. The student's current product is "Vitamin" — a women's health AI app with 5-state body tracking — used as the running case study throughout.

**Working scope:** unless told otherwise, work only inside one module at a time. Do not modify other modules. Do not modify `u1-demo/` (it's the reference template).

## Aesthetic direction (NON-NEGOTIABLE)
"Hand-drawn whiteboard online" — single-page vertical scrollytelling, off-white paper backgrounds in light theme, dark slate in dark theme, sketchy hand-drawn borders, light tilts (-1° to +1°) on cards, Excalidraw font (Excalifont) for Latin display, LXGW WenKai brush font for Chinese.

The reference template is `u1-demo/`. Read all of these BEFORE any new build:
- `u1-demo/index.html` — page structure (▶START + 10 numbered steps + ■END)
- `u1-demo/styles.css` — design tokens, both themes, every reusable component class
- `u1-demo/app.js` — interactive widget patterns (theme toggle, scroll progress, prob bars, autoregressive demo, temperature slider, rough.js sketchy borders)
- `u1-demo/README.md` — design rationale

Do not introduce new fonts, new color tokens, or new layout patterns without strong justification. Use existing classes: `.callout-{amber|blue|green|red}`, `.step`, `.step-num`, `.step-title`, `.step-lede`, `.step-foot`, `mark.hl`, `.btn-primary`, `.btn-ghost`, `.pill-{blue|green|amber}`, etc.

## Per-unit structure (MANDATORY 12 sections)
Every unit is one HTML page with this exact structure:
- **▶ START** — student-perspective hook, stick-figure 你, thought cloud asking the question, 4-bullet preview of what they'll learn, "走起 →" call to action
- **Steps (1) through (10)** — 10 numbered sections building the concept
- **■ END** — 10-step recap grid + one-line summary card + next-unit teaser card

Step rhythm to follow:
- (1) Concrete observable behavior or puzzle that opens the question
- (2) Wrong intuitions vs. truth bubble — the key insight
- (3)–(7) Build up the mechanism with a worked example, increasing in technical depth
- (8) Interactive widget showing the concept dynamically (this is where the unit really teaches)
- (9) Vitamin case study — what does this concept mean for product decisions / can / cannot
- (10) One-line rule + 4-task homework + 资源延伸 (extra resources)

## CRITICAL: Search the web before each unit
Before storyboarding or coding any unit, you MUST web-search for existing high-quality explainers. This is the difference between a textbook page and a memorable lesson.

Search queries to run for each unit (substitute the concept):
1. `"<concept>" interactive explainer`
2. `"<concept>" visualization`
3. `"<concept>" 3d demo`
4. `"<concept>" distill.pub OR bbycroft OR observablehq`
5. `"<concept>" for product managers`
6. `"<concept>" 中文 教程` (Chinese-language coverage)

Always check these known-good sources:
- distill.pub — the gold standard for ML explainers
- bbycroft.net/llm — interactive 3D LLM visualizer
- tiktokenizer.vercel.app — token visualizer
- transformer-explainer (PoloClub Georgia Tech) — interactive transformer
- huggingface.co/spaces — hundreds of demos
- 3blue1brown YouTube — math intuition
- observablehq.com — interactive notebooks
- arxiv-sanity for any current research framing

For each top-3 result, decide:
- **Great explainer?** → link it in the homework's 资源延伸 section
- **Clever visual metaphor?** → adopt it, don't reinvent
- **Embeddable interactive?** → either iframe it OR build a simplified inline version

## When to use 3D / advanced visualizations
Use Three.js (via CDN) when the spatial relationship IS the lesson:
- Embedding spaces (vectors as points, similar items cluster)
- Multimodal alignment (text/image/audio mapping to one shared space)
- Attention as a 3D pattern only if 2D really fails

Stay 2D for:
- Probability distributions (bars / lines)
- Token streams (linear)
- Temperature / Top-P sliders (slider + distribution shape)
- Timelines (1D)
- Cost calculators (table + numbers)

Rule: 3D earns its place only when removing it removes meaning. Don't 3D for novelty.

## Homework section requirements (EVERY UNIT)
After step 10, every unit ends with a `.callout.callout-green` containing:

**4 hands-on tasks** (≈30 min total) — derived from the curriculum doc's 课后产出 row, or synthesized if not specified. Tasks should be doable on a phone/laptop with free tools, and at least one should reference the Vitamin product.

**资源延伸 (3–5 extra resources)** — labeled by type, each with title / source / one-line value / time estimate. Format as a small table or a styled list:

| Type | What | Source | Why it's worth your time | Time |
|------|------|--------|--------------------------|------|
| 🎮 | Live demo | site.com | sees the concept directly | 5 min |
| 📺 | Video | YouTube | clearest video walkthrough | 20 min |
| 📖 | 中文文章 | 知乎 / 36kr | Chinese-language deep dive | 15 min |
| 📄 | Paper | arxiv | original source if she wants depth | 1 hr |

Type icons: 🎮 interactive · 📺 video · 📖 article · 📄 paper · 🎤 podcast · 🛠 tool

Verify every URL returns 200 (curl -I) before shipping the unit. Prefer Chinese-language resources when they're high quality (the student is a Chinese PM).

## Each unit MUST have ≥1 unit-specific interactive widget
Not just templated content — at least one new widget that this unit's concept needs. Use vanilla JS, optionally with these CDN libraries:
- @dqbd/tiktoken (WASM tokenizer for U2/U3)
- d3 (data viz)
- three.js (only when 3D earns it)
- chart.js (small charts)

Reuse the U1 widget patterns where applicable (probability bar, slider, click-to-advance) — only build new widgets where the concept demands it.

## File structure
project-root/
├── CLAUDE.md
├── curriculum.md
├── u1-demo/                 # already built — DO NOT MODIFY
├── shared/                  # extract on first new unit
│   ├── styles.css           # design system
│   ├── app.js               # base widgets (theme toggle, scroll, prob bars)
│   ├── rough.min.js
│   └── fonts/Excalifont-Regular.woff2
└── c1-m1-llm/               # this module's build target
├── index.html           # module overview, links all 9 units
├── u2-token/
│   ├── index.html
│   ├── unit.css         # unit-specific overrides only
│   └── unit.js          # unit-specific widgets only
├── u3-tokenizer-zh-en/
├── u4-context-window/
├── u5-temperature/
├── u6-top-p-top-k/
├── u7-hallucination/
├── u8-knowledge-cutoff/
└── u9-multimodal/


On the very first unit (U2), refactor: copy `u1-demo/{styles.css, app.js, rough.min.js, fonts/}` to `shared/`. Each unit's `index.html` then links `../../shared/styles.css`, `../../shared/app.js`, `./unit.css`, `./unit.js`.

## Quality checklist (verify per unit, before declaring done)
- [ ] All 12 sections present (▶START + 10 steps + ■END)
- [ ] At least 1 unit-specific interactive widget that didn't exist in U1
- [ ] Web-search done; 3–5 external resources linked in homework
- [ ] Every external URL returns 200 (curl -I or playwright check)
- [ ] Light + dark theme verified at iPad viewport (820×1180) — screenshot if Playwright available
- [ ] No personal names anywhere (use "你" / "学员" / "PM" / "产品经理" — never first names)
- [ ] Vitamin case study referenced in steps 9–10
- [ ] Next-unit teaser at end pointing to the following unit
- [ ] Page loads from `file://` (no broken relative paths)
- [ ] No new fonts or color tokens introduced

## Workflow per unit
1. Read this file, `curriculum.md`, and `u1-demo/index.html` (always re-read — context refresh)
2. **Web-search** the concept (5 queries above), spend ~5 min surveying
3. Sketch the 10-step storyboard as comments in a `STORYBOARD.md` next to the unit
4. Build the HTML / CSS / JS
5. Self-validate against quality checklist
6. Output a one-line confirmation: `[Unit Done] U<N> · <title>` with file paths and 1-paragraph summary
7. Move to the next unit

Build all units in one session unless stopped. After the last unit, build the module overview page.

## What you MUST NOT do
- Do not invent new fonts, colors, or layout patterns
- Do not skip the web-search step (it's what makes the unit memorable)
- Do not include any real personal names
- Do not embed copyrighted content directly (lyrics, full articles, paid videos) — link to sources
- Do not over-engineer — vanilla HTML/CSS/JS only, no React, no build tools, no TypeScript
- Do not break light/dark theme parity
- Do not skip homework's 资源延伸 section
- Do not modify `u1-demo/`

## Tone & language
Mixed Chinese-English. Chinese for narrative and explanation; English left as-is for technical terms (Token, Temperature, Hallucination, Context Window, Top-P, Multimodal, etc.). Talk to the student like a smart friend, not a textbook — same warmth + concreteness as `u1-demo/`. Use 你, not 您. Use a "let me show you something cool" register, not a "this is important" register.