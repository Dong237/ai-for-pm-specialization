# M3 Research Data — AI Model Landscape (April 30, 2026)

> All data from web searches conducted April 30, 2026. Mark time-sensitive data with "截至 2026 年 4 月".

## Latest Model Versions

| Provider | Latest Model | Status | Key Specs |
|----------|-------------|--------|-----------|
| OpenAI | GPT-5.5 (Apr 23, 2026) | Latest | 1M context. GPT-4o DEPRECATED Feb 2026. |
| Anthropic | Claude Opus 4.7 (Apr 16) | Latest GA | 1M context. Swept coding #1-5 on Chatbot Arena. |
| DeepSeek | V4 Pro/Flash (Apr 24) | Latest | 1.6T params, 49B active MoE. MIT license. Trained on Huawei Ascend (no NVIDIA). |
| Google | Gemini 3.1 Pro Preview (Feb 19) | Latest | 1M context. Gemini 2.0 deprecated Jun 2026. |
| Meta | Llama 4 Maverick (Apr 2025) | Still latest | 400B total, 17B active MoE. 1M context. Open. |
| Qwen | Qwen3.6-Max (Apr 20) | Latest | Qwen3.6-27B open. Top 6 coding benchmarks. |
| Kimi | K2.6 (Apr 21) | Latest | Open-weight. 80.2% SWE-Bench. Was K2.5 in Jan. |
| Zhipu | GLM-5 (Feb 11) | Latest | 744B total, 40B active MoE. MIT license. |
| ByteDance | Doubao-Seed-2.0 (Feb 14) | Latest | 120 trillion tokens/day usage. Top Chinese on SuperCLUE. |
| xAI | Grok 4.3 Beta (Apr 17) | Latest | 2M context. Native video. |
| Mistral | Small 4 (Mar 2026) | Latest | 119B total, ~6B active MoE. $0.15/M input. |

## Pricing (USD per Million Tokens)

| Model | Input | Output | Notes |
|-------|-------|--------|-------|
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 | Cheapest major API |
| DeepSeek V4 Flash | $0.14 | $0.28 | Cache hit: $0.028 |
| Mistral Small 4 | $0.15 | $0.60 | |
| OpenAI GPT-5 Mini | $0.25 | ~$1.00 | Budget OpenAI |
| Gemini 2.5 Flash | $0.30 | $2.50 | |
| DeepSeek V4 Pro (promo) | $0.435 | $0.87 | 75% off til May 31 |
| Kimi K2.6 | ~$0.55 | ~$2.65 | Open-weight |
| Anthropic Haiku 4.5 | $1.00 | $5.00 | |
| OpenAI GPT-5 | $1.25 | $10.00 | |
| Gemini 2.5 Pro | $1.25 | $10.00 | |
| Anthropic Sonnet 4.6 | $3.00 | $15.00 | |
| Anthropic Opus 4.7 | $5.00 | $25.00 | |
| OpenAI GPT-5.5 | $5.00 | $30.00 | |

Chinese models (RMB per million tokens):
| Model | Input | Output |
|-------|-------|--------|
| Qwen-Long | ¥0.5 | ¥2.0 |
| Qwen3.5-Plus | ¥0.8 | ¥4.8 |
| Doubao Seed-1.6 | from ¥0.8 | varies |
| Qwen3-Max (<=32K) | ¥2.5 | ¥10.0 |
| Doubao Pro-256k | ¥5.0 | ¥9.0 |

## DeepSeek V4 Flash vs GPT-5.5: 36x cheaper input, 107x cheaper output

## Chatbot Arena Rankings (April 2026)
1. Claude Opus 4.6 Thinking — Elo 1504
2. Gemini 3.1 Pro Preview — Elo 1493
3. Grok 4.20 Beta — Elo 1491
4. GPT-5.4 High — Elo 1484
Coding: Anthropic swept top 5 (Opus 4.7/4.6 + Sonnet 4.6)

## SuperCLUE Chinese Rankings (March 2026)
Closed-source top: Claude Opus 4.6 > Gemini 3.1 > GPT-5.4 > Doubao-Seed-2.0
Open-source top: Kimi K2.5-Thinking > Qwen3-Max > DeepSeek > GLM

## Open vs Closed Source
Open: DeepSeek V4 (MIT), Llama 4 (Meta), Qwen3.6-27B, GLM-5 (MIT), Kimi K2.6, Mistral Large 3 (Apache 2.0)
Closed: GPT-5.5, Claude Opus 4.7, Gemini 3.1 Pro, Grok 4.3, Doubao-Seed-2.0

## Key Benchmarks
- HuggingFace Open LLM: Use arena.lmsys.org for latest
- Chatbot Arena: lmarena.ai
- SuperCLUE: superclue.ai
- Artificial Analysis: artificialanalysis.ai
