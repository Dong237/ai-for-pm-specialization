/* Unit 2 · Embedding Explorer — 2D scatter with draggable words */
(() => {
  'use strict';

  const canvas = document.getElementById('embed-canvas');
  if (!canvas) return;

  const infoEl = document.getElementById('embed-info');

  // Pre-defined word positions (simulated 2D embedding space)
  const categories = {
    fruit:    { color: '#22c55e', label: '水果' },
    vehicle:  { color: '#4a9eed', label: '交通工具' },
    health:   { color: '#f59e0b', label: '健康' },
    emotion:  { color: '#8b5cf6', label: '情绪' }
  };

  const words = [
    { text: '苹果',   x: 0.20, y: 0.25, cat: 'fruit' },
    { text: '橘子',   x: 0.25, y: 0.30, cat: 'fruit' },
    { text: '香蕉',   x: 0.18, y: 0.35, cat: 'fruit' },
    { text: '西瓜',   x: 0.28, y: 0.22, cat: 'fruit' },
    { text: '汽车',   x: 0.72, y: 0.70, cat: 'vehicle' },
    { text: '火车',   x: 0.78, y: 0.75, cat: 'vehicle' },
    { text: '飞机',   x: 0.68, y: 0.78, cat: 'vehicle' },
    { text: '自行车',  x: 0.75, y: 0.65, cat: 'vehicle' },
    { text: '经期',   x: 0.55, y: 0.20, cat: 'health' },
    { text: '排卵',   x: 0.50, y: 0.25, cat: 'health' },
    { text: '备孕',   x: 0.58, y: 0.28, cat: 'health' },
    { text: '叶酸',   x: 0.52, y: 0.18, cat: 'health' },
    { text: '开心',   x: 0.30, y: 0.72, cat: 'emotion' },
    { text: '焦虑',   x: 0.38, y: 0.80, cat: 'emotion' },
    { text: '疲惫',   x: 0.35, y: 0.75, cat: 'emotion' },
  ];

  const dots = [];
  const labels = [];
  let selectedIdx = -1;
  let dragIdx = -1;
  let dragOffset = { x: 0, y: 0 };

  // Create dots and labels
  words.forEach((w, i) => {
    const dot = document.createElement('div');
    dot.className = 'embed-dot';
    dot.style.background = categories[w.cat].color;
    dot.style.left = (w.x * 100) + '%';
    dot.style.top = (w.y * 100) + '%';
    dot.dataset.idx = i;
    canvas.appendChild(dot);
    dots.push(dot);

    const lbl = document.createElement('div');
    lbl.className = 'embed-label';
    lbl.textContent = w.text;
    lbl.style.left = (w.x * 100) + '%';
    lbl.style.top = (w.y * 100) + '%';
    canvas.appendChild(lbl);
    labels.push(lbl);
  });

  // Build legend
  const legendEl = document.getElementById('embed-legend');
  if (legendEl) {
    Object.entries(categories).forEach(([key, val]) => {
      const item = document.createElement('div');
      item.className = 'embed-legend-item';
      item.innerHTML = `<span class="embed-legend-dot" style="background:${val.color}"></span>${val.label}`;
      legendEl.appendChild(item);
    });
  }

  // Euclidean distance
  function dist(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  // Show nearest neighbors on click
  function showNeighbors(idx) {
    selectedIdx = idx;
    const w = words[idx];

    // Calculate distances to all other words
    const dists = words.map((other, i) => ({
      idx: i, text: other.text, cat: other.cat,
      d: dist(w, other)
    })).filter(d => d.idx !== idx).sort((a, b) => a.d - b.d);

    const top3 = dists.slice(0, 3);
    const sameCat = top3.filter(d => d.cat === w.cat).length;

    infoEl.innerHTML = `<strong>"${w.text}"</strong> 的最近 3 个邻居: ` +
      top3.map(d => `<span style="color:${categories[d.cat].color};font-weight:600">${d.text}</span> (${(1 - d.d).toFixed(2)})`).join(', ') +
      `<br/><span class="muted">${sameCat}/3 个是同类 — ${sameCat >= 2 ? '语义空间确实把相似概念聚在一起了!' : '试试拖动它到同类附近看效果.'}</span>`;

    // Highlight dots
    dots.forEach((dot, i) => {
      dot.style.transform = i === idx ?
        'translate(-50%,-50%) scale(1.8)' :
        'translate(-50%,-50%) scale(1)';
      dot.style.opacity = top3.some(d => d.idx === i) || i === idx ? '1' : '0.4';
    });
  }

  // Click handler
  canvas.addEventListener('click', (e) => {
    const dot = e.target.closest('.embed-dot');
    if (!dot) {
      // Reset
      dots.forEach(d => { d.style.transform = 'translate(-50%,-50%) scale(1)'; d.style.opacity = '1'; });
      infoEl.innerHTML = '点击任意词语圆点, 查看它的最近邻居. 拖动圆点可以移动位置.';
      return;
    }
    showNeighbors(parseInt(dot.dataset.idx));
  });

  // Drag handler
  canvas.addEventListener('mousedown', (e) => {
    const dot = e.target.closest('.embed-dot');
    if (!dot) return;
    dragIdx = parseInt(dot.dataset.idx);
    dot.classList.add('dragging');
    const rect = canvas.getBoundingClientRect();
    dragOffset.x = e.clientX - (words[dragIdx].x * rect.width);
    dragOffset.y = e.clientY - (words[dragIdx].y * rect.height);
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (dragIdx < 0) return;
    const rect = canvas.getBoundingClientRect();
    const nx = Math.max(0.05, Math.min(0.95, (e.clientX - dragOffset.x) / rect.width));
    const ny = Math.max(0.05, Math.min(0.95, (e.clientY - dragOffset.y) / rect.height));
    words[dragIdx].x = nx;
    words[dragIdx].y = ny;
    dots[dragIdx].style.left = (nx * 100) + '%';
    dots[dragIdx].style.top = (ny * 100) + '%';
    labels[dragIdx].style.left = (nx * 100) + '%';
    labels[dragIdx].style.top = (ny * 100) + '%';
    if (selectedIdx === dragIdx) showNeighbors(dragIdx);
  });

  window.addEventListener('mouseup', () => {
    if (dragIdx >= 0) {
      dots[dragIdx].classList.remove('dragging');
      dragIdx = -1;
    }
  });

  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    const dot = e.target.closest('.embed-dot');
    if (!dot) return;
    dragIdx = parseInt(dot.dataset.idx);
    dot.classList.add('dragging');
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    dragOffset.x = touch.clientX - (words[dragIdx].x * rect.width);
    dragOffset.y = touch.clientY - (words[dragIdx].y * rect.height);
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    if (dragIdx < 0) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const nx = Math.max(0.05, Math.min(0.95, (touch.clientX - dragOffset.x) / rect.width));
    const ny = Math.max(0.05, Math.min(0.95, (touch.clientY - dragOffset.y) / rect.height));
    words[dragIdx].x = nx;
    words[dragIdx].y = ny;
    dots[dragIdx].style.left = (nx * 100) + '%';
    dots[dragIdx].style.top = (ny * 100) + '%';
    labels[dragIdx].style.left = (nx * 100) + '%';
    labels[dragIdx].style.top = (ny * 100) + '%';
    if (selectedIdx === dragIdx) showNeighbors(dragIdx);
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchend', () => {
    if (dragIdx >= 0) {
      dots[dragIdx].classList.remove('dragging');
      showNeighbors(dragIdx);
      dragIdx = -1;
    }
  });
})();
