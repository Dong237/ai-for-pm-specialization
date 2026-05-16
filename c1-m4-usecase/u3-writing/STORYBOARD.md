# U3 Writing 类用例 -- Storyboard

## START: Bridge from U2
Reading 和 Writing 是镜像. Reading: text->data. Writing: data->text.
如果 Reading 是 AI 的 "耳朵", Writing 就是 AI 的 "嘴巴".

Preview: Draft / Paraphrase / Expand 三大模式, Temperature 回调, Vitamin 内容生成.

## (1) Observable: Same data, 3 different text outputs
Vitamin 知道用户状态: {state: 经期, mood: tired, diet: skipped_breakfast}.
AI 可以用这些数据做 3 件不同的事:
- Draft: 写一段全新的晨间问候
- Paraphrase: 把医学术语改写成大白话
- Expand: 把 "多喝水" 展开成详细建议

## (2) Wrong intuition vs truth
Wrong: "Writing 就是让 AI 写东西, 给个 prompt 就行"
Truth: 3 种模式对 prompt、质量控制、风险完全不同.
Draft 从零生成 (最高风险), Paraphrase 改写已有 (中风险), Expand 展开要点 (低风险).

## (3) Mirror diagram
Reading <-> Writing 对称:
Summarize <-> Expand (压缩 vs 展开)
Classify <-> Draft (贴标签 vs 生成内容)
Extract <-> Paraphrase (挖结构 vs 改表达)
视觉: 左右镜像箭头图.

## (4) Pattern 1: Draft
从种子数据生成全新文本.
Input: {state, mood, diet} -> Output: "早上好! 经期第二天..."
关键: 需要 system prompt + guardrails + human review for medical content.

## (5) Pattern 2: Paraphrase
改写已有文本的风格/语气/难度.
Input: 医学文献句子 -> Output: 大白话版本.
Example: "子宫内膜异位症..." -> "简单说就是..."
关键: 保留准确性, 只改表达方式.

## (6) Pattern 3: Expand
从简短要点展开为详细段落.
Input: "多喝水" -> Output: "建议每天喝 1500-2000ml..."
关键: 展开时不能添加不存在的 "事实".

## (7) Temperature connection (callback to M1.1 U5)
Draft: T=0.3 (专业) vs T=0.7 (温暖) vs T=1.0 (活泼)
Same prompt, 3 variations side-by-side.
Visual: 3 output cards with colored tags.

## (8) Widget: Writing Studio
3 tabs (Draft / Paraphrase / Expand).
Each shows 3 output variations at different temperatures.
Colored tags: 专业 (blue) / 温暖 (green) / 活泼 (amber).
"Which would Vitamin use?" callout.

## (9) Vitamin case study
Content generation strategy per body state:
经期: warm tone, expand health tips
备孕: professional tone, draft tracking reports
孕期: careful paraphrase of medical guidelines
Quality control: human-in-the-loop for all medical content.

## (10) Rule + homework
Rule: "Draft 风险最高, Expand 最低. 健康产品先用 Paraphrase + Expand, 慎用 Draft."
4 tasks + resource table.

## END: Recap + bridge to U4
Reading = one-shot text->data. Writing = one-shot data->text.
Chatting adds the loop: back-and-forth, multi-turn, with memory.
It's Reading + Writing + context management, all at once.
