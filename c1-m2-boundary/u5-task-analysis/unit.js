/* ===== Unit 5 · 2×2 Matrix Widget ===== */
(() => {
  'use strict';

  // ----- Feature cards data -----
  const features = [
    { id: 'f1', icon: '💬', name: '智能问答', desc: '用户问健康问题, AI 回答', suggested: 'star' },
    { id: 'f2', icon: '📊', name: '身体状态分类', desc: '识别用户处于 5 状态中的哪个', suggested: 'star' },
    { id: 'f3', icon: '🍎', name: '饮食记录总结', desc: '把早餐照片/文字生成营养摘要', suggested: 'quickwin' },
    { id: 'f4', icon: '💊', name: 'AI 开药建议', desc: '根据症状推荐用药', suggested: 'question' },
    { id: 'f5', icon: '🧮', name: 'BMI 精确计算', desc: '根据身高体重算 BMI', suggested: 'dont' },
    { id: 'f6', icon: '😊', name: '情绪安抚对话', desc: '用户说"今天好累", AI 温柔回应', suggested: 'star' },
    { id: 'f7', icon: '📈', name: '经期预测', desc: '基于历史数据预测下次经期', suggested: 'question' },
    { id: 'f8', icon: '📝', name: '周报生成', desc: '每周自动总结用户健康数据', suggested: 'quickwin' },
  ];

  const quadrantNames = {
    star: '⭐ Star',
    question: '❓ Question Mark',
    quickwin: '⚡ Quick Win',
    dont: '🚫 Don\'t Bother'
  };

  // ----- DOM references -----
  const pool = document.getElementById('feature-pool');
  const quadrants = {
    star: document.getElementById('quad-star-zone'),
    question: document.getElementById('quad-question-zone'),
    quickwin: document.getElementById('quad-quickwin-zone'),
    dont: document.getElementById('quad-dont-zone')
  };
  const resetBtn = document.getElementById('matrix-reset-btn');
  const answerBtn = document.getElementById('matrix-answer-btn');
  const answerContent = document.getElementById('matrix-answer');

  if (!pool) return;

  // ----- State -----
  let draggedChip = null;

  // ----- Create chips -----
  function createChip(f) {
    const chip = document.createElement('div');
    chip.className = 'feature-chip';
    chip.setAttribute('draggable', 'true');
    chip.dataset.id = f.id;
    chip.innerHTML = `<span class="chip-icon">${f.icon}</span> ${f.name}`;
    chip.title = f.desc;

    // Drag events
    chip.addEventListener('dragstart', (e) => {
      draggedChip = chip;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', f.id);
      chip.style.opacity = '0.5';
    });
    chip.addEventListener('dragend', () => {
      chip.style.opacity = '1';
      draggedChip = null;
      clearDragOver();
    });

    // Touch support
    let touchStartX, touchStartY, touchClone;
    chip.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      draggedChip = chip;

      // Create visual clone
      touchClone = chip.cloneNode(true);
      touchClone.style.position = 'fixed';
      touchClone.style.zIndex = '1000';
      touchClone.style.pointerEvents = 'none';
      touchClone.style.opacity = '0.8';
      touchClone.style.transform = 'rotate(-3deg) scale(1.05)';
      document.body.appendChild(touchClone);
      updateClonePosition(touch);
    }, { passive: true });

    chip.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touchClone) updateClonePosition(touch);

      // Highlight drop target
      clearDragOver();
      const target = getDropTarget(touch.clientX, touch.clientY);
      if (target) target.classList.add('drag-over');
    });

    chip.addEventListener('touchend', (e) => {
      if (touchClone) {
        document.body.removeChild(touchClone);
        touchClone = null;
      }
      clearDragOver();

      const touch = e.changedTouches[0];
      const target = getDropTarget(touch.clientX, touch.clientY);
      if (target && draggedChip) {
        target.appendChild(draggedChip);
        draggedChip.classList.add('placed');
      }
      draggedChip = null;
    });

    function updateClonePosition(touch) {
      touchClone.style.left = (touch.clientX - 60) + 'px';
      touchClone.style.top = (touch.clientY - 20) + 'px';
    }

    return chip;
  }

  function getDropTarget(x, y) {
    const els = document.elementsFromPoint(x, y);
    for (const el of els) {
      if (el.classList.contains('matrix-quadrant')) return el;
      if (el.id === 'feature-pool') return pool;
    }
    return null;
  }

  function clearDragOver() {
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
  }

  // ----- Setup drop zones -----
  function setupDropZone(zone) {
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
      if (draggedChip) {
        zone.appendChild(draggedChip);
        draggedChip.classList.toggle('placed', zone !== pool);
      }
    });
  }

  setupDropZone(pool);
  Object.values(quadrants).forEach(setupDropZone);

  // ----- Init -----
  function init() {
    pool.querySelectorAll('.feature-chip').forEach(c => c.remove());
    Object.values(quadrants).forEach(q => {
      q.querySelectorAll('.feature-chip').forEach(c => c.remove());
    });

    features.forEach(f => {
      const chip = createChip(f);
      pool.appendChild(chip);
    });

    if (answerContent) answerContent.classList.remove('visible');
  }

  // ----- Reset -----
  if (resetBtn) {
    resetBtn.addEventListener('click', init);
  }

  // ----- Show suggested answer -----
  if (answerBtn && answerContent) {
    answerBtn.addEventListener('click', () => {
      // Move chips to suggested quadrants
      features.forEach(f => {
        const chip = document.querySelector(`.feature-chip[data-id="${f.id}"]`);
        if (chip && quadrants[f.suggested]) {
          quadrants[f.suggested].appendChild(chip);
          chip.classList.add('placed');
        }
      });
      answerContent.classList.add('visible');
    });
  }

  init();

})();
