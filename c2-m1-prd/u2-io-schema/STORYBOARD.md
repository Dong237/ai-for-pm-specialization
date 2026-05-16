# U2 Storyboard: AI PRD 模块 1 — 模型 IO 描述

## START — Hook
你让算法工程师做一个 AI 功能, 他第一个问题是: "输入什么? 输出什么? 什么格式?" 如果你答不上来, 他没法开工.

## (1) 算法工程师收到你的 PRD 后的第一个问题
"我需要知道: 什么数据进模型, 模型给我什么回来." 这就是 IO Schema.

## (2) 错觉: "就说输入问题输出回答就行了"
太模糊. 真实的输入不只是"用户问题" — 还有上下文、参数、用户历史等.

## (3) Input Schema 的 5 个核心字段
user_query, context, parameters, user_profile, system_prompt

## (4) Output Schema 的 4 种格式
JSON / Markdown / 纯文本 / 结构化对象. 选哪种取决于下游消费者.

## (5) 一个完整 IO 示例
Vitamin 每日总结功能的完整 Input/Output Schema.

## (6) Schema 的约束: 必填/选填, 类型, 长度限制
好的 Schema 有严格的约束, 避免垃圾进垃圾出.

## (7) IO Schema 在团队协作中的角色
PM 定义 → 算法实现 → 前端消费 → QA 验收. Schema 是四方的合同.

## (8) Interactive: IO Schema Builder
拖拽/选择字段, 构建 Input/Output Schema, 实时预览 JSON.

## (9) Vitamin case study
Vitamin 5 个 AI 功能的 IO Schema 概览.

## (10) 一句话规则 + 作业
