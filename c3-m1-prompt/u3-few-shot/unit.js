/* U3 · Few-shot Configurator — add 0→5 examples, see accuracy curve + cost */
(() => {
  'use strict';

  const slider = document.getElementById('fs-slider');
  const countEl = document.getElementById('fs-count');
  const examplesContainer = document.getElementById('fs-examples');
  const costValue = document.getElementById('fs-cost-value');
  const costFill = document.getElementById('fs-cost-fill');

  if (!slider || !countEl) return;

  // Example data for Vitamin symptom classification
  const examples = [
    { input: '用户: "今天肚子有点胀胀的"', output: '分类: 经前期 · 情绪: 平静 · 建议类型: 日常' },
    { input: '用户: "好累啊, 什么都不想做"', output: '分类: 经期 · 情绪: 低落 · 建议类型: 关怀' },
    { input: '用户: "今天精力超好!"', output: '分类: 排卵期 · 情绪: 积极 · 建议类型: 运动' },
    { input: '用户: "有点烦躁, 想吃甜的"', output: '分类: 黄体期 · 情绪: 焦躁 · 建议类型: 饮食' },
    { input: '用户: "最近睡得很好, 心情不错"', output: '分类: 安全期 · 情绪: 平稳 · 建议类型: 保持' },
  ];

  // Accuracy data: 0-5 examples → accuracy %
  const accuracyData = [
    { examples: 0, accuracy: 62, label: '0-shot' },
    { examples: 1, accuracy: 78, label: '1-shot' },
    { examples: 2, accuracy: 86, label: '2-shot' },
    { examples: 3, accuracy: 91, label: '3-shot' },
    { examples: 4, accuracy: 93, label: '4-shot' },
    { examples: 5, accuracy: 94, label: '5-shot' },
  ];

  // Cost per example (in tokens, approximately)
  const tokenPerExample = 45;
  const baseCost = 0.002; // cents per request without examples
  const costPerToken = 0.00003; // cents per token

  function update() {
    const n = parseInt(slider.value, 10);
    countEl.textContent = n;

    // Render examples
    examplesContainer.innerHTML = '';
    if (n === 0) {
      examplesContainer.innerHTML = '<div style="color:var(--ink-muted);font-style:italic;padding:12px;">没有示例 (Zero-shot) — AI 只靠指令理解任务</div>';
    } else {
      for (let i = 0; i < n; i++) {
        const ex = examples[i];
        const div = document.createElement('div');
        div.className = 'fs-example';
        div.innerHTML = `<span class="fs-input">${ex.input}</span><span class="fs-arrow"> → </span><span class="fs-output">${ex.output}</span>`;
        examplesContainer.appendChild(div);
      }
    }

    // Update chart bars
    accuracyData.forEach((d, i) => {
      const bar = document.getElementById('fs-bar-' + i);
      const val = document.getElementById('fs-val-' + i);
      if (!bar) return;

      const height = (d.accuracy / 100) * 160;
      bar.style.height = height + 'px';

      if (i === n) {
        bar.style.background = 'var(--green)';
        bar.classList.add('active');
      } else if (i < n) {
        bar.style.background = 'var(--blue)';
        bar.classList.remove('active');
      } else {
        bar.style.background = 'var(--bg-elev)';
        bar.style.border = '1.5px dashed var(--border)';
        bar.classList.remove('active');
      }

      if (val) val.textContent = (i <= n) ? d.accuracy + '%' : '';
    });

    // Update cost
    const totalTokens = n * tokenPerExample;
    const totalCost = baseCost + (totalTokens * costPerToken);
    if (costValue) {
      costValue.textContent = `+${totalTokens} tokens (~$${totalCost.toFixed(4)}/次)`;
      costValue.style.color = n <= 3 ? 'var(--green)' : (n <= 4 ? 'var(--amber)' : 'var(--red)');
    }
    if (costFill) costFill.style.width = (n / 5 * 100) + '%';
  }

  slider.addEventListener('input', update);
  update();

})();
