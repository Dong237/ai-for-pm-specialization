# U3 · RAG 适用场景 — Storyboard
## START: 用户问 "经期能吃布洛芬吗" — 模型瞎编了. 怎么让它查了再答?
## (1) RAG 的灵感: 人类也是先查资料再回答
## (2) RAG 4 步 pipeline: Embed → Retrieve → Augment → Generate
## (3) Step 1: 文档切块 + Embedding
## (4) Step 2: 用户提问 → 向量化 → 相似度检索
## (5) Step 3: 把检索结果塞进 Prompt (Augment)
## (6) Step 4: LLM 基于上下文生成回答 (Generate)
## (7) RAG 的 3 大优势: 更新/溯源/降幻觉
## (8) Interactive: RAG Pipeline Visualizer (动画展示 4 步)
## (9) Vitamin: 医学知识库为什么必须 RAG
## (10) 规则 + 作业
## END: 下节 Fine-tune
