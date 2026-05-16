# Unit 4 · AI 死穴 3 — 稳定性问题 · Storyboard

## ▶ START
Hook: 你问 AI "经期可以跑步吗?", 答案 A 说"当然可以", 答案 B 说"建议休息". 你信哪个?
Preview: 为什么同样的问题会得到不同答案 / 什么时候这是 OK 的、什么时候危险 / 怎么工程化解决 / Vitamin 该怎么办

## (1) Ask AI the same question twice — get different answers
Show two actual-looking AI responses to the same health question, side by side with differences highlighted. "Scary or normal?"

## (2) Wrong intuitions vs truth
Wrong A: "AI 应该像计算器一样, 同样输入同样输出"
Wrong B: "每次不一样说明 AI 不靠谱"
Truth: 随机性是设计进去的 (Temperature), 不是 bug. 但对健康产品, 这个特性需要被控制.

## (3) Why outputs differ — technical root causes
Temperature/sampling, GPU non-determinism, MoE routing, prompt sensitivity. Simplified for PM.

## (4) When inconsistency is OK vs dangerous
Creative writing: inconsistency = feature. Health advice: inconsistency = liability. Spectrum diagram.

## (5) Measuring stability — run N times, compare
Introduce "consistency score" concept. Run same prompt 5x, compare outputs. Semantic similarity.

## (6) Engineering fixes — T=0, seed, caching, post-processing
Four practical strategies PMs can discuss with engineers.

## (7) The "golden answer" pattern — validate against known-good
Pre-approved answers for common health questions. Cache + human review + fallback.

## (8) WIDGET: Stability Tester
5 runs of "经期可以跑步吗?" side by side. Differences highlighted in red. Consistency gauge 0-100%. Slider to change Temperature and see stability change.

## (9) Vitamin case study
Health advice must be consistent. Strategy: T=0 + cached responses for top-50 questions + human-reviewed golden answers + fallback disclaimer.

## (10) Rule + homework + resources
Rule: "稳定性不是 AI 的默认值 — 它是你必须工程化争取的." 
4 tasks + 3-5 resources
