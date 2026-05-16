/* U6 · Task Completion Rate — Task Flow Tracker widget */
(() => {
  'use strict';

  const scenarios = {
    'meal-plan': {
      name: 'AI 饮食计划生成',
      steps: [
        { name: '打开饮食建议功能', users: 1000 },
        { name: '输入今日身体状态', users: 880 },
        { name: 'AI 生成饮食计划', users: 850 },
        { name: '查看完整计划详情', users: 720 },
        { name: '采纳或修改计划', users: 580 },
        { name: '按计划记录一餐', users: 420 },
      ]
    },
    'exercise': {
      name: 'AI 运动推荐',
      steps: [
        { name: '进入运动推荐页面', users: 1000 },
        { name: 'AI 分析身体状态', users: 950 },
        { name: '展示推荐运动方案', users: 920 },
        { name: '选择一项运动', users: 650 },
        { name: '开始运动计时', users: 480 },
        { name: '完成运动并记录', users: 350 },
      ]
    },
    'health-chat': {
      name: 'AI 健康问答',
      steps: [
        { name: '进入聊天界面', users: 1000 },
        { name: '输入健康问题', users: 920 },
        { name: 'AI 返回回答', users: 900 },
        { name: '阅读完整回答', users: 780 },
        { name: '采纳建议/收藏', users: 550 },
        { name: '执行建议行动', users: 320 },
      ]
    },
  };

  const select = document.getElementById('flow-scenario');
  const stepsEl = document.getElementById('flow-steps');
  const tcrEl = document.getElementById('flow-tcr');

  if (!select || !stepsEl) return;

  function render(key) {
    const s = scenarios[key];
    if (!s) return;
    const total = s.steps[0].users;
    const completed = s.steps[s.steps.length - 1].users;
    const tcr = Math.round((completed / total) * 100);

    stepsEl.innerHTML = '';
    s.steps.forEach((step, i) => {
      const pct = Math.round((step.users / total) * 100);
      const dropped = i > 0 && step.users < s.steps[i-1].users * 0.75;
      const div = document.createElement('div');
      div.className = 'flow-step' + (dropped ? ' dropped' : '');
      div.innerHTML = `
        <div class="flow-step-num">${i + 1}</div>
        <div class="flow-step-info">
          <div class="flow-step-name">${step.name}</div>
          <div class="flow-step-users">${step.users} 用户 (${pct}%)</div>
        </div>
        <div class="flow-step-bar"><div class="flow-step-fill" style="width:${pct}%"></div></div>
      `;
      stepsEl.appendChild(div);
    });

    tcrEl.textContent = tcr + '%';
    tcrEl.style.color = tcr >= 40 ? 'var(--green)' : tcr >= 25 ? 'var(--amber)' : 'var(--red)';
  }

  select.addEventListener('change', () => render(select.value));
  render(select.value);
})();
