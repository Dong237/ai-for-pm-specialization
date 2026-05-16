# Unit 8 · Vitamin 5 状态拆解实操 — Storyboard

## Core concept
Capstone: Take Vitamin's 5 body states × 3 sub-features = 15 cards.
Drag each into: 必须 AI / 都可以 / 必须规则.
Produce the final decision table.

## 12 Sections

### ▶ START
Hook: Module 1.2 的 boss 关 — 把所有理论用在 Vitamin 上.
你 stick figure ready to fight the boss.
4 bullets: review frameworks, analyze 5 states, drag-drop classification, output decision table.

### (1) 终极 Boss: 从理论到实操
The whole module built up to this. Now you combine:
- R/W/C classification (U1)
- 3 death zones (U2-U4)
- Task Analysis: Feasibility × Value (U5)
- AI vs Rules decision tree (U6)
- Accuracy thresholds (U7)

### (2) 回顾核心框架
Quick visual recap of the decision criteria:
- Input structured? → Rules
- Need explainability? → Rules
- Error tolerance? → If low, Rules
- Pattern recognition needed? → AI
- Creative/generative? → AI
- Need personalization at scale? → AI

### (3) Vitamin 5 状态 + 15 子功能
Introduce all 15 features organized by state:
- 经期: 情绪识别, 痛经程度评估, 用药提醒时间计算
- 备孕: 排卵期预测, 营养建议生成, 体温数据分析
- 孕期: 每周发育说明生成, 紧急症状判断, 产检日期计算
- 产后: 情绪支持对话, 喂养量计算, 恢复建议生成
- 更年期: 症状分类识别, HRT药物交互查询, 心理安慰对话

### (4) 经期 状态深入分析
- 情绪识别 → 必须 AI (pattern recognition, unstructured input)
- 痛经程度评估 → 都可以 (can be scale-based rules OR AI NLP)
- 用药提醒时间计算 → 必须规则 (deterministic calculation)

### (5) 备孕 + 孕期 分析
- 排卵期预测 → 都可以 (rules from cycle data, but AI can improve)
- 营养建议生成 → 必须 AI (generative, personalized)
- 体温数据分析 → 都可以 (pattern detection, could be rules)
- 每周发育说明生成 → 必须 AI (generative text)
- 紧急症状判断 → 都可以 (rules as fallback, AI for NLP)
- 产检日期计算 → 必须规则 (pure calendar math)

### (6) 产后 + 更年期 分析
- 情绪支持对话 → 必须 AI (conversation, empathy)
- 喂养量计算 → 必须规则 (formula-based)
- 恢复建议生成 → 必须 AI (personalized generative)
- 症状分类识别 → 必须 AI (NLP classification)
- HRT药物交互查询 → 必须规则 (medical database lookup)
- 心理安慰对话 → 必须 AI (conversation)

### (7) 决策表格式
How to present: columns = 3 categories, rows organized by state.
Each entry has: feature name + why this category + accuracy threshold + safety net.

### (8) WIDGET: Decision Board (drag & drop)
3 columns: 必须AI (green), 都可以 (amber), 必须规则 (red).
15 draggable cards (3 per state, color-coded by state).
Drag into columns. After all placed, show score + suggested answer.

### (9) Vitamin 完整决策表 + 金句
Complete reference table.
Interview gold sentence: methodology description.

### (10) Rule + homework (produce the actual decision document) + resources

### ■ END
Recap grid + summary.
This is last unit: next teaser → back to M2 overview, mention M1.3.
