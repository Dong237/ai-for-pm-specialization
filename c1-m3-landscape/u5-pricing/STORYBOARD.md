# Unit 5 · 价格对比实战 — Storyboard

## ▶ START
Hook: "DeepSeek V4 Flash 的输出价格是 GPT-5.5 的 1/107. 同样的功能, 一年能省几十万."
Preview: 真实价格表, 成本计算器, Vitamin 月度预算

## (1) 一个震惊的数字
DeepSeek V4 Flash output $0.28 vs GPT-5.5 output $30 = 107x 差距

## (2) 为什么价格差这么大
训练成本分摊 + 推理效率 (MoE 稀疏激活) + 商业策略
DeepSeek: MIT 开源, Huawei Ascend 训练, 激进定价

## (3) 完整价格表 (12 个模型)
从 $0.10 Gemini Flash-Lite 到 $30 GPT-5.5 output
国内模型 RMB 价格

## (4) Input vs Output 价格的区别
为什么 output 更贵? 生成比读取消耗更多算力
Vitamin 场景: 用户输入短 (100 tokens), 回复长 (300 tokens)

## (5) Token 数量估算
一条 Vitamin 对话: ~500 tokens 总计
一天 5 次对话, 2500 tokens/user/day

## (6) 月度成本公式
DAU × 日调用次数 × 单次 tokens × 价格 = 月成本

## (7) Cache hit 的省钱魔法
DeepSeek cache hit $0.028 (正常的 1/5)
System prompt 缓存策略

## (8) 🎮 Cost Calculator Widget
输入 DAU, 日调用, tokens/call, 选模型, 算月成本
对比模式: 3 个模型并排
Vitamin preset: 1000 DAU, 5 calls/day, 500 tokens/call

## (9) Vitamin Case Study
1000 DAU 场景下各模型月成本对比
DeepSeek V4 Flash: ~$X/月 vs GPT-5.5: ~$X/月
结论: 早期用便宜模型, 规模上去再考虑升级

## (10) 一句话规则 + 作业
"先算账, 再选模型. 99% 的产品不需要最贵的模型."

## ■ END
Recap + 下一课预告 (U6 国产 vs 国际模型决策树)
