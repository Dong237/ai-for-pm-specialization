# U4 Storyboard: Pairwise 比较 vs 单点打分

## START
Hook: 让你给一杯咖啡打分 1-5 分, 你犹豫半天给了 4 分. 但让你说 "A 和 B 哪杯更好", 你秒答. 为什么?

## (1) 单点打分的不稳定
同一条输出, 今天打 4 分明天打 3 分. 人评如此, LLM Judge 也如此.

## (2) Pairwise 的心理学优势
比较判断比绝对判断容易. Chatbot Arena 用的就是 Pairwise.

## (3) Pairwise 怎么做
两条输出并排, 选 A 赢 / B 赢 / 平局. 不需要给分数.

## (4) 单点打分怎么做
对每条输出独立打 1-5 分. 附带评分标准 Rubric.

## (5) 各自的优缺点对比
Pairwise: 稳定但无法绝对定位 (只知道谁更好, 不知道好多少). 单点: 有绝对分数但方差大.

## (6) 什么场景用哪种
比较两版 Prompt → Pairwise. 监控质量趋势 → 单点. 排行榜 → Pairwise + Elo.

## (7) Elo 评分系统
Chatbot Arena 的 Elo 原理: 每场比赛更新积分, 最终排名. 简化解释.

## (8) WIDGET: Comparison Arena
展示同一 Vitamin 问题的两版输出. 用户做 Pairwise 选择, 也做 Pointwise 打分. 跑 10 轮, 显示稳定性对比图 (Pairwise 方差更低).

## (9) Vitamin 评测方案选择
Vitamin 改 Prompt 时用 Pairwise 快速比; 月度报告用单点打分记录趋势.

## (10) 规则 + 作业 + 资源
规则: "要比较用 Pairwise, 要趋势用 Pointwise. 别混着来."
