# Unit 7 · "70% 准确率" 上线门槛 — Storyboard

## Core concept
AI doesn't need 100% accuracy to ship. Different scenarios have different acceptable thresholds.
Content recommendations → 70%. Health advice → 95%. Medical diagnosis → 99%.

## 12 Sections

### ▶ START
Hook: 传统软件要么 100% work, 要么叫 bug. AI 不一样 — 70% 准确率可能就够了.
你 stick figure wondering: "AI 只有 80% 准确, 能上线吗?"
4 bullets: understand risk spectrum, measure accuracy, set thresholds, apply to Vitamin

### (1) 传统软件 vs AI: 完全不同的游戏规则
Traditional: calculator always right. AI: probabilistic, never 100%.
Key shift: "correct vs incorrect" → "acceptable vs unacceptable error rate"

### (2) 错误直觉 vs 真相
Wrong: "AI must be perfect before shipping"
Wrong: "Any AI is better than no AI"
Truth: "Good enough depends on what goes wrong when it's wrong"

### (3) 风险光谱: 从娱乐到生死
The risk spectrum with concrete examples:
- Entertainment/content: 70% (wrong recommendation = mild annoyance)
- Productivity: 85% (wrong summary = wasted time)
- Health wellness: 90% (wrong diet advice = concern)
- Health medical: 95% (wrong symptom assessment = danger)
- Life-critical: 99.9% (wrong drug interaction = death)

### (4) 怎么测 AI 准确率: Golden Test Set
- Golden test set: human-labeled ground truth
- Blind evaluation: AI doesn't see answers
- Metrics: accuracy, precision, recall, F1
- PM角度: 你不需要算, 但需要知道怎么要求

### (5) "Good enough" ≠ "No errors"
- It means errors are tolerable AND caught
- Safety nets: confidence score, human review, fallback
- Example: email spam filter at 95% — the 5% goes to spam folder you can check

### (6) 等到完美的代价
- Competitor ships at 80% while you wait for 95%
- Users give feedback → model improves
- The accuracy flywheel: ship → collect data → retrain → improve
- Perfectionism kills AI products

### (7) 安全网: 让 70% 变成 "够用"
- Human-in-the-loop for edge cases
- Confidence threshold: only show when >80% confident
- Fallback to rules when uncertain
- Graceful degradation: "我不太确定, 建议咨询医生"

### (8) WIDGET: Accuracy Threshold Slider
Slider 50%→100%. 8 scenario cards below.
Each card has a required accuracy threshold.
As slider moves, cards turn green (acceptable) or stay red (needs higher).
Scenarios with thresholds:
- 内容推荐 (65%)
- 聊天陪伴 (70%)
- 情绪分类 (75%)
- 饮食建议 (80%)
- BMI计算 (use rules, 100%)
- 健康建议 (90%)
- 药物交互 (95%)
- 紧急转诊 (99%)

### (9) Vitamin 案例
Each Vitamin feature gets a threshold:
- 情绪支持对话: 75% → can ship early
- 内容推荐: 70% → ship immediately
- 饮食建议: 85% → need decent accuracy
- 症状分类: 90% → need high accuracy + human review
- 药物交互: 99% → use rules, not AI
Interview gold sentence about accuracy thresholds.

### (10) 一句话规则 + 作业 + 资源延伸
Rule: "上线门槛不是 100%, 是'错了会怎样'决定的."
4 homework tasks
3-5 external resources

### ■ END
10-step recap grid
Summary card
Next unit teaser → u8-vitamin-decision
