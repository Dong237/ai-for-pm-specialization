/* ===========================================
   Unit 2 · Tokenizer 差异放大成本 — Tokenizer Cost Amplifier
   =========================================== */
(() => {
  'use strict';

  // Pre-computed tokenization data for common phrases
  // Ratios relative to a "balanced" tokenizer:
  // GPT uses ~1.5 tokens per CJK char (English-biased BPE)
  // Claude uses ~1.3 tokens per CJK char (moderate)
  // Qwen/DeepSeek uses ~0.9 tokens per CJK char (Chinese-optimized)
  const TOKENIZER_MODELS = [
    { name: 'GPT-5.5', family: 'gpt', zhRatio: 1.5, enRatio: 0.28, inputPrice: 5.00, outputPrice: 30.00, color: '#22c55e' },
    { name: 'Claude Sonnet 4.6', family: 'claude', zhRatio: 1.3, enRatio: 0.30, inputPrice: 3.00, outputPrice: 15.00, color: '#f59e0b' },
    { name: 'DeepSeek V4 Flash', family: 'deepseek', zhRatio: 0.9, enRatio: 0.32, inputPrice: 0.14, outputPrice: 0.28, color: '#4a9eed' },
  ];

  function estimateTokensForModel(text, model) {
    let count = 0;
    for (const ch of text) {
      if (/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/.test(ch)) {
        count += model.zhRatio;
      } else if (/[a-zA-Z]/.test(ch)) {
        count += model.enRatio;
      } else if (/\s/.test(ch)) {
        count += 0.1;
      } else {
        count += 0.5;
      }
    }
    return Math.max(1, Math.round(count));
  }

  const textarea = document.getElementById('amp-text');
  const resultsEl = document.getElementById('amp-results');

  function renderAmplifier() {
    if (!textarea || !resultsEl) return;
    const text = textarea.value;
    if (!text.trim()) {
      resultsEl.innerHTML = '<p style="grid-column:1/-1;color:var(--ink-muted);text-align:center;">输入文字后查看对比</p>';
      return;
    }

    const results = TOKENIZER_MODELS.map(m => {
      const tokens = estimateTokensForModel(text, m);
      const inputCost = (tokens / 1_000_000) * m.inputPrice;
      const outputCost = (tokens / 1_000_000) * m.outputPrice;
      return { ...m, tokens, inputCost, outputCost };
    });

    const minTokens = Math.min(...results.map(r => r.tokens));
    const minCost = Math.min(...results.map(r => r.inputCost));

    resultsEl.innerHTML = results.map(r => {
      const tokenDiff = Math.round(((r.tokens - minTokens) / minTokens) * 100);
      const savingsClass = tokenDiff === 0 ? 'good' : tokenDiff < 30 ? 'neutral' : 'bad';
      const savingsText = tokenDiff === 0 ? 'Token 最少' : `多 ${tokenDiff}% token`;

      return `
        <div class="amp-card" style="border-left:3px solid ${r.color};">
          <div class="amp-model-name">${r.name}</div>
          <span class="amp-tokens" style="color:${r.color};">${r.tokens}</span>
          <span class="amp-tokens-label">tokens</span>
          <div class="amp-savings ${savingsClass}">${savingsText}</div>
          <div class="amp-cost-row">
            <span>输入</span>
            <span style="font-weight:600;">$${r.inputCost.toFixed(6)}</span>
          </div>
          <div class="amp-cost-row">
            <span>输出</span>
            <span style="font-weight:600;">$${r.outputCost.toFixed(6)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  if (textarea) {
    textarea.addEventListener('input', renderAmplifier);
    renderAmplifier();
  }

  // Animate zh-tax bars on scroll
  const bars = document.querySelectorAll('.zh-bar');
  if (bars.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.height = e.target.dataset.h;
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => {
      b.dataset.h = b.style.height;
      b.style.height = '0px';
      observer.observe(b);
    });
  }
})();
