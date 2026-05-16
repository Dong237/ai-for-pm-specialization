# AI for PM Specialization (个人定制版)

> 给想做 AI PM 的 4 课程 × 4 模块 × ~8 单元的完整学习路径
> 设计原则:**变体 α(PM 工作流主线)+ 变体 β(求职 funnel 标签)融合**

---

## 一、设计原则速览

**4 门课的动词主线**:Discover(发现)→ Design(设计)→ Build(构建)→ Ship(上线)
**β 解锁标签**:每门课结束对应一个求职 funnel 阶段被打通
**单元定义**:1 个核心概念,学完能 5-10 分钟讲清楚"是什么 / 为什么 / 怎么用"
**叙事方式**:每模块内单元按学习依赖排序,从基础概念 → 进阶应用 → Vitamin 实操收尾

| 课程 | 动词 | 求职 funnel 解锁 | 模块数 |
|---|---|---|---|
| C1: Discover | 判断 | HR 筛选通过(简历 1.0) | 4 |
| C2: Design | 规划 | 一面 PRD 答辩通过(作品集 2.0) | 4 |
| C3: Build | 动手 | 二/三面技术追问通过(Demo 视频) | 4 |
| C4: Ship | 证明 | 终面通过 + 拿 offer | 4 |

---

## C1: Discover — 发现 AI 机会

> **核心问题**:什么场景该上 AI?能力边界在哪?业内有什么选择?
> **β 解锁**:简历 1.0 上线、HR 筛选通过率提升、自我介绍能聊清"什么是 AI PM"
> **课后产出**:Vitamin 能力边界文档 + 用例评估表 + 模型选型理由 + 简历 AI 关键词通过版

### Module 1.1 · LLM 工作机制 + 8 个核心概念

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | LLM 是什么:Next-Token Prediction | LLM 不是"理解了语言",是"在算下一个最可能的词"。这一句解释为什么 LLM 像人但又不像人 |
| 2 | Token 是什么 | 不是字、不是词,是模型词表里的最小单位。一句话的 token 数 ≠ 字数 |
| 3 | Tokenizer 的中英文差异 | 同样意思的句子中文 token 数通常是英文的 1.5-2 倍。这直接影响中文 AI 产品的成本 |
| 4 | Context Window | 模型的"短期记忆"上限。满了之后会发生什么(截断 / 报错 / 遗忘)。Vitamin 多轮对话的天花板 |
| 5 | Temperature 参数 | 控制"创意 vs 严谨"。0 = 永远同一答案,1 = 每次不同。Vitamin 健康建议为什么必须设低 |
| 6 | Top-P / Top-K | Temperature 的"精细调节兄弟"。何时用 Top-P 而不是 Temperature |
| 7 | 幻觉(Hallucination) | 不是 bug 是 feature——概率分布的必然产物。能用工程视角讲清"为什么会幻觉、什么时候最容易幻觉" |
| 8 | 知识截止(Knowledge Cutoff) | 模型为什么不知道"今天的事"。RAG 和 Web Search 是怎么补这个洞的 |
| 9 | 多模态(Multimodal) | 文本 → 图像 → 语音 → 视频的能力扩展。Vitamin 未来如果要加图片识别意味着什么 |

**预习材料**:Andrew Ng《Generative AI for Everyone》Week 1 全部
**课后产出**:Vitamin《AI 能力边界文档》一页(8 个概念在 Vitamin 场景的具体含义)

---

### Module 1.2 · AI 能力边界 + 用例识别

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | AI 的三大主战场:Reading / Writing / Chatting | Andrew Ng 框架。任何 AI 产品需求都能映射到这三类之一 |
| 2 | AI 死穴 1:精确数学 + 实时数据 | 为什么 ChatGPT 算 17 位乘法会错。Vitamin 不能让 AI 算 BMI 的原因 |
| 3 | AI 死穴 2:长上下文中的"大海捞针" | Context Window 大不等于真的能用——中段记忆会模糊。"我记得你之前说"经常说错 |
| 4 | AI 死穴 3:稳定性问题 | 同样问题问两次得到不同答案。这对医疗类产品意味着什么 |
| 5 | Task Analysis 框架:Feasibility × Value | Andrew Ng Week 3 核心方法。任何需求按"AI 能做吗 × 做了值钱吗"打分 |
| 6 | AI vs 规则的决策准则 | 6 条判断:输入是否结构化?需要解释吗?用户能容忍错误吗?等等。给出表格化决策树 |
| 7 | "70% 准确率"上线门槛 | AI 不像传统软件追求 100%。什么场景 70% 就能上、什么场景 99% 才能上 |
| 8 | Vitamin 5 状态拆解实操 | 把 Vitamin 5 个身体状态拆成"必须 AI / 可 AI 可规则 / 必须规则"三档,产出决策表 |

**预习材料**:Andrew Ng Week 1 后半 + Week 3 Task Analysis 部分
**课后产出**:Vitamin 用例决策表(5 状态 × 3 档分类)

---

### Module 1.3 · AI 行业图景 + 模型横评

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | AI 公司 3 层堆栈 | 基础设施层(英伟达/华为)→ 模型层(OpenAI/Anthropic/智谱)→ 应用层(Vitamin)。她在哪一层、要和哪一层打交道 |
| 2 | 闭源模型 vs 开源模型 | Claude/GPT 闭源 vs Llama/Qwen/DeepSeek 开源。开源模型省钱但要自己部署 |
| 3 | 国内主流模型现状 | 截至 2026 年:DeepSeek V4、通义 Qwen、豆包、Kimi K2.5、智谱 GLM-5。各家擅长场景 |
| 4 | 模型选型 6 维度 | 成本 / 中文能力 / 上下文长度 / 速度 / 多模态 / 推理深度。哪个维度对 Vitamin 最重要 |
| 5 | 价格对比实战 | DeepSeek V4 输入 $0.30/M 输出 $0.50/M、缓存命中 90% 折扣;对比 GPT-4o、Claude Sonnet。一笔账算下来差几十倍 |
| 6 | 国产 vs 国际模型决策树 | 中文场景、合规要求、出海需求 3 条决策路径 |
| 7 | 调研模型的方法论 | HuggingFace 下载榜 / Chatbot Arena 盲测排行 / SuperCLUE 中文榜。每个榜单看什么 |
| 8 | Vitamin 5 模型横评 | 选 5 个候选(豆包 lite / DeepSeek V4 / Qwen Turbo / Claude Haiku / GPT-4o-mini)按 6 维度横评,产出选型理由 |

**预习材料**:NxCode《DeepSeek API Pricing 2026》、阿里云百炼定价页、知乎《2026 年大模型 API 订阅价格对比》
**课后产出**:Vitamin《模型选型报告》1 页(横评表 + 决策依据)

---

### Module 1.4 · AI 用例识别 + 机会评估

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | Augmentation vs Automation | AI 替代人 vs AI 增强人——这个区分决定产品形态(全自动 vs 协作工具) |
| 2 | Reading 类用例典型套路 | Summarize / Classify / Extract。用 Vitamin 举例:从用户输入提取症状关键词 |
| 3 | Writing 类用例典型套路 | Draft / Paraphrase / Expand。用 Vitamin 举例:生成个性化健康建议 |
| 4 | Chatting 类用例典型套路 | Q&A / Support / Companion。用 Vitamin 举例:多轮身体状态对话 |
| 5 | ROI 评估框架 | 一个 AI 功能值不值得做的 4 维度计算:节省时间 × 用户量 × 单次价值 - 实施成本 |
| 6 | Build vs Buy vs API | 自训模型(贵)vs 用现成模型 API(快)vs 套用 SaaS(简单)。Vitamin 应该走哪条路、为什么 |
| 7 | Time-to-value 估算 | 从想法到第一个用户用上要多久。Coze 1 周 / Python + API 2 周 / 自训模型 6 个月起 |
| 8 | Vitamin 6 候选场景取舍 | 列 6 个可能的 AI 功能,按 ROI + Time-to-value 双轴排出优先级,产出"先做哪个、再做哪个" |

**预习材料**:Andrew Ng Week 2 项目识别部分
**课后产出**:Vitamin 功能优先级矩阵(6 候选 × 2 维度)+ 简历 1.0 上线投递

---

## C2: Design — 设计 AI 产品

> **核心问题**:怎么把 AI 机会变成可答辩的设计文档?
> **β 解锁**:作品集 2.0(PRD + 成本模型 + 架构决策)、一面 PRD 答辩能通过、能聊清"为什么这么设计"
> **课后产出**:Vitamin PRD v2 + 成本模型 + 指标体系 + 架构决策文档

### Module 2.1 · AI 版 PRD 4 模块写法

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | 传统 PRD vs AI PRD 的本质差异 | 传统 PRD 描述"点击什么 → 发生什么",AI PRD 描述"概率性输出 + 兜底 + 评测"。多了不确定性这一维度 |
| 2 | AI PRD 模块 1:模型 IO 描述 | Input schema(用户问题/上下文/参数)+ Output schema(JSON/Markdown/纯文本)。给算法工程师看的合同 |
| 3 | AI PRD 模块 2:效果指标定义 | 准确率 / 接受率 / 拒答率 / 平均延迟。每个指标的目标值 + 不达标的兜底 |
| 4 | AI PRD 模块 3:错误兜底机制 | AI 答错了怎么办?5 类兜底:重试 / 切模型 / 切规则 / 转人工 / 直接拒答 |
| 5 | AI PRD 模块 4:Prompt 模板管理 | Prompt 也是产品资产。版本号 / 变更日志 / A/B 实验 / 灰度 |
| 6 | PRD 中的成本预算栏 | 单次调用预估 token 数 × 模型单价 × 频率 = 月成本上限。研发最爱 PM 写这个 |
| 7 | PRD 中的数据来源 + 隐私要求 | 训练 / 检索 / 日志数据从哪来、保留多久、谁能看 |
| 8 | Vitamin PRD v2 实操 | 把现有 Vitamin 文档升级成完整 4 模块 + 成本栏 + 隐私栏的 AI PRD |

**预习材料**:人人都是产品经理 3 篇 AI PRD 模板文章
**课后产出**:Vitamin PRD v2(完整版,可作为作品集核心文件)

---

### Module 2.2 · Token 经济学 + 成本建模

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | Token 计费机制(回顾 + 深化) | 不只是"按字符算钱",每家定价不同、计费精度不同(百万 token / 千 token) |
| 2 | Tokenizer 差异如何放大成本 | 同一句中文,GPT-4 比 Qwen 多 30% token。如果选错模型,中文产品成本直接翻番 |
| 3 | Input vs Output 价格不对称 | 输出通常比输入贵 2-5 倍。这影响 Prompt 设计——能让模型少说就少说 |
| 4 | Prompt Caching 机制 | DeepSeek V4 缓存命中给 90% 折扣。**如何设计 Prompt 让缓存命中率最大化** |
| 5 | 模型分级路由 | 80% 简单问题走便宜模型(豆包 lite)、20% 难问题走贵模型(Claude)。**这是 Vitamin 控成本的核心策略** |
| 6 | 成本预估公式 | 月成本 = (DAU × 日调用频次 × 单次 token 量 × 单价) - 缓存折扣 |
| 7 | Per-User 月成本 + 测算 | 假设 1000 DAU,每人每天 5 次调用,Vitamin 月成本预估 |
| 8 | Vitamin 成本优化路径 | 从原始 5000/千人月 → 缓存优化到 3000 → 路由优化到 1500。三档优化每档省多少 |

**预习材料**:DeepSeek 官网价格页 + 阿里云百炼定价页
**课后产出**:Vitamin《成本建模 Excel》:含基线、缓存优化、路由优化三种方案对比

---

### Module 2.3 · AI 产品指标设计

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | 为什么传统指标不够 | DAU / 留存 / CTR 都没法回答"AI 输出质量好不好"。AI 产品需要一套新指标 |
| 2 | 三大类 AI 指标分类 | Quality(质量)/ Adoption(使用)/ Cost(成本)。每个产品都需要从这三类各挑 1-2 个 |
| 3 | Acceptance Rate(接受率) | 用户多少次没改直接用了 AI 输出。**生成类产品的核心质量指标**,健康内容 40-50% 算合格 |
| 4 | Regeneration Rate(重新生成率) | 用户点"换一个"的频率 = Implicit Rejection。比明确点踩更真实 |
| 5 | Refusal Rate(拒答率) | AI 主动说"我不知道"的比例。太低有幻觉风险,太高用户体验差 |
| 6 | Task Completion Rate(任务完成率) | Agent 类产品的核心指标。用户提的任务最终有没有解决 |
| 7 | P50 / P95 Latency | 一半用户能在多久内拿到答复(P50)、95% 用户最多等多久(P95)。健康类产品 P95 ≤ 5s 是底线 |
| 8 | Cost per Successful Task | 不要单看 token 成本,要看"每个成功完成的任务花多少钱"。把成本和质量关联起来 |
| 9 | Vitamin 北极星指标定义 | 选 1 个北极星 + 3 个守门指标,给 Vitamin 每个核心功能各定义一组 |

**预习材料**:Google Cloud《The KPIs that actually matter for production AI agents》、Chrono《AI Feature KPIs》
**课后产出**:Vitamin《指标体系文档》:北极星 + 守门指标 + 报警阈值

---

### Module 2.4 · 架构决策(选型)

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | 四种 AI 架构概览 | Prompt-only / RAG / Fine-tune / Multi-Agent。复杂度递增、成本递增 |
| 2 | Prompt-only 适用场景 | 任务标准化、知识不变、规模小。**80% 的初创 AI 产品其实只需要这个** |
| 3 | RAG 适用场景 | 知识动态更新 + 需要溯源(医疗/法律/客服)。Vitamin 医学知识库一定要 RAG |
| 4 | Fine-tune 适用场景 | 风格特殊(品牌语调)、术语密度大、Prompt 写不下了。一般 PMF 后才考虑 |
| 5 | Multi-Agent 适用场景 | 任务步骤多、不同步骤需要不同专长(研究 + 写作 + 审核)。Vitamin 终版用 Multi-Agent |
| 6 | 架构选型决策树 | 6 个 yes/no 问题(知识动态吗?要溯源吗?有训练数据吗?...)→ 自动得出推荐架构 |
| 7 | 成本 / 效果 / 复杂度三角 | 每种架构在三个维度上的取舍。一般只能优化两个、牺牲第三个 |
| 8 | Vitamin 架构选型 | 身体翻译器为什么选 RAG + Multi-Agent 而不是 Fine-tune,完整论证过程 |

**预习材料**:Andrew Ng Week 2 高阶技术部分(RAG / Fine-tune / RLHF)
**课后产出**:Vitamin《架构决策文档》+ 简历 2.0 上线(含作品集链接)

---

## C3: Build — 构建 AI 产品

> **核心问题**:怎么把 PRD 变成能现场跑的 Demo?
> **β 解锁**:可演示 Demo 视频、Python 脚本 GitHub 链接、二/三面技术追问能扛
> **课后产出**:Vitamin 可演示 Bot + 知识库 + Python 自动化脚本

### Module 3.1 · Prompt Engineering 系统方法

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | Anthropic 4 段式结构 | Role(角色)+ Task(任务)+ Context(上下文)+ Output Format(输出格式)。每个 Prompt 都该有这四段 |
| 2 | System Prompt vs User Prompt | System 是不变的"人设/规则"、User 是每次的"问题"。哪些放 System、哪些放 User 决定可缓存性 |
| 3 | Few-shot 示例的边际效用 | 0 个 example → 1 个 → 3 个 → 5 个,效果曲线递减。3 个通常是性价比最高点 |
| 4 | Chain-of-Thought (CoT) | 让模型"先想后答"。简单加一句"step by step"准确率能提 10-20%。Vitamin 健康建议适用 |
| 5 | XML tags 结构化 | Anthropic 标志技巧:用 `<context>...</context>` 包不同部分,模型理解更准 |
| 6 | Negative Instructions | 让模型"别做什么"。"不要给医疗诊断"、"不要回答政治话题"。Vitamin 安全机制的第一道防线 |
| 7 | Prompt 模板化与版本管理 | 把 Prompt 当代码管理:版本号、变更日志、A/B 实验。生产级 AI 产品的标配 |
| 8 | Prompt 调试方法 | 模型答错了怎么 debug:先确认输入、再加 CoT、再加 Few-shot、最后改模型 |
| 9 | Vitamin 5 状态 Prompt 实操 | 用 4 段式 + Few-shot 写完 5 个状态的 Prompt 模板,产出可复用模板库 |

**预习材料**:Anthropic Prompt Engineering Guide(中文版)
**课后产出**:Vitamin《Prompt 模板库 v1》5 个状态 × 完整 4 段式

---

### Module 3.2 · Coze Agent 平台实操

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | Coze 平台总览 | 4 个核心:Bot(智能体)/ 工作流(流程编排)/ 知识库(RAG 数据)/ 插件(工具调用)。每个解决什么问题 |
| 2 | 创建第一个 Bot(Hello World) | 5 分钟创建一个能聊天的 Bot,跑通端到端流程 |
| 3 | Persona + Prompt 配置 | 把 M3.1 写的 Prompt 模板搬上 Coze。设置人设、欢迎语、用户问候 |
| 4 | 知识库挂载 | 上传 URL / 文档 / 表格,设置切片策略(段落 / 字数 / 标题)。Vitamin 医学资料怎么喂进去 |
| 5 | 工作流节点编排 | 开始 → 意图识别 → 知识库检索 → 大模型生成 → 结束。每个节点干什么 |
| 6 | 插件调用 | 浏览器搜索 / 数据库查询 / 自定义 API。让 Bot 能"做事"而不只聊天 |
| 7 | 调试与发布 | 调试面板看每步输入输出、发布到 Web SDK / 微信 / 飞书 |
| 8 | Vitamin 身体翻译器完整搭建 | 用 4 节实操产物组合出 Vitamin 第一个真实 Bot,3 分钟手机录屏作为 Demo |

**预习材料**:Coze 官方文档《第一个 Bot》、菜鸟教程"大理导游"案例
**课后产出**:可演示 Vitamin Bot 链接 + 3 分钟 Demo 视频(简历核心证据)

---

### Module 3.3 · RAG 知识库搭建

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | RAG 三步走原理 | Embed(文档变向量)→ Retrieve(查相似)→ Augment(塞给 LLM)。**这是 80% AI 知识产品的底层** |
| 2 | Embedding 是什么 | 把文字变成"几何空间里的点",意思相近的点距离近。给一个直觉解释,不讲数学 |
| 3 | Chunk 策略:大小与重叠 | Chunk 太大 → 检索不准,太小 → 上下文丢失。500-1500 token + 10-20% 重叠是经验值 |
| 4 | 语义切分 vs 固定切分 | 按字数切 vs 按段落/标题切。技术文档用前者、对话/故事用后者 |
| 5 | Top-K 选择 + Reranking | 先用 embedding 召回 20 条 → 用 reranker 精排出 top 5。两阶段检索为什么必要 |
| 6 | 引用机制(Citation) | 让答案带"出处"。用户能点开看原文,信任度直接翻倍。医疗 / 法律产品必备 |
| 7 | RAG 评测 | Contextual Relevancy(召回的对吗)+ Faithfulness(答案忠于召回内容吗)。两个指标分别能发现什么问题 |
| 8 | Vitamin 医学知识库结构 | 5 状态 × N 篇医学资料怎么组织、chunk 多大、引用怎么显示 |

**预习材料**:Anthropic 关于 RAG 的官方指南、Confident AI《LLM Evaluation Metrics》
**课后产出**:Vitamin《知识库结构设计文档》+ Coze 知识库实搭

---

### Module 3.4 · Python 调 API 自动化

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | Python 环境搭建 | VS Code + venv 虚拟环境 + pip install。零基础 30 分钟搞定 |
| 2 | API key 安全管理 | `.env` 文件 + `.gitignore`。**最常见踩坑:把 key 上传到 GitHub 被盗** |
| 3 | Hello World:第一次调用 LLM API | 10 行代码调通豆包 / DeepSeek。看到"Hi 我是 AI"那一刻的认知跃迁 |
| 4 | Try / Except 错误处理 | API 限流、超时、内容审核拒绝。每个都怎么 catch、怎么降级 |
| 5 | 批量调用 + Rate Limiting | 一次调 100 条不能直接 for 循环——会被限流。怎么加 sleep + 怎么并发 |
| 6 | CSV 输入输出 | 从 Excel 读问题、写答案到 CSV。**这是最实用的 PM 自动化场景** |
| 7 | Token 计数 + 成本日志 | 每次调用记录 input token / output token / 成本。跑完就有完整成本报告 |
| 8 | Vitamin 100 条用例脚本 | 用 4-7 节产物拼一个完整脚本:读 CSV → 调 LLM → 评估 → 写结果。**这是简历最大杀手锏** |

**预习材料**:Kaggle Learn Python(免费)、OpenAI / Anthropic / 豆包官方 SDK 文档
**课后产出**:Vitamin Python 脚本上 GitHub + 简历加 GitHub 链接

---

## C4: Ship — 上线与拿 offer

> **核心问题**:怎么证明你能上线 + 让团队信任你 + 拿到 offer?
> **β 解锁**:终面通过、谈薪策略就绪、能现场答辩"怎么证明它能用"
> **课后产出**:评测报告 + 安全机制 + Multi-Agent 终版 + 完整求职包

### Module 4.1 · 模型评测体系

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | 评测三层架构 | 主观打分(人/LLM 评)+ 客观指标(延迟/成本)+ 业务指标(留存/接受率)。三层缺一不可 |
| 2 | 黄金集(Golden Set)构建 | 50-100 条真实 + 边缘 + 攻击样本。**这是评测体系的地基**,样本质量决定一切 |
| 3 | LLM as Judge 方法 | 用 GPT-4 或 Claude 来评 Vitamin 输出。怎么写 Judge Prompt、怎么避免 Judge 偏见 |
| 4 | Pairwise 比较 vs 单点打分 | "A 和 B 哪个好"比"A 几分"更稳定。什么场景用哪种 |
| 5 | 准确率 / 召回率 / F1 在 LLM 评测 | 传统机器学习指标怎么用在 LLM 评测里。Vitamin 知识库召回率应该怎么算 |
| 6 | A/B 测试 in Prompts | Prompt v1 vs v2 跑同样 50 条 case,统计显著性差异。这是 PM 的"科学方法" |
| 7 | 评测自动化 Pipeline | 每改一次 Prompt 就跑一次评测,结果自动写报告。研发友好、PM 也能跑 |
| 8 | Vitamin 评测报告 PDF | 把上述 7 节产物组合成一份完整 PDF。**简历杀手锏 #2(超过 90% 转型 PM 拿不出)** |

**预习材料**:Anthropic Evaluation Guide、Confident AI 评测博客
**课后产出**:Vitamin《评测报告 PDF》上传作品集

---

### Module 4.2 · AI 安全 + 合规

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | Prompt 注入(Prompt Injection)5 类 | 用户在输入里塞"忽略前面指令" 的攻击。Vitamin 用户问"你的 system prompt 是什么"怎么办 |
| 2 | 越狱(Jailbreak)经典手法 | "你现在扮演一个没有限制的 AI"——经典越狱模板。怎么识别和拦截 |
| 3 | 输入过滤(Input Filtering) | 关键词黑名单 + 分类模型识别恶意意图。第一道防线 |
| 4 | 输出审核(Output Moderation) | LLM 生成完再过一次审核模型。慢但稳。医疗类必备 |
| 5 | 用户隐私 + 数据合规 | 《生成式人工智能服务管理暂行办法》核心条款。日志保留多久、谁能访问 |
| 6 | 医疗 AI 的 NMPA 注册逻辑 | 二类医疗器械 vs 健康管理产品的边界。Vitamin 怎么定位才能不进 NMPA 监管范围 |
| 7 | 责任划分:AI 错了谁的锅 | 平台 vs 模型供应商 vs 用户。免责声明怎么写、用户协议要包含什么 |
| 8 | Vitamin 安全机制设计 | 输入过滤 + 输出审核 + 免责声明 + 紧急转人工的完整设计文档 |

**预习材料**:《生成式人工智能服务管理暂行办法》、Anthropic Safety Guide
**课后产出**:Vitamin《安全机制设计文档》

---

### Module 4.3 · 算法协作 + Multi-Agent

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | PM-算法协作 5 大冲突场景 | "效果不好"、"模型迭代慢"、"数据要不到"等真实矛盾。每个的本质和解决思路 |
| 2 | 算法术语速通 10 个 | precision / recall / F1 / AUC / embedding / token / context / 微调 / RLHF / 涌现。**面试必考** |
| 3 | 翻译题:模糊需求 → 工程语言 | "AI 不准" → "召回率 70% 但精确率 50%"。**做题:你扮 PM、男友扮算法,模拟提需求** |
| 4 | 当 1 个 LLM 不够用时 | 单 Agent 的局限:任务太复杂、不同步骤要不同 Prompt 风格、上下文太长 |
| 5 | ReAct 框架(Reasoning + Acting) | Agent 边推理边行动,失败再调整。Vitamin AI 管家的工作模式 |
| 6 | Tool Use(Function Calling) | 让 LLM 调用外部工具(查天气、查日历、查数据库)。Coze 的"插件"本质是这个 |
| 7 | Multi-Agent 路由设计 | 意图识别 → 分发到子 Agent。Vitamin 营养 Agent / 周期 Agent / 情绪 Agent |
| 8 | 子 Agent 之间的"工作交接" | A Agent 完成 → 把上下文传给 B Agent。交接信息丢失是 Multi-Agent 最大坑 |
| 9 | Vitamin Multi-Agent 终版 | 把 C3 单 Agent 升级为 Multi-Agent 完整架构,Coze 实搭 |

**预习材料**:GitHub `ai-agents-from-zero` 教程、Anthropic《Building Effective Agents》
**课后产出**:Vitamin Multi-Agent 终版 + 协作术语对照表

---

### Module 4.4 · 综合面试 + 谈 offer

| # | 单元 | 学完能讲清楚什么 |
|---|---|---|
| 1 | 7 大高频技术追问(从研究报告) | RAG vs Fine-tune 怎么选 / Token 成本怎么控 / 幻觉怎么处理 等。每题准备标准答案 |
| 2 | AI 项目用 STAR 法讲 | Situation(背景)Task(任务)Action(动作)Result(结果)。Vitamin 怎么用 STAR 讲 |
| 3 | Demo 演示三分钟法则 | 30s 痛点 + 30s 方案 + 60s 演示 + 30s 数据 + 30s 反思。每场面试都能复用 |
| 4 | "为什么这么设计"答辩系列 | 选模型 / 选架构 / 选指标 / 选 Prompt 策略,每个都准备 1 分钟解释 |
| 5 | 反向提问的 4 类问题 | 业务类 / 团队类 / 产品类 / 个人发展类。每类各准备 2 个 |
| 6 | AI PM 行为面试 8 题 | "你最骄傲的项目"、"踩过最大的坑"、"和工程师怎么吵架"等。每题准备 STAR 答案 |
| 7 | 谈薪策略 + offer 比较 | 不主动报数 / 反问区间 / 比较多个 offer 时的话术 / 拒绝 offer 怎么不烧桥 |
| 8 | 30-60-90 入职计划 | 入职第 1 个月 / 第 2 个月 / 第 3 个月分别做什么。终面常考、HR 加分项 |

**预习材料**:研究报告"AI PM 高频问题"那 7 题、之前对话的面试逐字稿
**课后产出**:完整《面试逐字稿 v2》(含 Vitamin / 健康 160 / 维康项目三个核心 STAR)

---

## 二、Andrew Ng 课视频映射(节省备课时间)

| 我们的模块 | 用 Andrew Ng 替代多少 | 备注 |
|---|---|---|
| C1.M1 LLM 概念 | Week 1 全部 ≈ 70% | 男友补 Context Window / Temperature / Top-P 工程视角 |
| C1.M2 能力边界 | Week 1 后半 + Week 3 Task Analysis ≈ 50% | 男友补"3 大死穴 + 70% 上线门槛"实战经验 |
| C1.M3 行业图景 | 不覆盖 | 完全自讲(Andrew Ng 不讲国内模型) |
| C1.M4 用例识别 | Week 2 项目识别部分 ≈ 40% | 男友补 Build vs Buy + Time-to-value |
| C2.M1 AI PRD | 不覆盖 | 完全自讲 |
| C2.M2 Token 经济学 | Week 2 cost considerations ≈ 30% | 男友补 Caching / 路由 / 中英文 token 差异 |
| C2.M3 产品指标 | 不覆盖 | 完全自讲(这是 Andrew Ng 课最大缺口) |
| C2.M4 架构决策 | Week 2 RAG/Fine-tune/RLHF ≈ 60% | 男友补 Multi-Agent 选型(Andrew Ng 没讲) |
| C3 整门课 | 几乎不覆盖 | 实操课、男友陪练 |
| C4.M1 评测 | 不覆盖 | 完全自讲 |
| C4.M2 安全合规 | Week 3 Responsible AI ≈ 30% | 男友补 Prompt 注入 + 医疗 NMPA |
| C4.M3 算法协作 + Multi-Agent | 不覆盖 | 完全自讲 |
| C4.M4 面试 | 不覆盖 | 完全自讲 |

**结论**:Andrew Ng 大约能替代 25-30% 的备课内容,主要在 C1 和 C2 前半段。**C3、C4 几乎全靠男友自讲**。

---

## 三、单元总数与时长估算

| 课程 | 模块数 | 单元数 | 概念时长(单元 × 10min) | 实操时长(估) |
|---|---|---|---|---|
| C1 Discover | 4 | 33 | 5.5h | 4h |
| C2 Design | 4 | 33 | 5.5h | 6h |
| C3 Build | 4 | 33 | 5.5h | 12h |
| C4 Ship | 4 | 33 | 5.5h | 8h |
| **合计** | **16** | **132** | **22h** | **30h** |

**总投入 ~52 小时**,如果每周 1 节课 + 自学 4 小时 ≈ 12-13 周完成。**与 12 周春招窗口完美对齐**。

---

## 四、需要进一步确认的事

1. **C2.M4(架构决策)放 Design 课对不对**?另一种排法是把它挪到 C3 开头当"Build 之前先定型"。
   → 倾向保留在 Design,因为它是设计决策不是动手活
2. **C3.M3(RAG)的深度**?现在 8 单元偏工程,如果她不写 Python 可以砍到 5 单元(只讲概念不讲 chunk/top-K)
3. **C4.M3(算法协作 + Multi-Agent)是否拆成两模块**?现在 9 单元有点超 8。可以拆成"M4.3 算法协作 5 单元 + M4.5 Multi-Agent 5 单元"
4. **预习材料的中文化程度**?Andrew Ng 课有中文字幕,Anthropic Prompt Guide 有中文版,但 Confident AI 评测博客只有英文
5. **每模块要不要加"快速版本"和"深度版本"**?如果春招中途她接到 offer,可以走快速版本(只学每模块前 4 单元)

---

> 这是 v1。要落地任何一门课的具体教案,告诉我课程编号(C1/C2/C3/C4),我下一步把那门课 4 个模块每节课的"45 分钟课堂结构 + 课后作业 + Checkpoint 检验"展开。