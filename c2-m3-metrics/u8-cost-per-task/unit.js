/* U8 · Cost per Successful Task — Cost-Quality Scatter */
(() => {
  'use strict';

  const features = [
    { name: 'AI聊天', cost: 0.08, success: 72, color: 'var(--blue)' },
    { name: 'AI日报', cost: 0.03, success: 85, color: 'var(--green)' },
    { name: 'AI饮食', cost: 0.12, success: 55, color: 'var(--amber)' },
    { name: 'AI运动', cost: 0.15, success: 42, color: 'var(--red)' },
    { name: 'AI情绪', cost: 0.02, success: 78, color: 'var(--purple)' },
  ];

  const plot = document.getElementById('scatter-plot');
  if (!plot) return;

  // Plot dimensions
  const maxCost = 0.20;
  const minSuccess = 30;
  const maxSuccess = 100;

  features.forEach(f => {
    const dot = document.createElement('div');
    dot.className = 'scatter-dot';
    dot.style.background = f.color;

    // x = cost (left=cheap, right=expensive)
    const xPct = (f.cost / maxCost) * 85 + 5;
    // y = success rate (bottom=low, top=high) — invert for CSS
    const yPct = 100 - ((f.success - minSuccess) / (maxSuccess - minSuccess)) * 85 - 5;

    dot.style.left = `calc(${xPct}% - 20px)`;
    dot.style.top = `calc(${yPct}% - 20px)`;
    dot.textContent = f.name.replace('AI', '');

    const cpst = (f.cost / (f.success / 100)).toFixed(2);
    const tooltip = document.createElement('span');
    tooltip.className = 'dot-tooltip';
    tooltip.textContent = `${f.name} | 成本: $${f.cost}/次 | 成功率: ${f.success}% | CPST: $${cpst}`;
    dot.appendChild(tooltip);

    plot.appendChild(dot);
  });
})();
