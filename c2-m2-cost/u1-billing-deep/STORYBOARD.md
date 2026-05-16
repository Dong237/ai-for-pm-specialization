# U1 · Token 计费机制 (深化) — Storyboard

## START: Hook
你打开 DeepSeek 的账单, 发现同一句话在不同模型上价格差 100 倍. 为什么?

## (1) 一条 API 调用的账单长什么样
展示一个真实 API response 里的 usage 字段: prompt_tokens, completion_tokens, total_tokens

## (2) 错猜测: "按字数收费" vs 真相: "按 token 收费"
Token ≠ 字符 ≠ 单词. 计费单位是 token, 不同模型的 token 定义不同.

## (3) 各家定价一览表 (截至 2026 年 5 月)
DeepSeek V4 Flash $0.14/$0.28, GPT-5.5 $5/$30, Claude Opus 4.7 $5/$25, Qwen3 Max $0.78/$3.12

## (4) 100 倍的价差从哪来
最便宜 (DeepSeek V4 Flash $0.14) vs 最贵 (GPT-5.5 Pro $30) = 214 倍差距

## (5) 计费精度: 按 1M token 计
所有主流 API 都按百万 token 为单位报价. 单次调用通常几百到几千 token.

## (6) 隐藏成本: reasoning tokens / 思考 token
o3/DeepSeek R1 等推理模型会产生不可见的"思考 token", 实际消耗可能是显示的 3-5 倍

## (7) Batch API 与延时换折扣
OpenAI/Anthropic 的 Batch API 50% 折扣, 但需要等 24 小时

## (8) 互动: Multi-Model Billing Comparison Widget
输入一段文字, 实时显示在 5 个模型上的费用对比

## (9) Vitamin 案例: 选哪个模型
Vitamin 日常对话用 DeepSeek V4 Flash, 健康建议用 Claude Sonnet, 复杂诊断走 GPT-5.4

## (10) 一句话规则 + 作业
"Token 是 AI 产品的水电煤 — 不同供应商水费差 100 倍, 选错了月底账单吓死你."
