# U4 Chatting 类用例 — Storyboard

## START: Bridge from U3 Writing
Reading = one-shot input->output. Writing = one-shot seed->text.
Chatting adds THE LOOP — multi-turn back-and-forth. Most complex AI pattern.

## (1) Observable: 3 conversations that look the same but aren't
Show 3 Vitamin chat screenshots: Q&A, Support, Companion — all look like "chatbot" but behave totally differently.

## (2) Wrong intuition vs truth
Wrong: "All chatbots are the same — just plug in an LLM and let it chat"
Truth: 3 distinct patterns with different architectures, risks, and product decisions.

## (3) Pattern 1: Q&A — linear flow
Factual question -> answer with source. Needs RAG. Linear arrows diagram.
Example: "经期能吃布洛芬吗?" -> answer with medical source cited.

## (4) Pattern 2: Support — branching flow
Guided problem-solving. Decision tree. AI asks clarifying questions.
Example: user reports symptoms -> AI asks clarifying Qs -> suggests actions.

## (5) Pattern 3: Companion — circular flow
Open-ended emotional interaction. No end goal. Needs personality, empathy.
Example: "今天心情不好" -> AI responds warmly, remembers context.

## (6) Comparison table
Memory needs, tone, fallback strategy, risk level per pattern.

## (7) Architecture under the hood
What each pattern needs: RAG for Q&A, state machine for Support, persona + long-term memory for Companion. Context window usage.

## (8) Widget: Chat Pattern Visualizer
4 Vitamin scenarios as clickable cards. Click -> animated conversation flow.
Side panel shows pattern metadata.

## (9) Vitamin case study
User journey map: at which moment does user need Q&A vs Support vs Companion?
Specific Vitamin feature mapping.

## (10) Rule + homework
Rule: "对话 ≠ 对话. 先分清 Q&A / Support / Companion, 再定架构."
4 tasks + resource table.

## END: Recap + bridge to U5 ROI
"You know the 3 AI powers. But WHICH features to build first? ROI is the PM's filter."
