# U2 · Token 是什么 — Storyboard

## Hook (START)
"上节课说 LLM '猜下一个字'. 今天来揭一个善意的谎:它猜的不是'字', 是 token."
4 bullets: 什么是 token / BPE 怎么拆 / 中英文 token 差异 / 直接影响你产品烧多少钱

## (1) 上节课的善意谎言
U1 说"猜下一个字". 但 AI 看到的不是"字". 把"今天天气真好"喂给 GPT,
它不是看到 6 个字 — 它看到的是 4 块东西. 这 4 块叫 token.

## (2) 错猜测 vs 真相
✗ Token = 一个汉字? 不是, "今天" 可能是 1 个 token
✗ Token = 一个英文单词? 不是, "unhappiness" 被拆成 "un"+"happiness"
真相: Token 是 tokenizer 按算法切出来的最小单位, 每个模型的切法不一样

## (3) 看一个具体例子
"今天天气真好" → 用 GPT-4 tokenizer 切: [今天, 天气, 真, 好] = 4 tokens
字数 6, token 数 4. 不一样!
换英文: "The weather is great today" → [The, weather, is, great, today] = 5 tokens

## (4) BPE 算法极简版
Byte Pair Encoding: 从单字符开始, 统计最常见的相邻对, 合并.
例: t,h 经常连一起 → 合并成 th. th,e 经常连 → 合并成 the. 重复到词表够大.
像拼乐高: 最常用的组合变成一块大积木.

## (5) 词表大小 = AI 的"字典"
GPT-4: ~100,256 tokens. 这就是它认识的全部"词汇".
常见词 = 1 token (the, 今天). 罕见词 = 拆成多个 token.
类比: 常用汉字你一眼认出, 生僻字要拆偏旁理解.

## (6) 数数的惊喜
"Vitamin" = 1 token (英文常见词)
"维他命" = 3 tokens (中文, 每个字单独切)
同一个意思, 中文版贵 3 倍!

## (7) Subword 的聪明之处
"unhappiness" → "un" + "happiness" (2 tokens, 不是按字母拆)
模型学到了前缀/后缀的意义. 见过 "unhappy", 见过 "happiness",
所以 "unhappiness" 虽然没见过整个词, 也能理解.

## (8) 互动: 输入文字, 看 token 怎么切
Type-and-Tokenize 小工具:
- 预设若干短语 + 自由输入
- 彩色高亮每个 token 边界
- 显示: 字符数 vs token 数 对比

## (9) Vitamin 案例
API 按 token 计费. 中文 Vitamin 比英文版多花 ~1.5x.
算一笔账: 1000 用户 × 5 次/天 × 200 tokens × $0.002/1K = ?/月
Prompt 优化: 少废话 = 省 token = 省钱

## (10) 一句话规则 + 作业
规则: "1 token ≈ ¾ 个英文单词 ≈ ½ 个中文汉字. Token 数 = 你的成本单位."
4 tasks + 资源延伸
