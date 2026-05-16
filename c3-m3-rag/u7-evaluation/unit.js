/* Unit 7 · RAG Evaluator — score gauges */
(() => {
  'use strict';

  const scenarios = {
    good: {
      label: '良好的 RAG 回答',
      question: '经期可以吃冰吗?',
      answer: '经期建议避免寒凉食物 [1]. 中医认为寒凉伤脾, 可能加重痛经 [2].',
      context: '检索到: 经期饮食指南 + 中医养生文档',
      scores: { faithfulness: 0.95, relevancy: 0.92, precision: 0.88, recall: 0.85 },
      diagnosis: '各项指标都很好. 回答忠实于来源, 直接回答了问题, 检索到了相关文档. 这是一个高质量的 RAG 回答.'
    },
    hallucination: {
      label: '幻觉回答',
      question: '经期可以吃冰吗?',
      answer: '经期完全不能吃任何冷的东西, 否则会导致不孕不育 [1].',
      context: '检索到: 经期饮食指南 (只说了"建议避免", 没说"不孕不育")',
      scores: { faithfulness: 0.25, relevancy: 0.80, precision: 0.70, recall: 0.60 },
      diagnosis: 'Faithfulness 极低! LLM 编造了"不孕不育"的严重后果, 来源文档并没有这个信息. 这是典型的幻觉 — 回答看起来相关, 但内容不忠实于来源.'
    },
    irrelevant: {
      label: '答非所问',
      question: '经期可以吃冰吗?',
      answer: '冰淇淋的制作过程需要用到牛奶和糖, 搅拌后放入冰箱冷冻...',
      context: '检索到: 冰淇淋制作方法 (检索错误)',
      scores: { faithfulness: 0.90, relevancy: 0.15, precision: 0.10, recall: 0.20 },
      diagnosis: 'Relevancy 极低! 回答确实"忠实于来源" (真的在讲冰淇淋制作), 但完全没有回答用户的问题. 问题出在检索阶段 — 搜到了不相关的文档.'
    },
    partial: {
      label: '不完整回答',
      question: '备孕期间要注意什么?',
      answer: '备孕期间建议补充叶酸 [1].',
      context: '检索到: 只找到叶酸相关的 1 个 chunk, 遗漏了运动、心理、其他营养等',
      scores: { faithfulness: 0.92, relevancy: 0.60, precision: 0.90, recall: 0.30 },
      diagnosis: 'Recall 极低! 回答是对的 (忠实 + 精确), 但信息不完整. 用户问的是"注意什么" (全面性), 只回答了叶酸一个方面. 问题出在检索 recall 不足.'
    }
  };

  const btns = document.querySelectorAll('.eval-btn');
  const gaugesEl = document.getElementById('eval-gauges');
  const scenarioEl = document.getElementById('eval-scenario');
  const diagnosisEl = document.getElementById('eval-diagnosis');

  if (!gaugesEl) return;

  const circumference = 2 * Math.PI * 42; // radius 42

  function renderGauges(scores) {
    const metrics = [
      { key: 'faithfulness', label: 'Faithfulness', sub: '忠实度', color: scores.faithfulness > 0.7 ? 'var(--green)' : 'var(--red)' },
      { key: 'relevancy', label: 'Relevancy', sub: '相关度', color: scores.relevancy > 0.7 ? 'var(--green)' : 'var(--red)' },
      { key: 'precision', label: 'Context Precision', sub: '检索精度', color: scores.precision > 0.7 ? 'var(--blue)' : 'var(--amber)' },
      { key: 'recall', label: 'Context Recall', sub: '检索召回', color: scores.recall > 0.7 ? 'var(--blue)' : 'var(--amber)' },
    ];

    gaugesEl.innerHTML = metrics.map(m => {
      const val = scores[m.key];
      const offset = circumference * (1 - val);
      return `<div class="eval-gauge">
        <div class="gauge-ring">
          <svg viewBox="0 0 100 100">
            <circle class="gauge-bg" cx="50" cy="50" r="42" stroke-width="8" stroke="var(--bg-card)"/>
            <circle class="gauge-fill" cx="50" cy="50" r="42" stroke-width="8"
              stroke="${m.color}"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}"/>
          </svg>
          <div class="gauge-num" style="color:${m.color}">${(val * 100).toFixed(0)}</div>
        </div>
        <div class="gauge-label">${m.label}</div>
        <div class="gauge-sublabel">${m.sub}</div>
      </div>`;
    }).join('');

    // Animate gauges
    requestAnimationFrame(() => {
      document.querySelectorAll('.gauge-fill').forEach(el => {
        el.style.strokeDashoffset = el.getAttribute('stroke-dashoffset');
      });
    });
  }

  function selectScenario(key) {
    const s = scenarios[key];
    btns.forEach(b => b.classList.toggle('active', b.dataset.scenario === key));

    scenarioEl.innerHTML = `
      <div class="eval-scenario-label">${s.label}</div>
      <p><strong>Q:</strong> ${s.question}</p>
      <p><strong>A:</strong> ${s.answer}</p>
      <p class="muted"><strong>Context:</strong> ${s.context}</p>
    `;

    renderGauges(s.scores);
    diagnosisEl.innerHTML = `<strong>诊断:</strong> ${s.diagnosis}`;
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => selectScenario(btn.dataset.scenario));
  });

  // Default
  selectScenario('good');
})();
