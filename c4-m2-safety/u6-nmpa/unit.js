/* U6 NMPA Regulation Navigator — Decision Tree */
(() => {
  'use strict';

  const widget = document.getElementById('decision-tree');
  if (!widget) return;

  const questions = [
    { q: '你的产品是否对医疗器械数据 (如影像、检验数据) 进行处理和分析?', yesNext: 1, noNext: 2 },
    { q: '你的产品是否提供自动诊断结论 (如"你患有XX疾病")?', yesNext: 'need3', noNext: 'need2' },
    { q: '你的产品是否声称具有"诊断"、"治疗"或"预防疾病"的功能?', yesNext: 3, noNext: 4 },
    { q: '你的产品是否给出具体的处方或用药建议?', yesNext: 'need3', noNext: 'need2' },
    { q: '你的产品是否仅提供健康管理、生活方式建议 (不涉及诊断/处方)?', yesNext: 'free', noNext: 5 },
    { q: '你的产品是否使用用户的生物数据 (如心率、血糖) 来做健康评估?', yesNext: 6, noNext: 'free' },
    { q: '这个评估是否用于医疗决策 (影响用药、就医)?', yesNext: 'need2', noNext: 'free' },
  ];

  const results = {
    need3: { text: '需要 NMPA 三类医疗器械注册', class: 'dt-result-need', note: '三类 = 最高风险等级. 需要临床试验 + NMPA 审评. 周期 1-3 年, 成本 500万+.' },
    need2: { text: '需要 NMPA 二类医疗器械注册', class: 'dt-result-need', note: '二类 = 中等风险. 需要技术审评, 无需临床试验. 周期 6-12 个月.' },
    free: { text: '属于健康管理产品, 无需 NMPA 注册', class: 'dt-result-free', note: '健康管理类不属于医疗器械, 无需 NMPA 注册. 但仍需遵守《暂行办法》等法规.' },
  };

  let currentStep = 0;
  let path = [];

  const questionEl = document.getElementById('dt-question');
  const buttonsEl = document.getElementById('dt-buttons');
  const resultEl = document.getElementById('dt-result');
  const pathEl = document.getElementById('dt-path');
  const resetBtn = document.getElementById('dt-reset');
  const vitaminEl = document.getElementById('dt-vitamin');

  function render() {
    if (typeof currentStep === 'string') {
      // Result
      const r = results[currentStep];
      questionEl.style.display = 'none';
      buttonsEl.style.display = 'none';
      resultEl.style.display = 'block';
      resultEl.className = 'dt-result ' + r.class;
      resultEl.innerHTML = `<div>${r.text}</div><div style="font-size:13px;font-weight:400;margin-top:8px;color:var(--ink-soft);">${r.note}</div>`;

      if (currentStep === 'free') {
        vitaminEl.style.display = 'block';
      } else {
        vitaminEl.style.display = 'none';
      }
    } else {
      // Question
      const q = questions[currentStep];
      questionEl.style.display = 'block';
      questionEl.textContent = q.q;
      buttonsEl.style.display = 'flex';
      resultEl.style.display = 'none';
      vitaminEl.style.display = 'none';
    }

    // Render path
    if (path.length > 0) {
      pathEl.style.display = 'block';
      pathEl.innerHTML = '<div style="font-size:12px;font-weight:600;margin-bottom:6px;color:var(--ink-muted);">你的选择路径:</div>' +
        path.map(p => `<div class="dt-path-step"><span class="path-q">${p.q}</span> → <span class="path-a ${p.answer ? 'path-a-yes' : 'path-a-no'}">${p.answer ? '是' : '否'}</span></div>`).join('');
    } else {
      pathEl.style.display = 'none';
    }
  }

  function answer(yes) {
    const q = questions[currentStep];
    path.push({ q: q.q, answer: yes });
    currentStep = yes ? q.yesNext : q.noNext;
    render();
  }

  function reset() {
    currentStep = 0;
    path = [];
    render();
  }

  // Event listeners
  document.getElementById('dt-yes').addEventListener('click', () => answer(true));
  document.getElementById('dt-no').addEventListener('click', () => answer(false));
  resetBtn.addEventListener('click', reset);

  render();
})();
