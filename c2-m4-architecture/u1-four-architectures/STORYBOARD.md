# U1 · 四种 AI 架构概览 — Storyboard

## START: Hook
你做完 PRD, 写完成本模型, 定好指标. 老板问: "那技术上到底怎么实现? 是直接调 API 还是要建知识库?" 你答不上来 — 今天解决.

## (1) 一个 AI 产品, 4 种搭法
同一个"帮用户总结文章"的功能, 可以用 4 种完全不同的架构实现. 复杂度天差地别.

## (2) 错误直觉: "越高级越好"
不对 — 80% 初创产品只需要最简单的 Prompt-only. 过度工程是 AI 产品最常见的死因.

## (3) Level 1: Prompt-only
最简单: 一个 API 调用 + 一个 System Prompt. 不需要数据库, 不需要训练.

## (4) Level 2: RAG
加一个知识库: 用户提问 → 检索相关文档 → 塞进 Prompt → 生成回答. 知识可以随时更新.

## (5) Level 3: Fine-tune
在模型权重里"写入"新知识/风格. 贵, 但某些场景没有替代.

## (6) Level 4: Multi-Agent
多个 AI Agent 分工协作. 最复杂, 但能处理 single-agent 搞不定的多步骤任务.

## (7) 四种架构并排比较 — 复杂度阶梯
一张表: 成本 / 搭建时间 / 维护成本 / 适用场景 对比.

## (8) Interactive: Architecture Spectrum Widget
4 张卡片, 点击展开详情. 拖动滑块看复杂度递增.

## (9) Vitamin 案例
Vitamin 不同功能对应不同架构: 情绪安抚=Prompt-only, 医学知识=RAG, 品牌语调=Fine-tune, 身体翻译器=Multi-Agent.

## (10) 一句话规则 + 作业
规则: "从最简单的架构开始, 只在遇到瓶颈时升级."

## END: Recap + 下节预告
下节: Prompt-only — 80% 产品只需要这个.
