# U7 Storyboard: 评测自动化 Pipeline

## START
Hook: 你掌握了 Golden Set, LLM Judge, A/B 测试... 但每次改 Prompt 都要手动跑一遍? 周五改了 Prompt, 周一才出评测结果? 太慢了. 要自动化.

## (1) 手动评测的痛
改 Prompt → 手动跑 Golden Set → 手动收集结果 → 手动写报告. 一轮 2 小时.

## (2) 自动化 Pipeline 的概念
一条命令, 自动完成: 加载数据 → 推理 → 评分 → 计算 → 报告. 5 分钟搞定.

## (3) Pipeline 五个阶段
Stage 1: 加载 Golden Set. Stage 2: 运行推理. Stage 3: LLM 评分. Stage 4: 计算指标. Stage 5: 生成报告.

## (4) Stage 1-2: 数据加载 + 推理
从 CSV/JSON 读 Golden Set, 逐条调 API 得到模型输出.

## (5) Stage 3-4: 评分 + 计算
用 LLM Judge 评每条输出, 算 Precision/Recall/F1, 平均分, p 值.

## (6) Stage 5: 报告生成
自动生成 Markdown/HTML 报告: 总分 + 各维度分 + 典型好/坏 case + 与上次对比.

## (7) CI/CD 集成
每次 Git push Prompt 变更, 自动触发 Pipeline. 像代码测试一样测 Prompt.

## (8) WIDGET: Pipeline Builder
5 个阶段卡片, 拖到时间线排序. 点击每阶段配置参数. 点 "Run Pipeline" 看动画执行 + 结果输出.

## (9) Vitamin Pipeline 配置
Vitamin 评测 Pipeline: Golden Set 50 条 → 豆包 API → Claude Judge → P/R/F1 + 平均分 → Markdown 报告.

## (10) 规则 + 作业 + 资源
规则: "Prompt 改一次, Pipeline 跑一次. 没有例外."
