# Unit 2 · AI 死穴 1 — 精确数学 + 实时数据

## 10-Step Storyboard

### (1) Easy math vs hard math
Ask AI: "What's 17 × 24?" — it gets it right (408). Now: "What's 1,847,293 × 7,392,048?" — it confidently gives a wrong answer. The shock: AI gets simple math right (memorized pattern) but fails on novel large numbers.

### (2) Wrong intuitions vs truth
- Wrong A: "AI is smart, so it can do math" — nope, it pattern-matches tokens
- Wrong B: "AI just needs more training data for math" — nope, it's architecturally incapable
- Truth: AI generates plausible-looking numbers. It doesn't calculate.

### (3) Why AI fails at math: tokenization
Numbers get split into tokens. "1847293" becomes tokens like "184", "72", "93". The model doesn't see digits in positional notation — it sees text fragments. This is fundamentally incompatible with carrying, borrowing, and place-value arithmetic.

### (4) Real-time data: AI doesn't know "now"
AI's training has a cutoff date. It doesn't know today's weather, stock prices, exchange rates, or latest news. It will confidently fabricate current data if asked.

### (5) The confidence trap
The most dangerous part: AI doesn't say "I don't know how to calculate this." It gives a wrong answer with the same confident tone as a right answer. Show examples of AI stating wrong math with full confidence.

### (6) When to use rules/APIs instead
For calculations: use code/formulas/APIs. For real-time data: use API calls, web search, database lookups. The PM's job is to route the right task to the right tool.

### (7) The hybrid approach: AI for language, rules for math
Show the ideal architecture: AI handles language understanding and generation, but delegates math to a calculator API and real-time queries to data APIs. This is "tool use" / "function calling."

### (8) WIDGET: AI vs Calculator showdown
5 math problems displayed side by side. Each has an "AI's answer" (plausible but wrong for hard problems) and "Calculator's answer" (always correct). User clicks "揭晓" to reveal each. Includes a BMI calculator comparison.

### (9) Vitamin: BMI must be calculated, drug interactions need database
BMI calculation: user inputs height/weight → must use formula, not AI. Drug interactions: must query a verified database. Today's weather for exercise recommendations: must use weather API. Map out which Vitamin features need rules vs AI.

### (10) Rule + homework + resources
One-liner: "AI 擅长语言, 不擅长数字. 数字的事, 交给代码."
Homework: 4 tasks
Resources: Articles on LLM math failures, tool use patterns

## Resources to link
- 📖 "LLMs are Bad at Math" (DEV Community)
- 📖 "Why Can't AI Do Math?" (primo.mobi)
- 📺 Andrew Ng on tool use and function calling
- 🛠 Calculator comparison demo
