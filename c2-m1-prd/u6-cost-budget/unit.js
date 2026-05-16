/* U6 — Cost Budget Calculator Widget */
(() => {
  'use strict';

  const inputTokens = document.getElementById('input-tokens');
  const outputTokens = document.getElementById('output-tokens');
  const modelSelect = document.getElementById('model-select');
  const dauInput = document.getElementById('dau-input');
  const callsPerUser = document.getElementById('calls-per-user');
  const budgetInput = document.getElementById('budget-input');

  const resultEl = document.getElementById('cost-result');
  const resultBig = document.getElementById('cost-big');
  const perCallEl = document.getElementById('per-call');
  const dailyEl = document.getElementById('daily-cost');
  const monthlyEl = document.getElementById('monthly-cost');
  const totalCallsEl = document.getElementById('total-calls');
  const budgetStatus = document.getElementById('budget-status');

  if (!inputTokens || !resultEl) return;

  // Model pricing per 1M tokens (input / output)
  const models = {
    'gpt-4o': { input: 2.50, output: 10.00, name: 'GPT-4o' },
    'gpt-4o-mini': { input: 0.15, output: 0.60, name: 'GPT-4o-mini' },
    'claude-sonnet': { input: 3.00, output: 15.00, name: 'Claude Sonnet' },
    'claude-haiku': { input: 0.25, output: 1.25, name: 'Claude Haiku' },
    'deepseek-v3': { input: 0.27, output: 1.10, name: 'DeepSeek V3' },
  };

  function calculate() {
    const inTok = parseInt(inputTokens.value) || 0;
    const outTok = parseInt(outputTokens.value) || 0;
    const model = models[modelSelect.value] || models['gpt-4o-mini'];
    const dau = parseInt(dauInput.value) || 0;
    const calls = parseFloat(callsPerUser.value) || 0;
    const budget = parseFloat(budgetInput.value) || 0;

    // Cost per call
    const costPerCall = (inTok * model.input / 1e6) + (outTok * model.output / 1e6);
    // Daily
    const dailyCalls = dau * calls;
    const dailyCost = dailyCalls * costPerCall;
    // Monthly
    const monthlyCost = dailyCost * 30;

    if (perCallEl) perCallEl.textContent = '$' + costPerCall.toFixed(4);
    if (dailyEl) dailyEl.textContent = '$' + dailyCost.toFixed(2);
    if (monthlyEl) monthlyEl.textContent = '$' + monthlyCost.toFixed(0);
    if (totalCallsEl) totalCallsEl.textContent = (dailyCalls * 30 / 1000).toFixed(0) + 'K';
    if (resultBig) resultBig.textContent = '$' + monthlyCost.toFixed(0) + '/月';

    const overBudget = budget > 0 && monthlyCost > budget;
    if (resultEl) resultEl.className = 'cost-result' + (overBudget ? ' over-budget' : '');
    if (budgetStatus) {
      if (budget <= 0) {
        budgetStatus.textContent = '设置月预算上限来检查是否超标';
        budgetStatus.style.color = 'var(--ink-muted)';
      } else if (overBudget) {
        budgetStatus.textContent = '超出预算 $' + (monthlyCost - budget).toFixed(0) + '! 需要降低成本.';
        budgetStatus.style.color = 'var(--red)';
      } else {
        budgetStatus.textContent = '在预算内, 剩余 $' + (budget - monthlyCost).toFixed(0);
        budgetStatus.style.color = 'var(--green)';
      }
    }
  }

  [inputTokens, outputTokens, modelSelect, dauInput, callsPerUser, budgetInput].forEach(el => {
    if (el) el.addEventListener('input', calculate);
  });

  calculate();
})();
