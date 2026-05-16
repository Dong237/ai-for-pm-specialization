/* =============================================
   Unit 3 · AI 死穴 2: 长上下文大海捞针
   Needle Finder Widget + U-Curve Visualization
   ============================================= */

(() => {
  'use strict';

  // ===== U-Curve Bar Chart (Step 3) =====
  const uCurveContainer = document.getElementById('u-curve-bars');
  if (uCurveContainer) {
    // U-shaped attention scores (position 1..20)
    // High at start, dips in middle, high at end
    const scores = [
      92, 88, 82, 74, 65, 58, 52, 48, 45, 43,
      42, 44, 47, 50, 55, 62, 70, 78, 85, 91
    ];

    function getBarColor(score) {
      if (score >= 75) return 'var(--green)';
      if (score >= 55) return 'var(--amber)';
      return 'var(--red)';
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // Animate bars in
          const bars = uCurveContainer.querySelectorAll('.u-bar');
          bars.forEach((bar, i) => {
            setTimeout(() => {
              bar.style.height = scores[i] + '%';
            }, i * 40);
          });
          observer.unobserve(uCurveContainer);
        }
      });
    }, { threshold: 0.3 });

    scores.forEach((s, i) => {
      const bar = document.createElement('div');
      bar.className = 'u-bar';
      bar.style.height = '0%';
      bar.style.backgroundColor = getBarColor(s);
      bar.dataset.pct = s + '%';
      bar.title = `位置 ${i + 1}: ${s}% 准确率`;
      uCurveContainer.appendChild(bar);
    });

    observer.observe(uCurveContainer);
  }

  // ===== Attention Token Heatmap (Step 4) =====
  const attnContainer = document.getElementById('attn-tokens');
  if (attnContainer) {
    const tokenCount = 20;
    // Attention weights: high for early and late tokens
    const weights = [];
    for (let i = 0; i < tokenCount; i++) {
      const distFromEdge = Math.min(i, tokenCount - 1 - i);
      const w = Math.max(0.2, 1 - (distFromEdge / (tokenCount / 2)) * 0.8);
      weights.push(w);
    }

    weights.forEach((w, i) => {
      const token = document.createElement('div');
      token.className = 'attn-token';
      token.textContent = i + 1;

      // Color gradient: green (high attention) → red (low attention)
      const r = Math.round(239 * (1 - w) + 34 * w);
      const g = Math.round(68 * (1 - w) + 197 * w);
      const b = Math.round(68 * (1 - w) + 94 * w);
      token.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      token.title = `Token ${i + 1}: 注意力 ${Math.round(w * 100)}%`;

      attnContainer.appendChild(token);
    });
  }

  // ===== NIAH Heatmap (Step 7) =====
  const niahGrid = document.getElementById('niah-grid');
  if (niahGrid) {
    // 10 rows (context length: 4K..128K) × 10 cols (needle depth: 0%..100%)
    // Accuracy: high at edges, low in middle for longer contexts
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = document.createElement('div');
        cell.className = 'niah-cell';

        // Simulate accuracy: short context = mostly green, long context = U-shape
        const depth = col / 9; // 0 (start) to 1 (end)
        const length = row / 9; // 0 (4K) to 1 (128K)

        const edgeDist = Math.min(depth, 1 - depth); // 0 at edges, 0.5 in middle
        const midPenalty = edgeDist * 2; // 0 at edges, 1 in middle
        const lengthPenalty = length; // worse for longer contexts

        const accuracy = Math.max(0.15, 1 - midPenalty * lengthPenalty * 0.85);

        // Color: green (high) → yellow → red (low)
        const r = Math.round(accuracy < 0.5 ? 239 : 239 - (accuracy - 0.5) * 2 * (239 - 34));
        const g = Math.round(accuracy > 0.5 ? 197 : 68 + accuracy * 2 * (197 - 68));
        const b = Math.round(accuracy > 0.7 ? 94 : 68);
        cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        cell.title = `上下文 ${Math.round(4 + row * 13.8)}K, 深度 ${Math.round(depth * 100)}%: 准确率 ${Math.round(accuracy * 100)}%`;

        niahGrid.appendChild(cell);
      }
    }
  }

  // ===== Needle Finder Widget (Step 8) =====
  const docBlocks = document.getElementById('needle-doc');
  const attnBars = document.getElementById('needle-attn-bars');
  const resultBox = document.getElementById('needle-result');
  const resetBtn = document.getElementById('needle-reset');

  if (!docBlocks || !attnBars) return;

  const BLOCK_COUNT = 20;
  let needlePos = -1;

  // Base attention scores (U-shaped)
  function getBaseAttention(i, total) {
    const pos = i / (total - 1); // 0..1
    const edgeDist = Math.min(pos, 1 - pos);
    // U-shape: high at edges, low in middle
    return Math.max(0.15, 1 - edgeDist * 1.6);
  }

  function renderDoc() {
    docBlocks.innerHTML = '';
    for (let i = 0; i < BLOCK_COUNT; i++) {
      const block = document.createElement('div');
      block.className = 'doc-block';
      block.dataset.pos = i;
      block.textContent = i + 1;
      block.addEventListener('click', () => placeNeedle(i));
      if (i === needlePos) {
        block.classList.add('has-needle');
        block.textContent = '📌';
      }
      docBlocks.appendChild(block);
    }
  }

  function renderBars() {
    attnBars.innerHTML = '';
    for (let i = 0; i < BLOCK_COUNT; i++) {
      const bar = document.createElement('div');
      bar.className = 'needle-bar';

      const attn = getBaseAttention(i, BLOCK_COUNT);
      bar.style.height = (attn * 100) + '%';

      // Color gradient
      if (attn > 0.7) bar.style.backgroundColor = 'var(--green)';
      else if (attn > 0.45) bar.style.backgroundColor = 'var(--amber)';
      else bar.style.backgroundColor = 'var(--red)';

      if (i === needlePos) {
        bar.classList.add('is-needle');
      }

      attnBars.appendChild(bar);
    }
  }

  function placeNeedle(pos) {
    needlePos = pos;
    renderDoc();
    renderBars();
    showResult(pos);
  }

  function showResult(pos) {
    const attn = getBaseAttention(pos, BLOCK_COUNT);
    const pct = Math.round(attn * 100);

    let level, levelClass, explanation;
    if (pct >= 75) {
      level = '高';
      levelClass = 'high';
      explanation = `位置 ${pos + 1} 在文档的${pos < 5 ? '开头' : '结尾'} — AI 的注意力很集中, 找到关键信息的概率很高.`;
    } else if (pct >= 50) {
      level = '中';
      levelClass = 'mid';
      explanation = `位置 ${pos + 1} 离边缘有一定距离 — AI 的注意力开始下降, 有可能遗漏这里的信息.`;
    } else {
      level = '低';
      levelClass = 'low';
      explanation = `位置 ${pos + 1} 在文档的正中间 — 这是"记忆黑洞"! AI 大概率会忽略或遗忘这里的关键信息.`;
    }

    resultBox.innerHTML = `
      <div style="display:flex; align-items:center; gap:16px; margin-bottom:8px;">
        <span class="pct ${levelClass}">${pct}%</span>
        <span style="font-size:14px; color:var(--ink-soft);">AI 找到关键信息的概率 (${level})</span>
      </div>
      <div style="font-size:13px; color:var(--ink-muted);">${explanation}</div>
    `;
  }

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      needlePos = -1;
      renderDoc();
      renderBars();
      resultBox.innerHTML = '<span style="color:var(--ink-muted); font-size:14px;">点击上方的文档块, 把"关键信息"放在不同位置, 看 AI 找到它的概率.</span>';
    });
  }

  // Initial render
  renderDoc();
  renderBars();
  resultBox.innerHTML = '<span style="color:var(--ink-muted); font-size:14px;">点击上方的文档块, 把"关键信息"放在不同位置, 看 AI 找到它的概率.</span>';

})();
