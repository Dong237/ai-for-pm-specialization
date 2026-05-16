# U1 · AI 公司 3 层堆栈 — Storyboard

## ▶ START
Hook: 你现在每天用豆包/ChatGPT, 但这些产品背后是谁在做? 为什么有的公司做芯片, 有的做模型, 有的做 App? 你的 Vitamin 在这个链条里算什么?

## (1) Observable: 你每天用的 AI 产品, 背后至少涉及 3 类公司
Show: 打开豆包 → 豆包是字节做的 → 字节用了什么模型? → 模型跑在什么硬件上?

## (2) Wrong intuitions: "AI 公司就是做 AI 的" vs truth: 分 3 层
Truth: Infrastructure → Model → Application, 像盖楼一样

## (3) Layer 1: 基础设施层 (算力 + 芯片)
NVIDIA, 华为昇腾, TSMC. 没有他们, 模型训不出来.

## (4) Layer 2: 模型层 (大模型提供商)
OpenAI, Anthropic, DeepSeek, 智谱, 阿里, 字节. 训练 + 提供 API.

## (5) Layer 3: 应用层 (产品)
Vitamin, 豆包, ChatGPT, Notion AI, 飞书. 直接面向用户.

## (6) 三层之间的依赖关系
App 调 Model API → Model 跑在 GPU 上 → GPU 来自芯片厂
"你站在应用层, 但你要理解下面两层"

## (7) 价值链: 谁赚钱最多?
Currently: 基础设施层 (NVIDIA 万亿市值). 模型层在烧钱. 应用层在找 PMF.

## (8) Widget: Stack Explorer 交互塔
3 层可点击展开, 显示公司 + 角色 + 依赖箭头

## (9) Vitamin case study
Vitamin 在应用层. 调 DeepSeek/GPT API (模型层). 模型跑在 NVIDIA/华为芯片 (基础设施层).
PM 决策: 选哪个模型 API? 成本多少? 会不会被断供?

## (10) One-liner + homework
Rule: 理解你在堆栈的哪层, 就知道你该关心什么.
