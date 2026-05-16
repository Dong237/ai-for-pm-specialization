/* U7 Liability Matrix Widget — Click to assign scenarios */
(() => {
  'use strict';

  const widget = document.getElementById('liability-matrix');
  if (!widget) return;

  const scenarios = [
    { id: 1, text: 'AI 生成了错误的药物剂量建议, 用户照做身体不适', correct: 'platform', explain: '平台有义务做输出审核, 拦截危险的医疗建议. 未尽审核义务 = 平台责任.' },
    { id: 2, text: '用户故意越狱让 AI 扮演"医生", 获取处方后自行用药', correct: 'user', explain: '用户故意绕过安全限制, 且平台已有防护措施和免责声明. 用户自身承担主要责任.' },
    { id: 3, text: '基础模型存在训练偏差, 对某族群的健康建议带有歧视', correct: 'provider', explain: '训练数据偏见属于模型供应商的责任. 但平台如果发现后不处理, 也有连带责任.' },
    { id: 4, text: '用户隐私数据因系统漏洞被泄露', correct: 'platform', explain: '数据存储和安全是平台的直接责任. 模型供应商不接触用户数据.' },
    { id: 5, text: '模型 API 返回了政治敏感内容, 平台未做输出过滤', correct: 'platform', explain: '平台作为服务提供方, 有义务对输出做审核. 即使模型生成了问题内容, 最终展示是平台的选择.' },
    { id: 6, text: '用户上传了含恶意指令的文档, 导致 AI 输出有害内容', correct: 'platform', explain: '间接注入防御是平台的责任. 应在文档预处理时过滤恶意内容.' },
  ];

  let assignments = {}; // scenario id → 'platform'|'provider'|'user'
  let revealed = false;

  const scenarioPool = document.getElementById('scenario-pool');
  const cols = {
    platform: document.getElementById('col-platform'),
    provider: document.getElementById('col-provider'),
    user: document.getElementById('col-user'),
  };
  const resultsEl = document.getElementById('matrix-results');
  const checkBtn = document.getElementById('matrix-check');
  const resetBtn = document.getElementById('matrix-reset');

  let selectedScenario = null;

  function render() {
    // Render scenario cards
    scenarioPool.innerHTML = '';
    scenarios.forEach(s => {
      const card = document.createElement('div');
      card.className = 'scenario-card' + (assignments[s.id] ? ' placed' : '');
      card.innerHTML = `<span class="scenario-num">${s.id}</span>${s.text}`;
      card.dataset.id = s.id;

      if (!assignments[s.id]) {
        card.addEventListener('click', () => {
          // Select this scenario
          document.querySelectorAll('.scenario-card').forEach(c => c.style.borderColor = '');
          card.style.borderColor = 'var(--purple)';
          selectedScenario = s.id;
        });
      }
      scenarioPool.appendChild(card);
    });

    // Update column counts
    Object.keys(cols).forEach(key => {
      const count = Object.values(assignments).filter(v => v === key).length;
      const countEl = cols[key].querySelector('.drop-count');
      if (countEl) countEl.textContent = `${count} 个场景`;
    });

    // Show check button when all assigned
    const allAssigned = Object.keys(assignments).length === scenarios.length;
    checkBtn.style.display = allAssigned ? 'inline-block' : 'none';
  }

  function assignTo(target) {
    if (selectedScenario === null) return;
    assignments[selectedScenario] = target;
    selectedScenario = null;
    render();
  }

  function checkAnswers() {
    revealed = true;
    resultsEl.className = 'matrix-results show';

    let correct = 0;
    let html = '';

    scenarios.forEach(s => {
      const userAnswer = assignments[s.id];
      const isCorrect = userAnswer === s.correct;
      if (isCorrect) correct++;

      const labels = { platform: '平台', provider: '模型供应商', user: '用户' };
      html += `
        <div class="result-item ${isCorrect ? 'result-correct' : 'result-wrong'}">
          <span class="result-icon">${isCorrect ? '✅' : '❌'}</span>
          <div>
            <div><strong>场景 ${s.id}:</strong> 你选了 <strong>${labels[userAnswer]}</strong>, 正确答案是 <strong>${labels[s.correct]}</strong></div>
            <div class="result-explanation">${s.explain}</div>
          </div>
        </div>
      `;
    });

    const scoreClass = correct >= 5 ? 'score-good' : correct >= 3 ? 'score-ok' : 'score-bad';
    html += `<div class="matrix-score ${scoreClass}">得分: ${correct} / ${scenarios.length}</div>`;

    resultsEl.innerHTML = html;
  }

  function reset() {
    assignments = {};
    selectedScenario = null;
    revealed = false;
    resultsEl.className = 'matrix-results';
    resultsEl.innerHTML = '';
    render();
  }

  // Column click handlers
  Object.keys(cols).forEach(key => {
    cols[key].addEventListener('click', () => assignTo(key));
  });
  checkBtn.addEventListener('click', checkAnswers);
  resetBtn.addEventListener('click', reset);

  render();
})();
