# U4 · Prompt Caching 机制 — Storyboard
## START: DeepSeek V4 缓存命中 98% 折扣
## (1) 每次调用都带同样的 system prompt — 浪费
## (2) Prompt Caching: 缓存 KV 向量, 跳过重复计算
## (3) 各家缓存折扣: DeepSeek 98%, Anthropic 90%, OpenAI 50%
## (4) 前缀匹配: 缓存只对 prompt 开头有效
## (5) 怎么设计 prompt 让缓存命中最大化
## (6) 缓存命中率的关键: 稳定前缀 + 变化后缀
## (7) 跟踪缓存: cache_hit_tokens vs cache_miss_tokens
## (8) 互动: Cache Hit Simulator widget
## (9) Vitamin 案例: system prompt 缓存设计
## (10) 一句话规则 + 作业
