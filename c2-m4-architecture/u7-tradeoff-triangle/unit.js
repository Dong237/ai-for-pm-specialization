/* U7 · Trade-off Triangle Widget */
(() => {
  'use strict';

  const architectures = {
    prompt: {
      name: 'Prompt-only',
      color: 'green',
      cost: 1, effect: 2, complexity: 1,
      optimize: '成本 + 复杂度',
      sacrifice: '效果 (受限于模型自带能力)',
      tradeoff: '最便宜最简单, 但效果天花板低. 适合 MVP 快速验证.'
    },
    rag: {
      name: 'RAG',
      color: 'blue',
      cost: 3, effect: 4, complexity: 3,
      optimize: '效果 + 成本 (相对 Fine-tune)',
      sacrifice: '复杂度 (需要维护知识库和检索系统)',
      tradeoff: '效果好成本可控, 但搭建和维护有一定复杂度. 性价比最高的中间选项.'
    },
    finetune: {
      name: 'Fine-tune',
      color: 'amber',
      cost: 4, effect: 4, complexity: 4,
      optimize: '效果 (特定风格/术语)',
      sacrifice: '成本 + 复杂度 (训练费 + 数据准备 + 持续维护)',
      tradeoff: '效果最好但成本和复杂度都高. 只有品牌语调是核心竞争力时才值得.'
    },
    multiagent: {
      name: 'Multi-Agent',
      color: 'red',
      cost: 5, effect: 5, complexity: 5,
      optimize: '效果 (复杂任务处理能力)',
      sacrifice: '成本 + 复杂度 (多次 API 调用 + 编排 + 调试)',
      tradeoff: '能处理最复杂的任务, 但成本最高、调试最难. 规模化后才考虑.'
    }
  };

  const btns = document.querySelectorAll('.tri-btn');
  const svgEl = document.getElementById('tri-svg');
  const analysisEl = document.getElementById('tri-analysis');

  function renderTriangle(key) {
    const arch = architectures[key];
    btns.forEach(b => b.classList.toggle('active', b.dataset.arch === key));

    // Draw triangle with SVG
    const size = 360;
    const cx = size / 2;
    const cy = size / 2;
    const r = 140;

    // Triangle vertices
    const vertices = [
      { x: cx, y: cy - r, label: '效果', value: arch.effect },
      { x: cx - r * 0.87, y: cy + r * 0.5, label: '成本低', value: 6 - arch.cost },
      { x: cx + r * 0.87, y: cy + r * 0.5, label: '简单', value: 6 - arch.complexity }
    ];

    // Data point positions (closer to vertex = better on that dimension)
    const dataPoints = vertices.map(v => {
      const t = v.value / 5;
      return {
        x: cx + (v.x - cx) * t * 0.8,
        y: cy + (v.y - cy) * t * 0.8
      };
    });

    const colorVar = `var(--${arch.color})`;
    const bgVar = `var(--${arch.color}-bg)`;

    svgEl.innerHTML = `
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0 0, 6 3, 0 6" fill="var(--ink-faint)"/>
        </marker>
      </defs>
      <!-- Triangle outline -->
      <polygon points="${vertices.map(v => `${v.x},${v.y}`).join(' ')}" fill="none" stroke="var(--border-strong)" stroke-width="2" stroke-dasharray="6,4"/>
      <!-- Data area -->
      <polygon points="${dataPoints.map(p => `${p.x},${p.y}`).join(' ')}" fill="${bgVar}" stroke="${colorVar}" stroke-width="2.5" opacity="0.7"/>
      <!-- Data points -->
      ${dataPoints.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="6" fill="${colorVar}" stroke="var(--bg-card)" stroke-width="2"/>`).join('')}
      <!-- Labels -->
      ${vertices.map((v, i) => {
        const lx = cx + (v.x - cx) * 1.15;
        const ly = cy + (v.y - cy) * 1.15;
        return `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">${v.label}</text>`;
      }).join('')}
      <!-- Center label -->
      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="16" font-weight="700" fill="${colorVar}">${arch.name}</text>
    `;

    // Analysis text
    const dots = (n, color) => Array(5).fill(0).map((_, i) =>
      `<span class="tradeoff-dot ${i < n ? 'filled' : 'empty'}" style="background:${i < n ? color : 'transparent'};border-color:${color};"></span>`
    ).join('');

    analysisEl.innerHTML = `
      <div class="tri-arch-name" style="color:${colorVar}">${arch.name}</div>
      <div class="tri-scores">
        <div class="tri-score"><span class="tri-score-label">效果:</span><div class="tri-score-bar"><div class="tri-score-fill" style="width:${arch.effect*20}%;background:var(--green);"></div></div><span style="font-size:12px;">${arch.effect}/5</span></div>
        <div class="tri-score"><span class="tri-score-label">成本:</span><div class="tri-score-bar"><div class="tri-score-fill" style="width:${arch.cost*20}%;background:var(--red);"></div></div><span style="font-size:12px;">${arch.cost}/5</span></div>
        <div class="tri-score"><span class="tri-score-label">复杂:</span><div class="tri-score-bar"><div class="tri-score-fill" style="width:${arch.complexity*20}%;background:var(--amber);"></div></div><span style="font-size:12px;">${arch.complexity}/5</span></div>
      </div>
      <div class="tri-tradeoff">
        <strong>优化了:</strong> ${arch.optimize}<br/>
        <strong>牺牲了:</strong> ${arch.sacrifice}
      </div>
      <p style="font-size:13px;color:var(--ink-muted);margin:8px 0 0;">${arch.tradeoff}</p>
    `;
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => renderTriangle(btn.dataset.arch));
  });

  renderTriangle('prompt');
})();
