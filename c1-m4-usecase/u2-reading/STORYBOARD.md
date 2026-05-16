# U2 Reading 类用例 -- Storyboard

## START: Bridge from U1
上一节你学会了把功能放在增强-自动化光谱上.
现在进入具体的 AI 能力: Reading 是 AI 的第一种超能力.
它几乎总是 augmentation -- AI 读文本, 人做决定.

Preview: Summarize / Classify / Extract 三大模式, 动画拆解, Vitamin 实战.

## (1) Observable: 3 user messages, 3 different AI responses
用户写了一段健康日记 (200 字).
AI 能做 3 件完全不同的事: 压缩成 3 条要点 / 判断情绪类别 / 提取症状实体.
同一段文本, 三种 "读法".

## (2) Wrong intuition vs truth
Wrong: "Reading 就是让 AI 理解文本内容"
Truth: Reading 不是 "理解", 是 3 种不同的信息变换:
Summarize = 压缩, Classify = 贴标签, Extract = 挖结构.
PM 要选对变换类型.

## (3) Pattern 1: Summarize
长文本 -> 精华要点. 保留意思, 压缩体积.
Example: 用户写 200 字健康日记 -> AI 输出 3 句核心.
动画: 高亮关键句 -> 淡化冗余 -> 输出摘要.

## (4) Pattern 2: Classify
文本 -> 有限类别标签 + 置信度.
Example: "最近老是睡不好, 心烦" -> {情绪: 焦虑 82%, 疲惫 65%}
动画: 文字扫描 -> 关键词亮起 -> 标签弹出 + 置信度条.

## (5) Pattern 3: Extract
非结构化文本 -> 结构化数据.
Example: "头疼、失眠、食欲不好, 上周开始吃了布洛芬" 
-> {symptoms: [头疼, 失眠, 食欲不好], medication: [布洛芬], timeline: "上周"}
动画: 每个实体变色 + 标签 -> 输出 JSON 卡片.

## (6) When to use which pattern
Decision matrix: input type, output type, Vitamin use case, accuracy concern.
Summarize: 长文本 -> 短文本, 日记总结
Classify: 任意文本 -> N个类别, 情绪识别 / 健康状态
Extract: 文本 -> 结构化字段, 症状提取 / 用药信息

## (7) PM considerations for each
Accuracy thresholds, fallback strategies, user correction UI.
Summarize: 漏关键信息最危险
Classify: 错分类影响下游推荐
Extract: 漏提取 vs 多提取的 tradeoff

## (8) Widget: Reading Toolkit
3 tabs (Summarize / Classify / Extract).
Pre-loaded Vitamin user messages.
Click Process -> scanning animation -> result panel slides in.
User can edit input and re-process.

## (9) Vitamin case study
5-state mapping: each state uses different Reading patterns.
经期: Extract symptoms, Classify severity
备孕: Summarize tracking data, Extract fertility indicators
Specific feature -> Reading pattern mapping.

## (10) Rule + homework
Rule: "拿到文本先问: 要压缩? 要贴标签? 要挖字段? 答案决定用哪个 Reading 模式."
4 tasks + resource table.

## END: Recap + bridge to U3
Reading: text -> data. Writing goes the opposite direction: data -> text.
They're mirrors. Next: Draft / Paraphrase / Expand.
