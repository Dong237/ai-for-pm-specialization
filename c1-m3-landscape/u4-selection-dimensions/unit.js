/* =============================================
   Unit 4 · 模型选型 6 维度
   Radar Chart Builder Widget
   ============================================= */

(() => {
  'use strict';

  // --- Model data: scores 1-10 for each dimension ---
  // Dimensions: [Cost, Chinese, Context, Speed, Multimodal, Reasoning]
  // Cost is INVERTED: high score = cheap (more affordable)
  // Data as of April 2026
  const models = {
    'deepseek-v4-flash': {
      name: 'DeepSeek V4 Flash',
      color: '#22c55e',
      scores: [10, 8, 7, 9, 5, 7]  // very cheap, good Chinese, 128K, fast, text-only, decent reasoning
    },
    'gpt55': {
      name: 'GPT-5.5',
      color: '#ef4444',
      scores: [1, 8, 9, 5, 10, 10] // very expensive, good Chinese, 1M, slower, full multimodal, best reasoning
    },
    'claude-opus': {
      name: 'Claude Opus 4.7',
      color: '#8b5cf6',
      scores: [2, 9, 9, 5, 8, 10] // expensive, great Chinese, 1M, slower, vision+, top reasoning
    },
    'qwen36-max': {
      name: 'Qwen3.6-Max',
      color: '#f59e0b',
      scores: [7, 10, 8, 8, 7, 8] // moderate price, best Chinese, 1M, fast, some multimodal, strong reasoning
    },
    'kimi-k26': {
      name: 'Kimi K2.6',
      color: '#06b6d4',
      scores: [8, 8, 8, 7, 6, 8] // cheap, good Chinese, long ctx, decent speed, limited mm, good reasoning
    },
    'gemini-flash': {
      name: 'Gemini 2.5 Flash',
      color: '#3b82f6',
      scores: [9, 6, 9, 10, 9, 6] // very cheap, ok Chinese, 1M, very fast, strong multimodal, ok reasoning
    },
    'doubao': {
      name: 'Doubao-Seed-2.0',
      color: '#ec4899',
      scores: [8, 9, 7, 8, 6, 7] // cheap (RMB), top Chinese, moderate ctx, fast, limited mm, decent
    },
    'claude-haiku': {
      name: 'Claude Haiku 4.5',
      color: '#14b8a6',
      scores: [7, 8, 8, 9, 7, 6] // moderate, good Chinese, 200K, fast, vision, moderate reasoning
    }
  };

  const dims = ['Cost\n成本', 'Chinese\n中文', 'Context\n上下文', 'Speed\n速度', 'Multi-\nmodal', 'Reasoning\n推理'];
  const dimShort = ['成本', '中文', '上下文', '速度', '多模态', '推理'];

  const canvas = document.getElementById('radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const sel1 = document.getElementById('model-1');
  const sel2 = document.getElementById('model-2');
  const sel3 = document.getElementById('model-3');
  const legendEl = document.getElementById('radar-legend');
  const scoresEl = document.getElementById('radar-scores');

  function getSelected() {
    const picks = [];
    [sel1, sel2, sel3].forEach(sel => {
      const v = sel.value;
      if (v !== 'none' && models[v]) picks.push(models[v]);
    });
    return picks;
  }

  function drawRadar() {
    const dpr = window.devicePixelRatio || 1;
    const W = 460;
    const H = 420;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Colors from CSS
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const inkColor = isDark ? '#e8e8e8' : '#1e1e1e';
    const inkMuted = isDark ? '#6a6a78' : '#b0b0b0';
    const bgColor = isDark ? '#232333' : '#ffffff';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2 + 10;
    const R = 150;
    const n = 6;
    const angleStep = (2 * Math.PI) / n;
    const startAngle = -Math.PI / 2; // top

    // Draw grid rings
    for (let ring = 2; ring <= 10; ring += 2) {
      const r = (ring / 10) * R;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = startAngle + i * angleStep;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ring label
      if (ring === 10) {
        ctx.fillStyle = inkMuted;
        ctx.font = '11px sans-serif';
        ctx.fillText(ring.toString(), cx + 4, cy - r + 12);
      }
    }

    // Draw axes
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Labels
      const labelR = R + 28;
      const lx = cx + labelR * Math.cos(angle);
      const ly = cy + labelR * Math.sin(angle);

      ctx.fillStyle = inkColor;
      ctx.font = '600 13px "Excalifont", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lines = dims[i].split('\n');
      lines.forEach((line, li) => {
        ctx.fillText(line, lx, ly + (li - (lines.length - 1) / 2) * 16);
      });
    }

    // Draw model polygons
    const picks = getSelected();
    picks.forEach(model => {
      const pts = model.scores.map((s, i) => {
        const angle = startAngle + i * angleStep;
        const r = (s / 10) * R;
        return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
      });

      // Fill
      ctx.beginPath();
      pts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p[0], p[1]);
        else ctx.lineTo(p[0], p[1]);
      });
      ctx.closePath();
      ctx.fillStyle = model.color + '22';
      ctx.fill();

      // Stroke
      ctx.beginPath();
      pts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p[0], p[1]);
        else ctx.lineTo(p[0], p[1]);
      });
      ctx.closePath();
      ctx.strokeStyle = model.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Dots
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
        ctx.fillStyle = model.color;
        ctx.fill();
        ctx.strokeStyle = bgColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    });

    // Update legend
    legendEl.innerHTML = picks.map(m =>
      `<span class="legend-item"><span class="legend-dot" style="background:${m.color}"></span>${m.name}</span>`
    ).join('');

    // Update scores table
    if (picks.length === 0) {
      scoresEl.innerHTML = '<p style="text-align:center;color:var(--ink-muted);">请选择至少一个模型</p>';
      return;
    }

    let html = '<div class="score-row score-header"><span>模型</span>';
    dimShort.forEach(d => { html += `<span>${d}</span>`; });
    html += '</div>';

    picks.forEach(m => {
      html += `<div class="score-row"><span style="color:${m.color};font-weight:700;">${m.name}</span>`;
      m.scores.forEach(s => { html += `<span>${s}/10</span>`; });
      html += '</div>';
    });

    scoresEl.innerHTML = html;
  }

  // Event listeners
  [sel1, sel2, sel3].forEach(sel => {
    sel.addEventListener('change', drawRadar);
  });

  // Redraw on theme change
  const themeObs = new MutationObserver(drawRadar);
  themeObs.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

  // Initial draw after fonts load
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => requestAnimationFrame(drawRadar));
  } else {
    window.addEventListener('load', drawRadar);
  }

  // Redraw on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawRadar, 200);
  });

})();
