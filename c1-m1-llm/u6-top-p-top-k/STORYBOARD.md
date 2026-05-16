# U6 · Top-P / Top-K — Storyboard

## Hook: "Temperature 改的是分布形状. Top-P/K 改的是: 谁有资格被选."

## (1) Temperature 的问题: 即使低 T, 也可能出奇怪的词
## (2) Top-K: 只保留前 K 个候选, 其余概率清零
## (3) Top-P (Nucleus): 保留累计概率 ≥ P 的最少候选
## (4) 为什么 Top-P 通常比 Top-K 更好
## (5) 采样流水线: logits → ÷T → Top-K → Top-P → sample
## (6) API 默认值: OpenAI T=1/P=1, Anthropic T=1/K=-1
## (7) 什么时候用什么
## (8) 互动: 双阈值可视化器
## (9) Vitamin: T=0.2 + Top-P=0.3 组合
## (10) 规则 + 作业
