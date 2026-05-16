/* ===========================================
   Unit 7 · 调研模型的方法论
   — Benchmark Explorer: 4-tab leaderboard + consensus
   ===========================================
   Tabs switch between 4 ranking sources.
   Consensus grid shows models appearing in multiple rankings.
*/

(() => {
  'use strict';

  // ---- Tab switching ----
  const tabs = document.querySelectorAll('.explorer-tab');
  const panels = document.querySelectorAll('.explorer-panel');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Deactivate all
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // Activate clicked
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  // ---- Consensus data ----
  // Models that appear in multiple rankings with their badges
  const CONSENSUS = [
    {
      name: 'Claude Opus 4.6',
      count: 4,
      badges: [
        { label: 'Arena #1', cls: 'badge-arena' },
        { label: 'SuperCLUE 闭源 #1', cls: 'badge-superclue' },
        { label: 'Coding #1', cls: 'badge-arena' },
        { label: 'AA Top', cls: 'badge-aa' }
      ]
    },
    {
      name: 'Gemini 3.1 Pro',
      count: 3,
      badges: [
        { label: 'Arena #2', cls: 'badge-arena' },
        { label: 'SuperCLUE #2', cls: 'badge-superclue' },
        { label: 'AA Index #1', cls: 'badge-aa' }
      ]
    },
    {
      name: 'DeepSeek V4',
      count: 3,
      badges: [
        { label: 'SuperCLUE 开源 Top', cls: 'badge-superclue' },
        { label: 'HF #1', cls: 'badge-hf' },
        { label: 'AA 性价比王', cls: 'badge-aa' }
      ]
    },
    {
      name: 'Qwen3-Max',
      count: 3,
      badges: [
        { label: 'Arena #5', cls: 'badge-arena' },
        { label: 'SuperCLUE 开源 #2', cls: 'badge-superclue' },
        { label: 'AA Top', cls: 'badge-aa' }
      ]
    },
    {
      name: 'GPT-5.4 / 5.5',
      count: 3,
      badges: [
        { label: 'Arena #4', cls: 'badge-arena' },
        { label: 'SuperCLUE #3', cls: 'badge-superclue' },
        { label: 'AA Index #1', cls: 'badge-aa' }
      ]
    }
  ];

  // ---- Build consensus grid ----
  const grid = document.getElementById('consensus-grid');
  if (!grid) return;

  CONSENSUS.forEach(model => {
    const card = document.createElement('div');
    card.className = 'consensus-card';

    const count = document.createElement('div');
    count.className = 'consensus-count';
    count.textContent = model.count;

    const name = document.createElement('div');
    name.className = 'consensus-name';
    name.textContent = model.name;

    const badges = document.createElement('div');
    badges.className = 'consensus-badges';
    model.badges.forEach(b => {
      const badge = document.createElement('span');
      badge.className = 'consensus-badge ' + b.cls;
      badge.textContent = b.label;
      badges.appendChild(badge);
    });

    card.appendChild(count);
    card.appendChild(name);
    card.appendChild(badges);
    grid.appendChild(card);
  });

})();
