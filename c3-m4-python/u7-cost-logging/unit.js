/* Unit 7 — Cost Logger Widget */
(() => {
  'use strict';

  const widget = document.getElementById('cost-logger');
  if (!widget) return;

  const addBtn = widget.querySelector('.cost-btn');
  const totalCalls = document.getElementById('cl-total-calls');
  const totalTokens = document.getElementById('cl-total-tokens');
  const totalCost = document.getElementById('cl-total-cost');
  const avgCost = document.getElementById('cl-avg-cost');
  const logBody = document.getElementById('cl-log-body');
  const chart = document.getElementById('cl-chart');

  const sampleCalls = [
    { q: '经期可以运动吗?', prompt: 42, completion: 98, model: 'gpt-4o-mini' },
    { q: '孕早期吃什么好?', prompt: 38, completion: 112, model: 'gpt-4o-mini' },
    { q: '失眠怎么办?', prompt: 35, completion: 87, model: 'gpt-4o-mini' },
    { q: '痛经如何缓解?', prompt: 40, completion: 95, model: 'gpt-4o-mini' },
    { q: '排卵期有什么症状?', prompt: 44, completion: 103, model: 'gpt-4o-mini' },
    { q: '黄体期情绪低落正常吗?', prompt: 48, completion: 120, model: 'gpt-4o-mini' },
    { q: '喝冰水影响月经吗?', prompt: 41, completion: 91, model: 'gpt-4o-mini' },
    { q: '经期头痛怎么处理?', prompt: 43, completion: 88, model: 'gpt-4o-mini' },
    { q: '备孕需要补什么?', prompt: 37, completion: 105, model: 'gpt-4o-mini' },
    { q: '月经不调要看医生吗?', prompt: 45, completion: 110, model: 'gpt-4o-mini' },
  ];

  // gpt-4o-mini pricing: $0.15/1M input, $0.60/1M output
  const INPUT_PRICE = 0.15 / 1000000;
  const OUTPUT_PRICE = 0.60 / 1000000;

  let callIdx = 0;
  let cumCost = 0;
  let cumTokens = 0;
  let costs = [];

  function updateStats() {
    totalCalls.textContent = callIdx;
    totalTokens.textContent = cumTokens.toLocaleString();
    totalCost.textContent = '$' + cumCost.toFixed(5);
    avgCost.textContent = callIdx > 0 ? '$' + (cumCost / callIdx).toFixed(5) : '-';
  }

  function drawChart() {
    chart.innerHTML = '';
    if (costs.length === 0) return;

    const maxCost = Math.max(...costs) * 1.2;
    const barW = Math.min(30, (chart.offsetWidth - 20) / costs.length - 2);

    costs.forEach((c, i) => {
      const bar = document.createElement('div');
      bar.className = 'cost-chart-bar';
      bar.style.left = (10 + i * (barW + 2)) + 'px';
      bar.style.width = barW + 'px';
      bar.style.height = (c / maxCost * 130) + 'px';
      bar.title = `Call ${i + 1}: $${c.toFixed(6)}`;
      chart.appendChild(bar);
    });
  }

  addBtn.addEventListener('click', () => {
    if (callIdx >= sampleCalls.length) {
      addBtn.textContent = 'All done!';
      addBtn.disabled = true;
      return;
    }

    const call = sampleCalls[callIdx];
    const cost = call.prompt * INPUT_PRICE + call.completion * OUTPUT_PRICE;
    const totalTk = call.prompt + call.completion;

    cumCost += cost;
    cumTokens += totalTk;
    costs.push(cost);
    callIdx++;

    // Add row
    const tr = document.createElement('tr');
    tr.className = 'new-row';
    tr.innerHTML = `
      <td>${callIdx}</td>
      <td>${call.q}</td>
      <td>${call.prompt}</td>
      <td>${call.completion}</td>
      <td>${totalTk}</td>
      <td>$${cost.toFixed(6)}</td>
      <td>$${cumCost.toFixed(5)}</td>
    `;
    logBody.appendChild(tr);

    updateStats();
    drawChart();

    if (callIdx >= sampleCalls.length) {
      addBtn.textContent = 'All done!';
      addBtn.disabled = true;
    }
  });

  updateStats();
})();
