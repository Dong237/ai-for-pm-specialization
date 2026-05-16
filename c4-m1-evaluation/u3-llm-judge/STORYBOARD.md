# U3 Storyboard: LLM as Judge

## START
Hook: 50 条 Golden Set 写好了. 每条让人来评, 要半天. 每改一次 Prompt 都评一遍? 不现实. 解法: 让 AI 评 AI.

## (1) 人评的困境
慢, 贵, 不一致. 两个人评同一条, 分数差 2 分是常事.

## (2) LLM as Judge 的核心思路
用 GPT-4 / Claude 做评委, 给它评分标准 + 待评内容, 让它打分. 80%+ 与人评一致.

## (3) Judge Prompt 三要素
角色设定 + 评分维度 (准确性/安全性/有用性) + 输出格式 (分数 + 理由).

## (4) 写一个好的 Judge Prompt
具体示例: Vitamin 健康建议评分模板. 包含 Rubric 评分标准.

## (5) Judge 的三大偏见
位置偏见 (先出现的得高分), 冗长偏见 (长答案得高分), 自我偏见 (偏爱自己风格).

## (6) 如何缓解偏见
位置: 交换顺序评两次. 冗长: 明确 "简洁加分". 自我: 用不同品牌模型做 Judge.

## (7) G-Eval 方法
Google 提出: 让 LLM 先列评分步骤, 再打分. 比直接打分更稳定.

## (8) WIDGET: Judge Prompt Tester
文本区写评判标准, 3 条 Vitamin 样本输出被 "评委" 打分. 可切换不同 Judge Prompt 看分数变化.

## (9) Vitamin Judge 配置
Vitamin 建议用 Claude 做 Judge, 评三维: 医学准确性 / 安全合规 / 用户友好度.

## (10) 规则 + 作业 + 资源
规则: "LLM Judge 是 80 分的评委 — 够用, 但别忘了抽检."
