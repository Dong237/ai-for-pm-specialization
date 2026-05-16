/* U5: ReAct Trace Viewer Widget */
(() => {
  'use strict';
  const viewer = document.getElementById('react-viewer');
  if (!viewer) return;

  const traceSteps = [
    { type: 'thought', text: '用户问了关于经期饮食的问题. 我需要先查她的经期状态, 然后根据当前阶段给营养建议.' },
    { type: 'action', text: '调用 get_cycle_status(user_id) — 查询用户当前经期阶段' },
    { type: 'observation', text: '返回: {phase: "黄体期", day: 22, next_period: "约5天后"}' },
    { type: 'thought', text: '用户在黄体期(经前期), 这个阶段容易出现PMS症状. 我应该查一下适合这个阶段的营养建议.' },
    { type: 'action', text: '调用 query_nutrition_db("黄体期", "缓解PMS") — 查营养数据库' },
    { type: 'observation', text: '返回: {建议: ["补充镁和B6", "多吃深绿色蔬菜", "减少咖啡因和盐分"], 食谱: ["菠菜豆腐汤", "香蕉燕麦奶昔"]}' },
    { type: 'thought', text: '信息够了. 让我用温柔的语气组合一个个性化的回复, 结合她的经期阶段给出具体建议.' },
    { type: 'answer', text: '你现在在黄体期, 再过大约5天就来姨妈啦. 这个阶段可以多吃点菠菜、香蕉这类富含镁的食物, 有助于缓解经前不适. 推荐你试试菠菜豆腐汤, 简单又营养! 另外这几天尽量少喝咖啡哦~' }
  ];

  let currentStep = 0;
  const traceEl = document.getElementById('react-trace');
  const stepBtn = document.getElementById('react-step-btn');
  const resetBtn = document.getElementById('react-reset');
  const counterEl = document.getElementById('react-counter');

  function renderStep() {
    if (currentStep > traceSteps.length) return;
    if (counterEl) counterEl.textContent = `${currentStep} / ${traceSteps.length}`;

    if (currentStep >= traceSteps.length) {
      if (stepBtn) { stepBtn.textContent = '完成 ✓'; stepBtn.disabled = true; }
      return;
    }

    if (stepBtn) { stepBtn.textContent = '下一步 →'; stepBtn.disabled = false; }
  }

  function advance() {
    if (currentStep >= traceSteps.length) return;
    const s = traceSteps[currentStep];
    const el = document.createElement('div');
    el.className = `react-step ${s.type}`;
    const label = s.type === 'thought' ? 'Thought' : s.type === 'action' ? 'Action' : s.type === 'observation' ? 'Observation' : 'Answer';
    el.innerHTML = `<span class="react-step-label">${label}</span> ${s.text}`;
    if (traceEl) traceEl.appendChild(el);
    currentStep++;
    renderStep();
  }

  function reset() {
    currentStep = 0;
    if (traceEl) traceEl.innerHTML = '';
    renderStep();
  }

  if (stepBtn) stepBtn.addEventListener('click', advance);
  if (resetBtn) resetBtn.addEventListener('click', reset);
  renderStep();
})();
