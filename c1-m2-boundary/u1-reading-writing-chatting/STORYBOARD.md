# Unit 1 · AI 三大主战场 — Reading / Writing / Chatting

## 10-Step Storyboard

### (1) "All AI products do one of three things"
Open with 3 real products: Notion AI (summarizes notes = Reading), Jasper (writes marketing copy = Writing), Character.ai (chats with you = Chatting). Ask: what do they have in common? They all use the same underlying LLM — the difference is what *task* they assign it.

### (2) Wrong intuitions vs truth
- Wrong A: "AI can do anything" — actually it always maps to R/W/C
- Wrong B: "AI features are unique inventions" — actually they're combinations of the same 3 primitives
- Truth: Andrew Ng's framework — any AI product feature = Reading, Writing, or Chatting

### (3) Reading explained: comprehend + extract
Reading = the AI *consumes* text and *outputs structured understanding*.
Sub-types: Summarize, Classify, Extract.
Vitamin examples: classify user mood from diary entry, extract symptoms from free-text input, summarize a week of health logs.

### (4) Writing explained: generate + transform
Writing = the AI *produces* new text from a brief/seed.
Sub-types: Draft, Paraphrase, Expand.
Vitamin examples: generate personalized health tips, paraphrase medical jargon into plain Chinese, expand a one-line food log into nutritional summary.

### (5) Chatting explained: multi-turn conversation
Chatting = the AI *maintains context across turns*.
Sub-types: Q&A, Support, Companion.
Vitamin examples: answer "can I exercise during my period?", provide emotional support during PMS, act as a daily health companion.

### (6) How to classify ambiguous cases
Some features seem like they could be multiple types. Rule of thumb:
- Does the AI need to READ existing content? → Reading
- Does the AI need to WRITE new content from scratch? → Writing
- Does the AI need to go back-and-forth with the user? → Chatting
Edge cases: "AI rewrites my diary entry" = Reading (understand) + Writing (generate) = chain of R→W.

### (7) Why this framework matters for PM decisions
Each type has different: prompt design, evaluation metrics, cost structure, and failure modes.
- Reading: precision/recall matters, low temperature
- Writing: creativity matters, higher temperature, acceptance rate
- Chatting: context management matters, conversation length, latency

### (8) WIDGET: Feature Classifier
Interactive: 10+ Vitamin feature cards. Click one → it animates into the correct R/W/C column with explanation. Also has a text input for custom features with AI-style classification animation.

### (9) Vitamin: map 5 states to R/W/C
For each of the 5 body states (经期/备孕/孕期/产后/更年期), list the most important R, W, and C features. Show that every state needs all three types, but the mix differs.

### (10) Rule + homework + resources
One-liner: "拿到任何 AI 需求, 先问: 这是 Reading, Writing, 还是 Chatting? 答不上来, 说明需求没想清楚."
Homework: 4 tasks
Resources: Andrew Ng course, Coursera link, etc.

## Resources to link
- 📺 Andrew Ng "Generative AI for Everyone" Week 1 (Coursera)
- 📖 DeepLearning.AI course page
- 📖 Medium article on Reading/Writing/Chatting framework
- 🛠 ChatGPT / 豆包 — try classifying your own features
