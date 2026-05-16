/* ===========================================
   Unit 8 · Vitamin 6 候选场景取舍 — Priority Matrix Widget
   ===========================================
   Drag-and-drop 6 feature cards into 2×2 quadrants.
   Check answer, show score, generate roadmap.
   Supports both mouse drag and touch drag.
*/

(() => {
  'use strict';

  // ===== Data =====
  const FEATURES = [
    { id: 0, name: '症状关键词提取', icon: '🔍', type: 'Reading', answer: 'tl', roi: 9, ttv: 9 },
    { id: 1, name: '个性化健康建议', icon: '💊', type: 'Writing', answer: 'tr', roi: 9, ttv: 7 },
    { id: 2, name: '多轮对话',       icon: '💬', type: 'Chatting', answer: 'tr', roi: 7, ttv: 4 },
    { id: 3, name: '饮食拍照',       icon: '📷', type: 'Multimodal', answer: 'br', roi: 5, ttv: 3 },
    { id: 4, name: '术语翻译',       icon: '📝', type: 'Writing', answer: 'bl', roi: 5, ttv: 10 },
    { id: 5, name: '情绪分类',       icon: '🧠', type: 'Reading', answer: 'tl', roi: 7, ttv: 9 }
  ];

  const QUADRANT_NAMES = {
    tl: '🟢 立刻做',
    tr: '🔵 规划好再做',
    bl: '🟡 顺手做',
    br: '🔴 先不做'
  };

  const QUADRANT_PHASES = {
    tl: { phase: 'Phase 1', time: 'Week 1-4', color: 'var(--green)' },
    tr: { phase: 'Phase 2', time: 'Month 2-3', color: 'var(--blue)' },
    bl: { phase: 'Phase 1 搭车', time: 'Week 3', color: 'var(--amber)' },
    br: { phase: 'Phase 3+', time: 'Month 4+', color: 'var(--red)' }
  };

  // ===== DOM Refs =====
  const progressEl = document.getElementById('mw-progress');
  const quadrants = {
    tl: document.getElementById('q-tl'),
    tr: document.getElementById('q-tr'),
    bl: document.getElementById('q-bl'),
    br: document.getElementById('q-br')
  };
  const cardTray = document.getElementById('mw-card-tray');
  const checkBtn = document.getElementById('mw-check');
  const resetBtn = document.getElementById('mw-reset');
  const roadmapBtn = document.getElementById('mw-roadmap');
  const resultEl = document.getElementById('mw-result');
  const roadmapOutput = document.getElementById('mw-roadmap-output');

  if (!cardTray || !checkBtn) return;

  // State
  let placements = {}; // featureId → quadrantKey
  let checked = false;

  // ===== Drag & Drop (Mouse) =====
  let draggedCard = null;

  cardTray.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.mw-card');
    if (!card || checked) return;
    draggedCard = card;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.dataset.feature);
  });

  cardTray.addEventListener('dragend', (e) => {
    if (draggedCard) {
      draggedCard.classList.remove('dragging');
      draggedCard = null;
    }
  });

  // Also handle dragstart from within quadrants (re-dragging placed cards)
  document.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.mw-card');
    if (!card || checked) return;
    draggedCard = card;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.dataset.feature);
  });

  document.addEventListener('dragend', (e) => {
    if (draggedCard) {
      draggedCard.classList.remove('dragging');
      draggedCard = null;
    }
  });

  // Quadrant drop zones
  Object.entries(quadrants).forEach(([key, el]) => {
    el.addEventListener('dragover', (e) => {
      if (checked) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      el.classList.add('drag-over');
    });

    el.addEventListener('dragleave', () => {
      el.classList.remove('drag-over');
    });

    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.classList.remove('drag-over');
      if (checked) return;

      const featureId = e.dataTransfer.getData('text/plain');
      if (featureId === '') return;

      placeCard(parseInt(featureId, 10), key);
    });
  });

  // Drop back to tray
  cardTray.addEventListener('dragover', (e) => {
    if (checked) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });

  cardTray.addEventListener('drop', (e) => {
    e.preventDefault();
    if (checked) return;
    const featureId = e.dataTransfer.getData('text/plain');
    if (featureId === '') return;
    unplaceCard(parseInt(featureId, 10));
  });

  // ===== Touch Drag Support =====
  let touchCard = null;
  let touchClone = null;
  let touchOffsetX = 0;
  let touchOffsetY = 0;

  document.addEventListener('touchstart', (e) => {
    if (checked) return;
    const card = e.target.closest('.mw-card');
    if (!card) return;

    touchCard = card;
    const rect = card.getBoundingClientRect();
    const touch = e.touches[0];
    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;

    // Create floating clone
    touchClone = card.cloneNode(true);
    touchClone.style.position = 'fixed';
    touchClone.style.zIndex = '9999';
    touchClone.style.width = rect.width + 'px';
    touchClone.style.pointerEvents = 'none';
    touchClone.style.opacity = '0.85';
    touchClone.style.transform = 'rotate(-2deg) scale(1.05)';
    document.body.appendChild(touchClone);
    positionClone(touch);

    card.style.opacity = '0.3';
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!touchClone) return;
    e.preventDefault();
    positionClone(e.touches[0]);
  }, { passive: false });

  document.addEventListener('touchend', (e) => {
    if (!touchCard || !touchClone) return;

    const touch = e.changedTouches[0];
    touchClone.remove();
    touchClone = null;
    touchCard.style.opacity = '1';

    // Find drop target
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!dropTarget) { touchCard = null; return; }

    const quadrant = dropTarget.closest('.mw-quadrant');
    const tray = dropTarget.closest('.mw-card-tray');
    const featureId = parseInt(touchCard.dataset.feature, 10);

    if (quadrant) {
      const qKey = quadrant.dataset.quadrant;
      placeCard(featureId, qKey);
    } else if (tray) {
      unplaceCard(featureId);
    }

    touchCard = null;
  });

  function positionClone(touch) {
    if (!touchClone) return;
    touchClone.style.left = (touch.clientX - touchOffsetX) + 'px';
    touchClone.style.top = (touch.clientY - touchOffsetY) + 'px';
  }

  // ===== Card Placement Logic =====
  function placeCard(featureId, quadrantKey) {
    const card = document.querySelector('.mw-card[data-feature="' + featureId + '"]');
    if (!card) return;

    // Remove from current location
    delete placements[featureId];

    // Place in quadrant
    placements[featureId] = quadrantKey;
    quadrants[quadrantKey].appendChild(card);
    card.style.opacity = '1';

    updateProgress();
  }

  function unplaceCard(featureId) {
    const card = document.querySelector('.mw-card[data-feature="' + featureId + '"]');
    if (!card) return;

    delete placements[featureId];
    cardTray.appendChild(card);
    card.style.opacity = '1';

    // Remove check marks
    card.classList.remove('correct', 'incorrect');
    const checkMark = card.querySelector('.check-mark');
    if (checkMark) checkMark.remove();

    updateProgress();
  }

  function updateProgress() {
    const count = Object.keys(placements).length;
    progressEl.innerHTML = '已放置: <strong>' + count + '</strong> / 6';
    checkBtn.disabled = count < 6;
  }

  // ===== Check Answer =====
  checkBtn.addEventListener('click', () => {
    if (checked) return;
    checked = true;

    let correct = 0;
    const details = [];

    FEATURES.forEach(f => {
      const userQuad = placements[f.id];
      const card = document.querySelector('.mw-card[data-feature="' + f.id + '"]');
      if (!card) return;

      const isCorrect = userQuad === f.answer;
      if (isCorrect) {
        correct++;
        card.classList.add('correct');
        const mark = document.createElement('span');
        mark.className = 'check-mark';
        mark.textContent = ' ✓';
        mark.style.color = 'var(--green)';
        card.appendChild(mark);
      } else {
        card.classList.add('incorrect');
        const mark = document.createElement('span');
        mark.className = 'check-mark';
        mark.textContent = ' →' + QUADRANT_NAMES[f.answer].slice(0, 4);
        mark.style.color = 'var(--amber)';
        mark.style.fontSize = '10px';
        card.appendChild(mark);
        details.push(f.icon + ' ' + f.name + ': 建议放在 ' + QUADRANT_NAMES[f.answer] + ' (ROI ' + f.roi + ' + TTV ' + f.ttv + ')');
      }
    });

    // Show result
    resultEl.style.display = 'block';
    let scoreColor = correct >= 5 ? 'var(--green)' : correct >= 3 ? 'var(--amber)' : 'var(--red)';
    let scoreEmoji = correct === 6 ? '🎉' : correct >= 4 ? '👍' : '💪';

    let html = '<div class="result-score" style="color:' + scoreColor + '">' + scoreEmoji + ' ' + correct + ' / 6 与建议答案一致</div>';
    if (details.length > 0) {
      html += '<div class="result-detail"><strong>建议调整:</strong><br/>' + details.join('<br/>') + '</div>';
    } else {
      html += '<div class="result-detail" style="color:var(--green);text-align:center">完美! 你的判断跟建议完全一致.</div>';
    }
    resultEl.innerHTML = html;

    // Show roadmap button
    roadmapBtn.style.display = 'inline-block';

    // Disable further dragging
    document.querySelectorAll('.mw-card').forEach(c => {
      c.draggable = false;
      c.style.cursor = 'default';
    });

    checkBtn.disabled = true;
    checkBtn.textContent = '已检查 ✓';
  });

  // ===== Generate Roadmap =====
  roadmapBtn.addEventListener('click', () => {
    roadmapOutput.style.display = 'block';

    // Group features by their ACTUAL placement (user's choice)
    const phaseGroups = { tl: [], tr: [], bl: [], br: [] };
    FEATURES.forEach(f => {
      const quad = placements[f.id] || f.answer;
      phaseGroups[quad].push(f);
    });

    let roadmapText = '';
    let roadmapHtml = '<h4>你的 Vitamin AI 路线图</h4>';

    // Phase 1: tl + bl
    const p1Features = [...phaseGroups.tl, ...phaseGroups.bl];
    if (p1Features.length > 0) {
      roadmapHtml += '<div class="roadmap-phase-output"><span class="rpo-tag" style="background:var(--green-bg);color:var(--green)">Phase 1 · Week 1-4</span>';
      roadmapHtml += '<div class="rpo-features">' + p1Features.map(f => f.icon + ' ' + f.name).join(' &nbsp;|&nbsp; ') + '</div></div>';
      roadmapText += 'Phase 1 (Week 1-4): ' + p1Features.map(f => f.name).join(', ') + '\n';
    }

    // Phase 2: tr
    if (phaseGroups.tr.length > 0) {
      roadmapHtml += '<div class="roadmap-phase-output"><span class="rpo-tag" style="background:var(--blue-bg);color:var(--blue)">Phase 2 · Month 2-3</span>';
      roadmapHtml += '<div class="rpo-features">' + phaseGroups.tr.map(f => f.icon + ' ' + f.name).join(' &nbsp;|&nbsp; ') + '</div></div>';
      roadmapText += 'Phase 2 (Month 2-3): ' + phaseGroups.tr.map(f => f.name).join(', ') + '\n';
    }

    // Phase 3: br
    if (phaseGroups.br.length > 0) {
      roadmapHtml += '<div class="roadmap-phase-output"><span class="rpo-tag" style="background:var(--red-bg);color:var(--red)">Phase 3+ · Month 4+</span>';
      roadmapHtml += '<div class="rpo-features">' + phaseGroups.br.map(f => f.icon + ' ' + f.name).join(' &nbsp;|&nbsp; ') + '</div></div>';
      roadmapText += 'Phase 3+ (Month 4+): ' + phaseGroups.br.map(f => f.name).join(', ') + '\n';
    }

    // Copy button
    roadmapHtml += '<button class="copy-btn" id="copy-roadmap">复制文本</button>';

    roadmapOutput.innerHTML = roadmapHtml;

    // Copy handler
    const copyBtn = document.getElementById('copy-roadmap');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const fullText = 'Vitamin AI 功能路线图\n' + roadmapText;
        navigator.clipboard.writeText(fullText).then(() => {
          copyBtn.textContent = '已复制 ✓';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.textContent = '复制文本';
            copyBtn.classList.remove('copied');
          }, 2000);
        }).catch(() => {
          // Fallback
          copyBtn.textContent = '请手动复制';
        });
      });
    }

    roadmapBtn.style.display = 'none';

    // Scroll to roadmap
    roadmapOutput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // ===== Reset =====
  resetBtn.addEventListener('click', () => {
    checked = false;
    placements = {};

    // Move all cards back to tray
    document.querySelectorAll('.mw-card').forEach(card => {
      card.classList.remove('correct', 'incorrect');
      card.draggable = true;
      card.style.cursor = 'grab';
      card.style.opacity = '1';
      const mark = card.querySelector('.check-mark');
      if (mark) mark.remove();
      cardTray.appendChild(card);
    });

    resultEl.style.display = 'none';
    resultEl.innerHTML = '';
    roadmapOutput.style.display = 'none';
    roadmapOutput.innerHTML = '';
    roadmapBtn.style.display = 'none';
    checkBtn.disabled = true;
    checkBtn.textContent = '检查答案 ✓';

    updateProgress();
  });

  // Initial state
  updateProgress();

})();
