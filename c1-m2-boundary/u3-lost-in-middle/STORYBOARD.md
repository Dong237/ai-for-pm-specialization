# Unit 3 · AI 死穴 2 — 长上下文 "大海捞针"

## 10-Step Storyboard

### (1) "You told AI something important, and it forgot"
Open with a concrete scenario: User tells Vitamin on message #3 that she's allergic to shrimp. By message #15, she asks for dinner suggestions, and AI recommends a shrimp dish. Why? Because the allergy info was "lost in the middle."

### (2) Wrong intuition vs truth
- Wrong: "128K context = can use all 128K equally well"
- Truth: U-shaped attention — models pay most attention to the start and end, middle gets blurry
- This is the "Lost in the Middle" phenomenon, discovered by Stanford/Google researchers

### (3) The Lost in the Middle paper
Simplified explanation of Liu et al. (2023). They placed key facts at different positions in long documents, and measured how well models could retrieve them. Performance forms a U-shape: high at start, high at end, low in the middle. Connection to psychology's serial position effect.

### (4) Why it happens: attention mechanism architecture
Causal masking means early tokens get attended to by everything after them (primacy). Recent tokens are freshest in the model's "working memory" (recency). Middle tokens get the least total attention weight. Like reading a long email — you remember the opening and the closing, but the middle blurs.

### (5) Impact on products: multi-turn conversations
In a 20-message conversation, messages 1-3 and 17-20 are well-remembered. Messages 7-14 are the danger zone. This is where important context gets lost. Vitamin conversations about health history are especially vulnerable.

### (6) Mitigation strategies
- Put critical information at the start of the prompt (system prompt)
- Repeat key facts before the most recent query
- Use structured summaries instead of dumping full history
- Keep prompts lean — don't over-stuff context

### (7) Needle-in-a-Haystack benchmark
Greg Kamradt's famous test: place a fact at different depths in different-length documents, measure retrieval accuracy. Results in a heatmap: green at edges, red in the middle. Even models claiming 128K context struggle at middle positions beyond 32K tokens.

### (8) WIDGET: Needle Finder
Visual: 20 blocks representing a document. User drags a "needle" (key fact) to different positions. An animated attention heatmap shows the attention score — high at edges, low in middle. Shows percentage chance of the model finding the needle at each position.

### (9) Vitamin case study
Health data mentioned early in conversation gets lost. Solution: structured "state cards" at the start of each prompt. Include allergies, current body state, medication list in a consistent XML block at the top of every API call. Don't rely on conversation history alone.

### (10) Rule + homework + resources
One-liner: "Context Window 大 ≠ 能用. 重要信息放开头或结尾, 中间是记忆黑洞."
Resources: Lost in the Middle paper, NIAH benchmark, Anthropic prompt engineering guide

## Resources to link
- 📄 Lost in the Middle paper (Stanford/Google)
- 🎮 Needle-in-a-Haystack GitHub (Greg Kamradt)
- 📖 Anthropic Prompt Engineering Guide (placement tips)
- 📖 DEV Community article on Lost in the Middle
