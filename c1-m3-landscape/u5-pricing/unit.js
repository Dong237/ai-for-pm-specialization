/* =============================================
   Unit 5 · 价格对比实战
   Cost Calculator Widget
   ============================================= */

(() => {
  'use strict';

  // --- Model pricing data (USD per million tokens, as of April 2026) ---
  const pricing = {
    'deepseek-flash':    { name: 'DeepSeek V4 Flash',   input: 0.14,  output: 0.28,  color: '#22c55e' },
    'gemini-flash-lite': { name: 'Gemini Flash-Lite',    input: 0.10,  output: 0.40,  color: '#3b82f6' },
    'gpt5-mini':         { name: 'GPT-5 Mini',           input: 0.25,  output: 1.00,  color: '#06b6d4' },
    'claude-haiku':      { name: 'Claude Haiku 4.5',     input: 1.00,  output: 5.00,  color: '#14b8a6' },
    'gpt5':              { name: 'GPT-5',                 input: 1.25,  output: 10.00, color: '#f59e0b' },
    'claude-sonnet':     { name: 'Claude Sonnet 4.6',    input: 3.00,  output: 15.00, color: '#8b5cf6' },
    'gpt55':             { name: 'GPT-5.5',               input: 5.00,  output: 30.00, color: '#ef4444' }
  };

  // --- DOM refs ---
  const dauInput = document.getElementById('calc-dau');
  const callsInput = document.getElementById('calc-calls');
  const inputTokensInput = document.getElementById('calc-input-tokens');
  const outputTokensInput = document.getElementById('calc-output-tokens');
  const resultsEl = document.getElementById('calc-results');
  const summaryEl = document.getElementById('calc-summary');
  const checksEl = document.getElementById('calc-model-checks');

  if (!dauInput || !resultsEl) return;

  // --- Preset buttons ---
  document.querySelectorAll('.calc-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      dauInput.value = btn.dataset.dau;
      callsInput.value = btn.dataset.calls;
      inputTokensInput.value = btn.dataset.input;
      outputTokensInput.value = btn.dataset.output;
      calculate();
    });
  });

  function getSelectedModels() {
    const checks = checksEl.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checks).map(c => c.value).filter(v => pricing[v]);
  }

  function calculate() {
    const dau = parseInt(dauInput.value, 10) || 0;
    const calls = parseInt(callsInput.value, 10) || 0;
    const inputToks = parseInt(inputTokensInput.value, 10) || 0;
    const outputToks = parseInt(outputTokensInput.value, 10) || 0;

    const dailyCalls = dau * calls;
    const monthlyInputM = (dailyCalls * inputToks * 30) / 1_000_000;
    const monthlyOutputM = (dailyCalls * outputToks * 30) / 1_000_000;

    const selected = getSelectedModels();
    if (selected.length === 0) {
      resultsEl.innerHTML = '<p style="text-align:center;color:var(--ink-muted);">请至少选择一个模型</p>';
      summaryEl.textContent = '';
      return;
    }

    // Calculate costs
    const results = selected.map(key => {
      const m = pricing[key];
      const inputCost = monthlyInputM * m.input;
      const outputCost = monthlyOutputM * m.output;
      const total = inputCost + outputCost;
      return { key, name: m.name, inputCost, outputCost, total, color: m.color };
    });

    // Sort by total cost
    results.sort((a, b) => a.total - b.total);

    // Mark cheapest and most expensive
    const minTotal = results[0].total;
    const maxTotal = results[results.length - 1].total;

    // Render
    let html = '<div class="calc-result-row calc-result-header"><span>模型</span><span>Input 费</span><span>Output 费</span><span>月总计</span></div>';

    results.forEach(r => {
      let cls = 'calc-result-row';
      if (results.length > 1 && r.total === minTotal) cls += ' cheapest';
      if (results.length > 1 && r.total === maxTotal) cls += ' priciest';

      html += `<div class="${cls}">
        <span style="color:${r.color};font-weight:600;">${r.name}</span>
        <span>$${formatNum(r.inputCost)}</span>
        <span>$${formatNum(r.outputCost)}</span>
        <span class="calc-monthly">$${formatNum(r.total)}</span>
      </div>`;
    });

    resultsEl.innerHTML = html;

    // Summary
    if (results.length >= 2) {
      const ratio = maxTotal / Math.max(minTotal, 0.01);
      const saved = maxTotal - minTotal;
      summaryEl.innerHTML = `最贵 (${results[results.length - 1].name}) 是最便宜 (${results[0].name}) 的 <strong>${ratio.toFixed(0)}x</strong> — 每月可省 <strong>$${formatNum(saved)}</strong>`;
    } else {
      summaryEl.innerHTML = `月总 tokens: ${formatNum((monthlyInputM + monthlyOutputM).toFixed(1))}M (Input ${formatNum(monthlyInputM.toFixed(1))}M + Output ${formatNum(monthlyOutputM.toFixed(1))}M)`;
    }
  }

  function formatNum(n) {
    const num = parseFloat(n);
    if (num >= 1000) {
      return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    if (num >= 100) {
      return num.toFixed(0);
    }
    if (num >= 1) {
      return num.toFixed(2);
    }
    return num.toFixed(3);
  }

  // --- Event listeners ---
  [dauInput, callsInput, inputTokensInput, outputTokensInput].forEach(el => {
    el.addEventListener('input', calculate);
  });

  checksEl.addEventListener('change', calculate);

  // Initial calculation
  calculate();

})();
