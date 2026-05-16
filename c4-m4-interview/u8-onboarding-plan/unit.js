/* U8: 30-60-90 Onboarding Plan — Planner Widget (FINAL UNIT) */
(() => {
  'use strict';

  const plannerEl = document.getElementById('onboard-planner');
  if (!plannerEl) return;

  const STORAGE_KEY = 'u8-planner';

  const phases = [
    { name: 'Day 1-30: 学习期', subtitle: 'Learn & Observe', key: 'phase1' },
    { name: 'Day 31-60: 贡献期', subtitle: 'Plan & Contribute', key: 'phase2' },
    { name: 'Day 61-90: 主导期', subtitle: 'Execute & Lead', key: 'phase3' }
  ];

  const suggestedTasks = [
    // Phase 1 tasks
    { text: '跟每个团队成员做 1:1 coffee chat', phase: 0, id: 's1' },
    { text: '通读产品文档和技术架构', phase: 0, id: 's2' },
    { text: '以新用户身份体验产品全流程', phase: 0, id: 's3' },
    { text: '了解现有 AI 功能和 eval pipeline', phase: 0, id: 's4' },
    { text: '熟悉团队的工作流程和工具链', phase: 0, id: 's5' },
    { text: '整理竞品 AI 功能清单', phase: 0, id: 's6' },
    // Phase 2 tasks
    { text: '找到一个 quick win (如优化一个 prompt)', phase: 1, id: 's7' },
    { text: '参与 1-2 个 sprint planning', phase: 1, id: 's8' },
    { text: '做 5-10 个用户访谈', phase: 1, id: 's9' },
    { text: '建立或完善 AI 评测集', phase: 1, id: 's10' },
    { text: '写第一个 AI 功能的 PRD', phase: 1, id: 's11' },
    { text: '跟 ML Engineer 做一次技术方案讨论', phase: 1, id: 's12' },
    // Phase 3 tasks
    { text: '主导一个 AI 功能从设计到上线', phase: 2, id: 's13' },
    { text: '建立 AI 功能的数据监控 dashboard', phase: 2, id: 's14' },
    { text: '做一次产品评审, 展示你的 AI 功能方案', phase: 2, id: 's15' },
    { text: '提出下个季度的 AI 产品 roadmap 建议', phase: 2, id: 's16' },
    { text: '总结前 90 天成果, 跟 manager 1:1 review', phase: 2, id: 's17' },
    { text: '识别并提出 1 个创新 AI 功能想法', phase: 2, id: 's18' }
  ];

  // State: each phase has an array of milestone texts
  let state = { phase1: [], phase2: [], phase3: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) state = saved;
  } catch (e) {}

  // Initialize with defaults if empty
  if (state.phase1.length === 0) {
    state.phase1 = [
      '跟每个团队成员做 1:1 coffee chat',
      '通读产品文档和技术架构',
      '以新用户身份体验产品全流程',
      '了解现有 AI 功能和 eval pipeline'
    ];
    state.phase2 = [
      '找到一个 quick win (如优化一个 prompt)',
      '做 5-10 个用户访谈',
      '建立或完善 AI 评测集',
      '写第一个 AI 功能的 PRD'
    ];
    state.phase3 = [
      '主导一个 AI 功能从设计到上线',
      '建立 AI 功能的数据监控 dashboard',
      '提出下个季度的 AI 产品 roadmap 建议',
      '总结前 90 天成果, 跟 manager 1:1 review'
    ];
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getUsedTasks() {
    const all = [...state.phase1, ...state.phase2, ...state.phase3];
    return new Set(all);
  }

  function render() {
    // Render phases
    const phasesEl = plannerEl.querySelector('.onboard-phases');
    phasesEl.innerHTML = '';

    phases.forEach((p, pi) => {
      const phaseEl = document.createElement('div');
      phaseEl.className = 'onboard-phase';

      const milestones = state[p.key];
      let slotsHTML = '';
      for (let mi = 0; mi < 4; mi++) {
        const text = milestones[mi] || '';
        const filled = text ? ' filled' : '';
        slotsHTML += `
          <div class="milestone-slot${filled}" data-phase="${pi}" data-slot="${mi}">
            <div class="milestone-num">${mi + 1}</div>
            <div class="milestone-text">${text || '点击添加...'}</div>
            ${text ? '<button class="milestone-remove" data-phase="' + pi + '" data-slot="' + mi + '">×</button>' : ''}
          </div>
        `;
      }

      phaseEl.innerHTML = `
        <div class="phase-header">${p.name}</div>
        <div class="phase-subtitle">${p.subtitle}</div>
        ${slotsHTML}
      `;

      phasesEl.appendChild(phaseEl);
    });

    // Slot click to add
    plannerEl.querySelectorAll('.milestone-slot:not(.filled)').forEach(slot => {
      slot.addEventListener('click', () => {
        const text = prompt('输入这个阶段的里程碑任务:');
        if (!text) return;
        const pi = parseInt(slot.dataset.phase);
        const si = parseInt(slot.dataset.slot);
        state[phases[pi].key][si] = text;
        save();
        render();
      });
    });

    // Remove buttons
    plannerEl.querySelectorAll('.milestone-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pi = parseInt(btn.dataset.phase);
        const si = parseInt(btn.dataset.slot);
        state[phases[pi].key][si] = '';
        // Compact: remove empty items in middle
        state[phases[pi].key] = state[phases[pi].key].filter(Boolean);
        save();
        render();
      });
    });

    // Suggested tasks
    const poolEl = plannerEl.querySelector('.suggest-tasks');
    const used = getUsedTasks();
    poolEl.innerHTML = '';
    suggestedTasks.forEach(t => {
      const tag = document.createElement('span');
      tag.className = 'suggest-task' + (used.has(t.text) ? ' used' : '');
      tag.textContent = t.text;
      if (!used.has(t.text)) {
        tag.addEventListener('click', () => {
          const phaseKey = phases[t.phase].key;
          if (state[phaseKey].length < 4) {
            state[phaseKey].push(t.text);
          } else {
            // Find empty slot
            const emptyIdx = state[phaseKey].findIndex(s => !s);
            if (emptyIdx >= 0) state[phaseKey][emptyIdx] = t.text;
            else alert('这个阶段已满 4 个任务. 请先删除一个.');
          }
          save();
          render();
        });
      }
      poolEl.appendChild(tag);
    });
  }

  // Export button
  const exportBtn = document.getElementById('export-btn');
  const exportEl = plannerEl.querySelector('.export-plan');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      let html = '<div class="export-plan-title">你的 30-60-90 入职计划</div>';
      phases.forEach((p, pi) => {
        const items = state[p.key].filter(Boolean);
        html += `<div class="export-phase"><div class="export-phase-name">${p.name}</div><ul>${items.map(t => '<li>' + t + '</li>').join('')}</ul></div>`;
      });
      exportEl.innerHTML = html;
      exportEl.classList.toggle('visible');
      exportBtn.textContent = exportEl.classList.contains('visible') ? '收起计划' : '导出计划';
    });
  }

  // Reset button
  const resetBtn = document.getElementById('planner-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state = { phase1: [], phase2: [], phase3: [] };
      save();
      render();
    });
  }

  render();
})();
