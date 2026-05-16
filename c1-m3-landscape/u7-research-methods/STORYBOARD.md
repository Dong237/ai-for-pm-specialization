# U7 Storyboard — 调研模型的方法论

## START
Hook: 你搜了 "2026 年最好的 AI 模型", Google 给你 50 篇文章, 每篇推荐的不一样. 到底该信谁?
Preview: 4 个权威排行榜 + 每个榜单看什么 + 交叉验证法 + Vitamin 选模型前的调研清单

## (1) 50 篇文章, 50 个答案
Observable puzzle: 产品经理搜 "best AI model 2026" 或 "大模型排行榜" 会得到大量矛盾信息. 不同文章推荐的 top 模型不同.

## (2) 错误做法 vs 正确做法
Wrong: 看营销博文 / 看厂商自评. Truth: 看独立第三方排行榜, 且要看多个.

## (3) 榜单 1: Chatbot Arena (lmarena.ai)
Blind human voting, Elo rating. 6M+ votes, 354 models. Current #1: Claude Opus 4.6 Thinking (Elo 1504).

## (4) 榜单 2: SuperCLUE (superclueai.com)
Chinese-specific. Closed: Claude Opus 4.6 > Gemini 3.1 > GPT-5.4 > Doubao-Seed-2.0. Open: Kimi K2.5-Thinking > Qwen3-Max > DeepSeek > GLM.

## (5) 榜单 3: HuggingFace Open LLM Leaderboard
Open-source only. Academic benchmarks. Good for comparing open models.

## (6) 榜单 4: Artificial Analysis (artificialanalysis.ai)
Quality + Speed + Price combined. Intelligence Index. Speed rankings.

## (7) 交叉验证 — 出现在多个榜单的模型才可信
看共识: 多个榜单排名靠前 = 真的强. 只在一个榜单上亮眼 = 可能只是特定任务强.

## (8) Widget: Benchmark Explorer
4 tabs (Arena, SuperCLUE, HuggingFace, Artificial Analysis). Each shows top models. Bottom shows "consensus top 5" — models appearing in multiple lists.

## (9) Vitamin 调研清单
For Vitamin (women's health, Chinese, need cheap + fast): which benchmarks matter most? SuperCLUE for Chinese quality, Artificial Analysis for price/speed.

## (10) One-liner + homework + resources
Rule: "别信单一排行榜, 交叉验证才是真功夫."
