# U5 Storyboard: 准确率/召回率/F1

## START
Hook: 面试官问: "你的 RAG 召回率多少?" 你一脸懵. 这三个指标是 AI PM 的必修课.

## (1) 一个生活例子
你在相册里搜 "猫". 搜出 10 张, 其中 8 张是猫 2 张是狗 (Precision=80%). 但你相册里一共有 20 张猫, 只找到 8 张 (Recall=40%).

## (2) Confusion Matrix 四格
TP / FP / FN / TN 四个格子, 每个是什么意思.

## (3) Precision 详解
Precision = TP / (TP + FP). "找出来的里面有多少是对的."

## (4) Recall 详解
Recall = TP / (TP + FN). "该找出来的找到了多少."

## (5) P 和 R 的跷跷板
提高 Precision 通常会降低 Recall, 反之亦然. 为什么?

## (6) F1 Score
F1 = 2 * P * R / (P + R). 调和平均数. 一个数字总结两个指标.

## (7) 在 LLM / RAG 场景的应用
RAG 召回率: 相关文档被检索到的比例. 精确率: 检索到的文档中相关的比例.

## (8) WIDGET: Confusion Matrix Builder
20 条 Vitamin 知识库检索结果, 拖到 TP/FP/TN/FN 四格. Precision/Recall/F1 实时更新. 彩色仪表盘.

## (9) Vitamin 知识库评测
Vitamin RAG 目标: Recall > 80% (别漏重要医学信息), Precision > 60% (别塞太多无关内容).

## (10) 规则 + 作业 + 资源
规则: "医疗场景 Recall 优先 — 漏掉一条关键信息比多给一条无关信息危险得多."
