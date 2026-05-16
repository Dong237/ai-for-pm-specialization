/* ===========================================
   Unit 5 · 模型分级路由 — Router Designer
   =========================================== */
(() => {
  'use strict';

  const MESSAGES = [
    { text: '你好', complexity: 'easy', correct: 'cheap' },
    { text: '今天心情不好', complexity: 'easy', correct: 'cheap' },
    { text: '帮我记一下, 今天早餐吃了鸡蛋', complexity: 'easy', correct: 'cheap' },
    { text: '经期可以跑步吗?', complexity: 'medium', correct: 'mid' },
    { text: '最近老是失眠, 白天犯困, 月经也不规律', complexity: 'medium', correct: 'mid' },
    { text: '帮我总结一下这周的饮食记录', complexity: 'medium', correct: 'mid' },
    { text: '我有多囊卵巢综合征, 最近在吃达英-35, 想了解这个药的副作用和注意事项', complexity: 'hard', correct: 'expensive' },
    { text: '我备孕半年了还没怀上, 之前有过一次宫外孕, 现在很焦虑', complexity: 'hard', correct: 'expensive' },
  ];

  const MODELS = {
    cheap: { name: 'DeepSeek V4 Flash', costPer: 0.00006 },
    mid: { name: 'Claude Sonnet 4.6', costPer: 0.0027 },
    expensive: { name: 'Claude Opus 4.7', costPer: 0.0045 },
  };

  const inboxEl = document.getElementById('router-inbox');
  const cheapLane = document.getElementById('lane-cheap');
  const midLane = document.getElementById('lane-mid');
  const expensiveLane = document.getElementById('lane-expensive');
  const resultEl = document.getElementById('router-result');

  if (!inboxEl || !cheapLane) return;

  // Render messages in inbox
  function renderInbox() {
    inboxEl.innerHTML = '';
    MESSAGES.forEach((m, i) => {
      const card = document.createElement('div');
      card.className = 'msg-card';
      card.draggable = true;
      card.dataset.idx = i;
      card.innerHTML = `<span class="msg-complexity ${m.complexity}">${m.complexity === 'easy' ? '简单' : m.complexity === 'medium' ? '中等' : '复杂'}</span><br/>${m.text}`;
      card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', i);
        card.classList.add('dragging');
      });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
      inboxEl.appendChild(card);
    });
  }

  // Enable drop on lanes
  [cheapLane, midLane, expensiveLane].forEach(lane => {
    lane.addEventListener('dragover', e => { e.preventDefault(); lane.style.background = 'var(--bg-card)'; });
    lane.addEventListener('dragleave', () => { lane.style.background = 'var(--bg-elev)'; });
    lane.addEventListener('drop', e => {
      e.preventDefault();
      lane.style.background = 'var(--bg-elev)';
      const idx = parseInt(e.dataTransfer.getData('text/plain'));
      const msg = MESSAGES[idx];
      // Move card from inbox to lane
      const sourceCard = inboxEl.querySelector(`[data-idx="${idx}"]`);
      if (sourceCard) {
        sourceCard.draggable = false;
        sourceCard.style.cursor = 'default';
        sourceCard.style.opacity = '0.8';
        lane.appendChild(sourceCard);
        updateScore();
      }
    });
  });

  function updateScore() {
    const lanes = { cheap: cheapLane, mid: midLane, expensive: expensiveLane };
    let correct = 0;
    let total = 0;
    let totalCost = 0;
    let allInOneCost = 0;

    Object.entries(lanes).forEach(([laneKey, laneEl]) => {
      laneEl.querySelectorAll('.msg-card').forEach(card => {
        const idx = parseInt(card.dataset.idx);
        const msg = MESSAGES[idx];
        total++;
        if (msg.correct === laneKey) correct++;
        totalCost += MODELS[laneKey].costPer;
        allInOneCost += MODELS.expensive.costPer;
      });
    });

    if (total === 0) {
      resultEl.innerHTML = '<p style="color:var(--ink-muted);">把消息拖到对应的模型通道里!</p>';
      return;
    }

    const accuracy = Math.round((correct / total) * 100);
    const savings = allInOneCost > 0 ? Math.round((1 - totalCost / allInOneCost) * 100) : 0;
    const accColor = accuracy >= 75 ? 'var(--green)' : accuracy >= 50 ? 'var(--amber)' : 'var(--red)';

    resultEl.innerHTML = `
      <span class="router-score" style="color:${accColor};">${accuracy}% 正确</span>
      <div class="router-detail">
        路由了 ${total} / ${MESSAGES.length} 条消息 &middot;
        比全用 Opus 省 <strong style="color:var(--green);">${savings}%</strong> 成本
      </div>
    `;
  }

  // Reset button
  const resetBtn = document.getElementById('router-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      [cheapLane, midLane, expensiveLane].forEach(lane => {
        lane.querySelectorAll('.msg-card').forEach(c => c.remove());
      });
      renderInbox();
      updateScore();
    });
  }

  renderInbox();
  updateScore();
})();
