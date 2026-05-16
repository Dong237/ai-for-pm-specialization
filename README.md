# AI for PM Specialization

A self-paced, interactive HTML course teaching **AI Product Management** to non-technical PMs. 4 courses, 16 modules, 132 units — each with a unique interactive widget, hands-on homework, and curated resources.

**Running case study:** Vitamin — a women's health AI app with 5-state body tracking.

## Live Preview

Open `index.html` in any browser (works from `file://`, no server needed). Optimized for **iPad reading** (820×1180 viewport).

## Course Structure

### Course 1: Discover — AI 基础概念 (33 units)

> What is AI, how does it work, and what can it do for products?

| Module | Topic | Units |
|--------|-------|-------|
| M1.1 | LLM 核心概念 | 9 — Token, Context Window, Temperature, Top-P, Hallucination, Multimodal |
| M1.2 | 模型能力边界 | 8 — Reasoning, Coding, Creative Writing, Translation, Summarization |
| M1.3 | AI 产品全景 | 8 — ChatGPT, Claude, Gemini, open-source models, China landscape |
| M1.4 | AI Use Case 优先级 | 8 — Feasibility matrix, build vs buy, ROI estimation, Vitamin use cases |

### Course 2: Design — 产品设计 + PRD (33 units)

> How to turn an AI idea into a professional product design?

| Module | Topic | Units |
|--------|-------|-------|
| M2.1 | AI PRD 写作 | 8 — PRD structure, prompt specs, evaluation criteria, Vitamin PRD |
| M2.2 | Token 经济学 + 成本 | 8 — Pricing models, cost estimation, caching, budget optimization |
| M2.3 | 用户研究 + 体验设计 | 9 — User interviews, persona, UX patterns, trust design, error handling |
| M2.4 | AI 系统架构 | 8 — API architecture, RAG pipeline, guardrails, Vitamin architecture |

### Course 3: Build — 构建 AI 产品 (33 units)

> How to turn a PRD into a working, deployable demo?

| Module | Topic | Units |
|--------|-------|-------|
| M3.1 | Prompt Engineering 系统方法 | 9 — 4-section structure, Few-shot, CoT, XML tags, versioning, debugging |
| M3.2 | Coze Agent 平台实操 | 8 — Bot creation, persona config, knowledge base, workflow, plugins |
| M3.3 | RAG 知识库搭建 | 8 — Embedding, chunking, retrieval, citation, evaluation |
| M3.4 | Python 调 API 自动化 | 8 — Environment setup, API calls, error handling, batch processing, cost logging |

### Course 4: Ship — 上线与拿 offer (33 units)

> How to prove it works, make it safe, scale it, and land the job?

| Module | Topic | Units |
|--------|-------|-------|
| M4.1 | 模型评测体系 | 8 — Golden Set, LLM-as-Judge, Pairwise, P/R/F1, A/B testing, evaluation pipeline |
| M4.2 | AI 安全 + 合规 | 8 — Prompt injection, jailbreak, input filtering, output moderation, NMPA, liability |
| M4.3 | 算法协作 + Multi-Agent | 9 — PM-engineer communication, ReAct, Tool Use, routing, agent handoff |
| M4.4 | 综合面试 + 谈 offer | 8 — Technical questions, STAR method, demo presentation, salary negotiation, 30-60-90 plan |

## Design & Aesthetic

**"Hand-drawn whiteboard online"** — single-page vertical scrollytelling with a warm, sketchy feel.

- **Fonts:** Excalifont (Latin display) + LXGW WenKai (Chinese brush font)
- **Borders:** rough.js hand-drawn SVG borders
- **Cards:** Slight CSS rotations (-1° to +1°) for organic whiteboard feel
- **Themes:** Light (off-white paper) + Dark (slate) — toggle with the sun/moon button
- **Language:** Mixed Chinese-English. Chinese for narrative; English for technical terms

## Each Unit Structure (12 sections)

Every unit follows the same pedagogical structure:

```
START  — Student-perspective hook, stick figure, thought cloud, 4-bullet preview
(1)    — Concrete observable behavior or puzzle
(2)    — Wrong intuitions vs truth bubble
(3-7)  — Build up the mechanism with worked examples
(8)    — Interactive widget (the core teaching moment)
(9)    — Vitamin case study application
(10)   — One-line rule + 4 homework tasks + 3-5 curated resources
END    — 10-step recap grid + one-line summary + next-unit narrative bridge
```

## Interactive Widgets (132 unique)

Every unit has at least one interactive widget built in vanilla JS. Examples:

| Course | Widget | What it does |
|--------|--------|-------------|
| C1 | Token Counter | Type text, see BPE tokenization live with Chinese vs English comparison |
| C1 | Temperature Slider | Adjust temperature, watch probability distribution reshape in real-time |
| C2 | Cost Calculator | Configure model/tokens/calls, see monthly cost with pricing comparison |
| C2 | PRD Builder | Fill in AI-specific PRD sections, see structured document preview |
| C3 | Prompt Builder | 4-tab editor (Role/Task/Context/Format), live combined prompt preview |
| C3 | Code Runner | Python API call display, click Run, see simulated LLM response |
| C3 | RAG Pipeline Animator | Step-through Embed→Retrieve→Augment with real health text |
| C4 | Confusion Matrix | Drag 15 retrieval results into TP/FP/FN/TN, watch P/R/F1 update |
| C4 | Injection Simulator | 5 attack types with defense toggle, red/green result comparison |
| C4 | Multi-Agent Blueprint | Full 3-agent architecture, step-through request flow simulation |
| C4 | STAR Builder | 4-panel interview story editor with preview and time estimate |
| C4 | Offer Comparator | Input multiple offers, weighted scoring, comparison visualization |

## Tech Stack

- **HTML/CSS/JS** — vanilla, no frameworks, no build tools
- **rough.js** — hand-drawn SVG borders (CDN)
- **Chart.js** — small charts where needed (CDN)
- **LXGW WenKai** — Chinese font (CDN)
- **Excalifont** — self-hosted Latin display font
- Works from `file://` protocol — no server required

## File Structure

```
ai_for_pm_specialization/
├── index.html              # Landing page — all 4 courses
├── shared/                 # Design system
│   ├── styles.css          # CSS tokens, light/dark themes, all component classes
│   ├── app.js              # Theme toggle, scroll progress, rough.js borders
│   ├── rough.min.js        # Hand-drawn border library
│   └── fonts/              # Excalifont woff2
├── u1-demo/                # Reference template (Course 1, Unit 1)
├── c1-m1-llm/              # Course 1, Module 1
│   ├── index.html          # Module overview with unit cards
│   ├── u2-token/           # Each unit directory
│   │   ├── index.html      # The unit page (12 sections)
│   │   ├── unit.css        # Unit-specific styles
│   │   ├── unit.js         # Unit-specific widget logic
│   │   └── STORYBOARD.md   # 10-step content outline
│   └── ...
├── c1-m2-capability/       # Course 1, Module 2
├── ...
├── c4-m4-interview/        # Course 4, Module 4 (final module)
└── curriculum.md           # Full 132-unit curriculum blueprint
```

## Target Audience

A non-technical PM transitioning from sales to AI Product Management. The course assumes:
- No programming background (Python is taught from scratch in C3)
- Business acumen and product sense from sales experience
- Chinese as primary language, comfortable with English technical terms
- iPad as primary reading device

## Quality Assurance

Every unit was tested with Playwright headless Chromium:
- **375 screenshots** taken across all 132 units (light, dark, widget, end views)
- All 12 sections verified present in every unit
- Interactive widgets click-tested
- Dark/light theme parity confirmed
- No personal names — uses "你" (you) throughout
- iPad viewport (820×1180, 2x scale) verified

## License

Educational content for personal use. Fonts and libraries are open-source (see respective licenses).

---

Built with vanilla HTML/CSS/JS. No frameworks. No build tools. Just 132 hand-crafted pages.
