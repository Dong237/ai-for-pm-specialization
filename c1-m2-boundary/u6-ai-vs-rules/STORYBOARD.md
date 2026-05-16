# Unit 6 · AI vs 规则的决策准则 · Storyboard

## ▶ START
Hook: "这个功能该用 AI 还是 if-else?" — PM 每天都在问的问题.
Preview: 6 条判断标准 / 决策树可视化 / 互动问答工具 / Vitamin 5 状态过筛

## (1) The PM's daily question
Show a concrete scenario: Vitamin needs to classify user mood. Use AI or rules?

## (2) Wrong intuitions vs truth
Wrong A: "AI 比规则高级, 能用 AI 就用 AI"
Wrong B: "规则更稳定, 尽量别用 AI"
Truth: 各有擅长场景. 很多功能用"AI + 规则"组合最优.

## (3) Criterion 1-2: Structured input → rules. Explainability → rules.
Q1: 输入是否结构化? 
Q2: 输出是否需要可解释?

## (4) Criterion 3-4: Error tolerance → rules if low. Creativity → AI.
Q3: 用户能容忍偶尔出错吗?
Q4: 是否需要创造性/个性化?

## (5) Criterion 5-6: Little data → rules. Real-time → depends.
Q5: 数据量是否足够?
Q6: 是否需要实时更新?

## (6) The decision tree flowchart
Visual flowchart combining all 6 questions.

## (7) Gray areas — "Use Both"
AI for understanding/classification, rules for enforcement/validation. The hybrid approach.

## (8) WIDGET: Decision Tree Wizard
6 yes/no questions, animated step-through. Shows verdict with explanation.

## (9) Vitamin: run 5 states through the decision tree
Each body state → which features use AI, which use rules.

## (10) Rule + homework + resources
Rule: "AI 做理解, 规则做执行 — 这是最安全的组合."
