/* U9 · North Star Builder widget */
(() => {
  'use strict';

  const features = {
    'chat': {
      name: 'AI 聊天 (健康问答)',
      northStarOptions: ['Acceptance Rate', 'Task Completion Rate', 'User Satisfaction Score', 'Active AI Users'],
      guardrailOptions: ['Refusal Rate', 'Hallucination Rate', 'Regen Rate', 'P95 Latency', 'CPST', 'False Refusal Rate'],
      recommended: { ns: 'Acceptance Rate', guards: ['Refusal Rate 10-18%', 'P95 Latency ≤ 5s', 'CPST ≤ $0.05'] }
    },
    'summary': {
      name: 'AI 身体日报',
      northStarOptions: ['阅读完成率', 'Feature Adoption %', '日报分享率', 'Acceptance Rate'],
      guardrailOptions: ['Regen Rate', 'P95 Latency', 'CPST', '生成失败率', '数据准确率'],
      recommended: { ns: '阅读完成率', guards: ['Regen Rate < 15%', 'P95 Latency ≤ 4s', 'CPST ≤ $0.02'] }
    },
    'diet': {
      name: 'AI 饮食建议',
      northStarOptions: ['Acceptance Rate', 'Task Completion Rate', '计划执行率', 'Active AI Users'],
      guardrailOptions: ['Refusal Rate', 'Regen Rate', 'P95 Latency', 'CPST', 'Hallucination Rate'],
      recommended: { ns: 'Task Completion Rate', guards: ['Acceptance Rate ≥ 45%', 'Refusal Rate 8-12%', 'CPST ≤ $0.08'] }
    },
    'exercise': {
      name: 'AI 运动推荐',
      northStarOptions: ['Task Completion Rate', 'Acceptance Rate', '运动完成率', 'Active AI Users'],
      guardrailOptions: ['Refusal Rate', 'Regen Rate', 'P95 Latency', 'CPST', '安全事件率'],
      recommended: { ns: 'Task Completion Rate', guards: ['Refusal Rate 10-15%', 'P95 Latency ≤ 5s', 'CPST ≤ $0.10'] }
    },
    'emotion': {
      name: 'AI 情绪识别',
      northStarOptions: ['Acceptance Rate', 'Feature Adoption %', '标签准确率', 'Active AI Users'],
      guardrailOptions: ['Correction Rate', 'P95 Latency', 'CPST', 'False Positive Rate'],
      recommended: { ns: 'Acceptance Rate', guards: ['Correction Rate < 20%', 'P95 Latency ≤ 3s', 'CPST ≤ $0.02'] }
    },
  };

  const featureSelect = document.getElementById('ns-feature');
  const nsSelect = document.getElementById('ns-northstar');
  const g1Select = document.getElementById('ns-guard1');
  const g2Select = document.getElementById('ns-guard2');
  const g3Select = document.getElementById('ns-guard3');
  const resultEl = document.getElementById('ns-result');
  const recBtn = document.getElementById('ns-recommend');

  if (!featureSelect) return;

  function populateOptions(selectEl, options) {
    selectEl.innerHTML = '<option value="">-- 选择 --</option>';
    options.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o; opt.textContent = o;
      selectEl.appendChild(opt);
    });
  }

  function loadFeature() {
    const f = features[featureSelect.value];
    if (!f) return;
    populateOptions(nsSelect, f.northStarOptions);
    populateOptions(g1Select, f.guardrailOptions);
    populateOptions(g2Select, f.guardrailOptions);
    populateOptions(g3Select, f.guardrailOptions);
    updateResult();
  }

  function updateResult() {
    const f = features[featureSelect.value];
    if (!f) { resultEl.innerHTML = ''; return; }
    const ns = nsSelect.value || '(未选择)';
    const g1 = g1Select.value || '(未选择)';
    const g2 = g2Select.value || '(未选择)';
    const g3 = g3Select.value || '(未选择)';

    resultEl.innerHTML = `
      <div class="ns-result-title">${f.name} 指标体系</div>
      <div class="ns-result-item"><strong>北极星:</strong> ${ns}</div>
      <div class="ns-result-item"><strong>守门指标 1:</strong> ${g1}</div>
      <div class="ns-result-item"><strong>守门指标 2:</strong> ${g2}</div>
      <div class="ns-result-item"><strong>守门指标 3:</strong> ${g3}</div>
    `;
  }

  recBtn?.addEventListener('click', () => {
    const f = features[featureSelect.value];
    if (!f) return;
    nsSelect.value = f.recommended.ns;
    // Set guardrails by matching partial text
    const gSelects = [g1Select, g2Select, g3Select];
    f.recommended.guards.forEach((g, i) => {
      const baseName = g.split(' ')[0] + ' ' + (g.split(' ')[1] || '');
      const options = gSelects[i].querySelectorAll('option');
      for (const opt of options) {
        if (g.startsWith(opt.value) || opt.value.includes(g.split(' ')[0])) {
          gSelects[i].value = opt.value;
          break;
        }
      }
    });
    updateResult();
    resultEl.innerHTML += `<div style="margin-top:10px;padding-top:8px;border-top:1px dashed var(--border);font-size:13px;color:var(--green);font-weight:600;">推荐方案: ${f.recommended.ns} + ${f.recommended.guards.join(' / ')}</div>`;
  });

  featureSelect.addEventListener('change', loadFeature);
  [nsSelect, g1Select, g2Select, g3Select].forEach(s => s?.addEventListener('change', updateResult));
  loadFeature();
})();
