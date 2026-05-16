/* U2 · System-User Splitter — drag prompt lines between System and User columns */
(() => {
  'use strict';

  const systemCol = document.getElementById('system-col');
  const userCol = document.getElementById('user-col');
  const cacheFill = document.getElementById('cache-fill');
  const cacheValue = document.getElementById('cache-value');
  const cacheHint = document.getElementById('cache-hint');

  if (!systemCol || !userCol) return;

  // Prompt lines data: text + correct placement + cacheability weight
  const lines = [
    { id: 'l1', text: 'Role: 你是 Vitamin 的健康顾问"小 V"...', correct: 'system', weight: 20 },
    { id: 'l2', text: 'Task: 根据用户身体状态给出健康建议', correct: 'system', weight: 20 },
    { id: 'l3', text: 'Format: JSON 格式输出', correct: 'system', weight: 15 },
    { id: 'l4', text: '不要给出医疗诊断或用药建议', correct: 'system', weight: 15 },
    { id: 'l5', text: '用户输入: "今天肚子有点疼"', correct: 'user', weight: 0 },
    { id: 'l6', text: '当前状态: 经期第 3 天', correct: 'user', weight: 0 },
    { id: 'l7', text: '用户过往记录: 周期 28 天, 经期 5 天', correct: 'user', weight: 0 },
    { id: 'l8', text: 'Few-shot 示例 (输入→输出样例)', correct: 'system', weight: 15 },
  ];

  // Correct answer: system lines should be in system, user lines in user
  const correctSystemIds = lines.filter(l => l.correct === 'system').map(l => l.id);
  const correctUserIds = lines.filter(l => l.correct === 'user').map(l => l.id);

  // Render lines - initially all in a mixed order in user column
  function createLineEl(line) {
    const el = document.createElement('div');
    el.className = 'splitter-line';
    el.dataset.id = line.id;
    el.draggable = true;
    el.innerHTML = `${line.text}<span class="drag-handle">⠿</span>`;

    el.addEventListener('dragstart', (e) => {
      el.classList.add('dragging');
      e.dataTransfer.setData('text/plain', line.id);
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
    });

    // Touch support
    let touchStartY = 0;
    el.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    el.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      // Simple: if line is in user col and dragged left-ish, move to system; vice versa
      const parent = el.parentElement;
      if (parent === userCol) {
        systemCol.appendChild(el);
      } else {
        userCol.appendChild(el);
      }
      updateScore();
    });

    return el;
  }

  // Shuffle lines for initial placement
  const shuffled = [...lines].sort(() => Math.random() - 0.5);
  shuffled.forEach((line, i) => {
    const el = createLineEl(line);
    // Put first half in system, rest in user (random initial)
    if (i < 4) {
      systemCol.appendChild(el);
    } else {
      userCol.appendChild(el);
    }
  });

  // Drag and drop on columns
  [systemCol, userCol].forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    col.addEventListener('drop', (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      const el = document.querySelector(`.splitter-line[data-id="${id}"]`);
      if (el) {
        col.appendChild(el);
        updateScore();
      }
    });
  });

  // Click to toggle between columns
  document.querySelectorAll('.splitter-line').forEach(el => {
    el.addEventListener('click', () => {
      const parent = el.parentElement;
      if (parent === systemCol) {
        userCol.appendChild(el);
      } else {
        systemCol.appendChild(el);
      }
      updateScore();
    });
  });

  function updateScore() {
    const systemLines = [...systemCol.querySelectorAll('.splitter-line')].map(el => el.dataset.id);
    const userLines = [...userCol.querySelectorAll('.splitter-line')].map(el => el.dataset.id);

    // Calculate cacheability: lines correctly in system get their weight
    let totalWeight = lines.reduce((s, l) => s + (l.correct === 'system' ? l.weight : 0), 0) || 1;
    let earnedWeight = 0;
    let correctCount = 0;
    let totalCount = lines.length;

    lines.forEach(line => {
      const isInSystem = systemLines.includes(line.id);
      const isInUser = userLines.includes(line.id);
      const isCorrect = (line.correct === 'system' && isInSystem) || (line.correct === 'user' && isInUser);
      if (isCorrect) correctCount++;
      if (line.correct === 'system' && isInSystem) earnedWeight += line.weight;
    });

    // Cache score: % of system-correct lines actually in system
    const cachePercent = Math.round((earnedWeight / totalWeight) * 100);
    const overallCorrect = Math.round((correctCount / totalCount) * 100);

    if (cacheFill) cacheFill.style.width = cachePercent + '%';
    if (cacheValue) cacheValue.textContent = cachePercent + '%';

    // Update line styles
    document.querySelectorAll('.splitter-line').forEach(el => {
      el.classList.remove('in-system', 'in-user');
      if (el.parentElement === systemCol) el.classList.add('in-system');
      else el.classList.add('in-user');
    });

    // Hint text
    if (cacheHint) {
      if (cachePercent === 100 && overallCorrect === 100) {
        cacheHint.textContent = '完美! 所有不变的内容都在 System 里, 缓存命中率最大化!';
      } else if (cachePercent >= 70) {
        cacheHint.textContent = '不错! 但还有一些内容可以移到 System 里提高缓存率.';
      } else {
        cacheHint.textContent = '提示: 把不会每次变化的内容(Role/Task/Format/规则)拖到 System 列.';
      }
    }
  }

  updateScore();
})();
