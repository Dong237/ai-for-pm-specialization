/* ===========================================
   Unit 1 · Token 计费机制 (深化) — Interactive billing comparison
   =========================================== */
(() => {
  'use strict';

  // Model pricing data (per 1M tokens, as of May 2026)
  const MODELS = [
    { id: 'ds-flash', name: 'DeepSeek V4 Flash', input: 0.14, output: 0.28, tokRatio: 1.0, color: '#4a9eed' },
    { id: 'ds-pro', name: 'DeepSeek V4 Pro', input: 1.74, output: 3.48, tokRatio: 1.0, color: '#6bb1f0' },
    { id: 'gpt54', name: 'GPT-5.4', input: 2.50, output: 15.00, tokRatio: 1.15, color: '#22c55e' },
    { id: 'gpt55', name: 'GPT-5.5', input: 5.00, output: 30.00, tokRatio: 1.15, color: '#4ade80' },
    { id: 'claude-haiku', name: 'Claude Haiku 4.5', input: 1.00, output: 5.00, tokRatio: 1.1, color: '#f59e0b' },
    { id: 'claude-sonnet', name: 'Claude Sonnet 4.6', input: 3.00, output: 15.00, tokRatio: 1.1, color: '#fbbf24' },
    { id: 'claude-opus', name: 'Claude Opus 4.7', input: 5.00, output: 25.00, tokRatio: 1.1, color: '#ef4444' },
    { id: 'qwen-max', name: 'Qwen3 Max', input: 0.78, output: 3.12, tokRatio: 0.85, color: '#8b5cf6' },
    { id: 'gemini-flash', name: 'Gemini 2.5 Flash', input: 0.15, output: 0.60, tokRatio: 1.05, color: '#a78bfa' },
  ];

  // --- Billing comparison widget ---
  const textarea = document.getElementById('billing-text');
  const resultsEl = document.getElementById('billing-results');
  const sortBtns = document.querySelectorAll('.sort-btn');

  let currentSort = 'input';

  // Rough Chinese token estimate: ~1.5 tokens per CJK char, ~0.75 per English word
  function estimateTokens(text, ratio) {
    if (!text.trim()) return 0;
    let count = 0;
    for (const ch of text) {
      if (/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/.test(ch)) {
        count += 1.5;
      } else if (/[a-zA-Z]/.test(ch)) {
        count += 0.3;
      } else if (/\s/.test(ch)) {
        count += 0.1;
      } else {
        count += 0.5;
      }
    }
    return Math.max(1, Math.round(count * ratio));
  }

  function formatCost(cost) {
    if (cost < 0.0001) return '<$0.0001';
    if (cost < 0.01) return '$' + cost.toFixed(4);
    if (cost < 1) return '$' + cost.toFixed(3);
    return '$' + cost.toFixed(2);
  }

  function renderResults() {
    if (!textarea || !resultsEl) return;
    const text = textarea.value;
    const baseTokens = estimateTokens(text, 1.0);

    let models = MODELS.map(m => {
      const tokens = estimateTokens(text, m.tokRatio);
      const inputCost = (tokens / 1_000_000) * m.input;
      const outputCost = (tokens / 1_000_000) * m.output;
      return { ...m, tokens, inputCost, outputCost, totalCost: inputCost + outputCost };
    });

    // Sort
    if (currentSort === 'input') {
      models.sort((a, b) => a.input - b.input);
    } else if (currentSort === 'output') {
      models.sort((a, b) => a.output - b.output);
    } else if (currentSort === 'total') {
      models.sort((a, b) => a.totalCost - b.totalCost);
    }

    resultsEl.innerHTML = models.map(m => `
      <div class="billing-card" style="border-color: ${m.color}22; border-left: 3px solid ${m.color};">
        <div class="billing-model-name">${m.name}</div>
        <span class="billing-token-count" style="color: ${m.color};">${m.tokens}</span>
        <span style="font-size:11px;color:var(--ink-muted);">tokens</span>
        <div class="billing-cost" style="color: ${m.color}; margin-top:6px;">
          ${formatCost(m.inputCost)} in / ${formatCost(m.outputCost)} out
        </div>
      </div>
    `).join('');
  }

  if (textarea) {
    textarea.addEventListener('input', renderResults);
    renderResults();
  }

  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.dataset.sort;
      renderResults();
    });
  });

  // --- Pricing table sort ---
  const table = document.getElementById('pricing-sortable');
  if (table) {
    const headers = table.querySelectorAll('th[data-sortable]');
    const tbody = table.querySelector('tbody');

    headers.forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const col = parseInt(th.dataset.col);
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const dir = th.dataset.dir === 'asc' ? 'desc' : 'asc';

        headers.forEach(h => { h.dataset.dir = ''; h.textContent = h.textContent.replace(/ [▲▼]/, ''); });
        th.dataset.dir = dir;
        th.textContent += dir === 'asc' ? ' ▲' : ' ▼';

        rows.sort((a, b) => {
          const aVal = parseFloat(a.children[col].dataset.val || a.children[col].textContent.replace(/[^0-9.]/g, ''));
          const bVal = parseFloat(b.children[col].dataset.val || b.children[col].textContent.replace(/[^0-9.]/g, ''));
          return dir === 'asc' ? aVal - bVal : bVal - aVal;
        });

        rows.forEach(r => tbody.appendChild(r));
      });
    });
  }

  // --- Price gap bars animation ---
  const gapBars = document.querySelectorAll('.gap-bar');
  if (gapBars.length) {
    const gapObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const bar = e.target;
          bar.style.height = bar.dataset.height;
          gapObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });
    gapBars.forEach(b => {
      b.dataset.height = b.style.height;
      b.style.height = '0px';
      gapObserver.observe(b);
    });
  }
})();
