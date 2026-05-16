/* ===========================================
   Unit 8 · Vitamin 5 状态拆解实操
   Interactive: Decision Board (drag & click)
   =========================================== */

(() => {
  'use strict';

  // ---- Feature data: 15 cards ----
  const features = [
    // 经期
    { id: 'period-emotion',    state: 'period',     icon: '🌙', name: '情绪识别',         answer: 'ai' },
    { id: 'period-pain',       state: 'period',     icon: '🌙', name: '痛经程度评估',      answer: 'either' },
    { id: 'period-med',        state: 'period',     icon: '🌙', name: '用药提醒时间计算',  answer: 'rules' },
    // 备孕
    { id: 'fert-ovulation',    state: 'fertility',  icon: '🌸', name: '排卵期预测',        answer: 'either' },
    { id: 'fert-nutrition',    state: 'fertility',  icon: '🌸', name: '营养建议生成',      answer: 'ai' },
    { id: 'fert-temp',         state: 'fertility',  icon: '🌸', name: '体温数据分析',      answer: 'either' },
    // 孕期
    { id: 'preg-dev',          state: 'pregnancy',  icon: '🤰', name: '发育说明生成',      answer: 'ai' },
    { id: 'preg-emergency',    state: 'pregnancy',  icon: '🤰', name: '紧急症状判断',      answer: 'either' },
    { id: 'preg-checkup',      state: 'pregnancy',  icon: '🤰', name: '产检日期计算',      answer: 'rules' },
    // 产后
    { id: 'post-emotion',      state: 'postpartum', icon: '👶', name: '情绪支持对话',      answer: 'ai' },
    { id: 'post-feeding',      state: 'postpartum', icon: '👶', name: '喂养量计算',        answer: 'rules' },
    { id: 'post-recovery',     state: 'postpartum', icon: '👶', name: '恢复建议生成',      answer: 'ai' },
    // 更年期
    { id: 'meno-symptom',      state: 'menopause',  icon: '🍂', name: '症状分类识别',      answer: 'ai' },
    { id: 'meno-hrt',          state: 'menopause',  icon: '🍂', name: 'HRT 药物交互',     answer: 'rules' },
    { id: 'meno-comfort',      state: 'menopause',  icon: '🍂', name: '心理安慰对话',      answer: 'ai' },
  ];

  const categoryNames = {
    ai: '必须 AI',
    either: '都可以',
    rules: '必须规则'
  };

  const poolEl = document.getElementById('db-pool-cards');
  const remainingEl = document.getElementById('db-remaining');
  const checkBtn = document.getElementById('db-check');
  const resetBtn = document.getElementById('db-reset');
  const resultsEl = document.getElementById('db-results');
  const scoreEl = document.getElementById('db-score');
  const detailEl = document.getElementById('db-detail');
  const colAi = document.querySelector('#col-ai .db-col-drop');
  const colEither = document.querySelector('#col-either .db-col-drop');
  const colRules = document.querySelector('#col-rules .db-col-drop');

  if (!poolEl || !colAi) return;

  // Map category → drop zone
  const dropZones = {
    ai: colAi,
    either: colEither,
    rules: colRules
  };

  // Track placements: featureId → category
  const placements = {};

  // ---- Shuffle array ----
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---- Create card element ----
  function createCard(feat) {
    const card = document.createElement('div');
    card.className = 'db-card';
    card.draggable = true;
    card.dataset.id = feat.id;
    card.dataset.state = feat.state;
    card.innerHTML = `<span class="dbc-state">${feat.icon}</span><span class="dbc-name">${feat.name}</span>`;

    // Drag events
    card.addEventListener('dragstart', (e) => {
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', feat.id);
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    // Click for mobile (and desktop fallback)
    card.addEventListener('click', () => {
      // If already in a column, return to pool first
      if (card.parentElement !== poolEl) {
        const prevCat = card.parentElement.dataset.category;
        if (prevCat) delete placements[feat.id];
        poolEl.appendChild(card);
        updateCounts();
      }
      showPicker(feat, card);
    });

    return card;
  }

  // ---- Mobile picker (click-based) ----
  function showPicker(feat, card) {
    // Remove existing picker
    const existing = document.querySelector('.db-picker-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'db-picker-overlay';

    const picker = document.createElement('div');
    picker.className = 'db-picker';
    picker.innerHTML = `
      <h4>${feat.icon} ${feat.name}</h4>
      <button class="db-picker-btn pick-ai" data-cat="ai">必须 AI</button>
      <button class="db-picker-btn pick-either" data-cat="either">都可以</button>
      <button class="db-picker-btn pick-rules" data-cat="rules">必须规则</button>
      <button class="db-picker-cancel">取消</button>
    `;

    picker.querySelectorAll('.db-picker-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        placeCard(feat.id, card, cat);
        overlay.remove();
      });
    });

    picker.querySelector('.db-picker-cancel').addEventListener('click', () => {
      overlay.remove();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    overlay.appendChild(picker);
    document.body.appendChild(overlay);
  }

  // ---- Place card into category ----
  function placeCard(featId, card, category) {
    const zone = dropZones[category];
    if (!zone) return;
    zone.appendChild(card);
    placements[featId] = category;
    updateCounts();
  }

  // ---- Drop zone events ----
  [colAi, colEither, colRules].forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over');
    });
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const featId = e.dataTransfer.getData('text/plain');
      const card = document.querySelector(`.db-card[data-id="${featId}"]`);
      if (!card) return;
      const cat = zone.dataset.category;
      placeCard(featId, card, cat);
    });
  });

  // Also allow dropping back to pool
  poolEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });
  poolEl.addEventListener('drop', (e) => {
    e.preventDefault();
    const featId = e.dataTransfer.getData('text/plain');
    const card = document.querySelector(`.db-card[data-id="${featId}"]`);
    if (!card) return;
    delete placements[featId];
    poolEl.appendChild(card);
    updateCounts();
  });

  // ---- Update counts ----
  function updateCounts() {
    const placed = Object.keys(placements).length;
    remainingEl.textContent = 15 - placed;

    // Update column counts
    document.querySelectorAll('.db-col').forEach(col => {
      const cat = col.dataset.category;
      const count = Object.values(placements).filter(v => v === cat).length;
      col.querySelector('.col-count').textContent = count;
    });

    // Enable check button when all placed
    if (placed >= 15) {
      checkBtn.disabled = false;
      checkBtn.textContent = '查看答案';
    } else {
      checkBtn.disabled = true;
      checkBtn.textContent = `查看答案 (还剩 ${15 - placed} 个)`;
    }

    // Hide results when cards move
    resultsEl.style.display = 'none';
  }

  // ---- Check answers ----
  function checkAnswers() {
    let correct = 0;
    let html = '';

    features.forEach(feat => {
      const userCat = placements[feat.id] || '?';
      const isCorrect = userCat === feat.answer;
      if (isCorrect) correct++;

      const userLabel = categoryNames[userCat] || '未分类';
      const answerLabel = categoryNames[feat.answer];

      html += `<div class="db-detail-row">
        <span class="db-detail-icon">${feat.icon}</span>
        <span class="db-detail-name">${feat.name}</span>
        <span class="db-detail-yours">${userLabel}</span>
        <span class="db-detail-answer">${answerLabel}</span>
        <span class="db-detail-match">${isCorrect ? '✅' : '❌'}</span>
      </div>`;
    });

    const pct = Math.round((correct / 15) * 100);
    let comment = '';
    if (pct >= 90) comment = '太棒了! 你对 AI vs 规则 的判断力已经很强了!';
    else if (pct >= 70) comment = '不错! 大部分判断准确. 看看错的几个, 想想为什么.';
    else if (pct >= 50) comment = '还行, 但有些地方需要回顾 U1-U7 的框架.';
    else comment = '没关系, 这个练习就是用来学习的. 回看第 4-6 步的分析!';

    scoreEl.innerHTML = `${correct} / 15 正确 (${pct}%)<br/><span style="font-size:16px;color:var(--ink-soft);">${comment}</span>`;
    detailEl.innerHTML = `<div style="display:grid;grid-template-columns:auto auto 60px 60px auto;gap:4px;font-size:13px;margin-bottom:8px;color:var(--ink-muted);font-weight:600;">
      <span></span><span>功能</span><span>你的</span><span>参考</span><span></span>
    </div>` + html;

    resultsEl.style.display = 'block';
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ---- Reset ----
  function reset() {
    Object.keys(placements).forEach(k => delete placements[k]);
    // Move all cards back to pool
    document.querySelectorAll('.db-card').forEach(card => {
      poolEl.appendChild(card);
    });
    resultsEl.style.display = 'none';
    updateCounts();
  }

  // ---- Init ----
  function init() {
    poolEl.innerHTML = '';
    const shuffled = shuffle(features);
    shuffled.forEach(feat => {
      poolEl.appendChild(createCard(feat));
    });
    updateCounts();
  }

  checkBtn.addEventListener('click', checkAnswers);
  resetBtn.addEventListener('click', reset);
  init();

})();
