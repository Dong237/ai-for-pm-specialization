# Unit 4 · 模型选型 6 维度 — Storyboard

## ▶ START
Hook: 你现在知道有 GPT-5.5、DeepSeek V4、Claude Opus 4.7、Qwen3.6-Max、Kimi K2.6 ... 可选的模型一大堆. 但老板问你"选哪个", 你怎么答?
Preview: 6 维度框架, radar chart 对比, Vitamin 定制选型

## (1) 一个真实的选型场景
你要给 Vitamin 选模型, 面对 10+ 候选, 怎么比?

## (2) 错误直觉 vs 正确方法
错: "选最贵的 / 选跑分最高的"
对: 按产品需求的 6 个维度打分, 而不是看一个总分

## (3) 维度 1: 成本 (Cost)
API 价格 per million tokens, input + output
DeepSeek V4 Flash $0.14/$0.28 vs GPT-5.5 $5/$30

## (4) 维度 2: 中文能力 (Chinese)
SuperCLUE 排名, 中文语料占比, 中文特有任务表现
国产模型天然优势: Doubao, Qwen, Kimi

## (5) 维度 3: 上下文长度 (Context)
1M tokens = GPT-5.5, Claude Opus 4.7
Vitamin 需要多长? 用户日记 + 历史 ≈ 几千 tokens, 不需要 1M

## (6) 维度 4: 速度 (Speed) + 维度 5: 多模态 (Multimodal)
TTFT, tokens/sec
多模态: 图片识别 (食物拍照), 语音 (暂不需要)

## (7) 维度 6: 推理深度 (Reasoning)
GPQA, AIME 等 benchmark
Vitamin 需要的推理深度: 中等 (健康建议 ≠ 数学竞赛)

## (8) 🎮 Radar Chart Builder Widget
6 轴雷达图, 选模型看分数, 最多对比 3 个模型

## (9) Vitamin Case Study
按 6 维度给 Vitamin 打权重: 成本 > 中文 > 速度 > 推理 > 上下文 > 多模态
得出结论: DeepSeek V4 或 Qwen 是性价比之选

## (10) 一句话规则 + 作业
"选模型不是选最强的, 是选最匹配需求的."
作业: 用 6 维度给 3 个候选模型打分

## ■ END
Recap + 下一课预告 (U5 价格对比实战)
