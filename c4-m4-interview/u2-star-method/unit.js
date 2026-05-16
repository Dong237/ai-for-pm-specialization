/* U2: STAR Method — STAR Builder Widget */
(() => {
  'use strict';

  const builder = document.getElementById('star-builder');
  if (!builder) return;

  const STORAGE_KEY = 'u2-star-state';

  const panels = [
    { key: 'situation', label: 'S — Situation', color: 'blue', placeholder: '例: 我在一家女性健康创业公司担任 AI PM, 产品 Vitamin 是一款 5 状态身体追踪 App, 用户日活 10,000, 但用户留存率从 D7 40% 下降到 D30 15%...' },
    { key: 'task', label: 'T — Task', color: 'amber', placeholder: '例: 我的任务是在 3 个月内通过 AI 功能提升 D30 留存率到 25%, 预算限制在每月 $200 Token 成本内...' },
    { key: 'action', label: 'A — Action (重点, 多写)', color: 'green', placeholder: '例: 我做了 4 件事: (1) 调研用户流失原因, 发现 60% 用户觉得"记录太麻烦". (2) 设计了 AI 智能记录功能, 用户说一句话就能自动分类到 5 状态. (3) 选型时对比了 RAG 和 Fine-tune, 最终选了 RAG + GPT-4o-mini 的组合... (4) 建了 100 条评测集...' },
    { key: 'result', label: 'R — Result', color: 'red', placeholder: '例: 上线 6 周后, D30 留存率从 15% 提升到 28%, 超过目标. 月 Token 成本控制在 $108. NPS 从 32 提升到 51...' }
  ];

  // Load saved state
  let state = {};
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) state = saved;
  } catch (e) { /* ignore */ }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // Build panels
  const panelsContainer = builder.querySelector('.star-panels');
  const previewText = builder.querySelector('.star-preview-text');
  const wordCountEl = document.getElementById('star-word-count');
  const timeEstEl = document.getElementById('star-time-est');

  panels.forEach(p => {
    const panel = document.createElement('div');
    panel.className = 'star-panel';
    panel.innerHTML = `
      <div class="star-panel-label">${p.label}</div>
      <div class="star-panel-hint">占总时长 ${p.key === 'action' ? '60%' : p.key === 'situation' ? '20%' : '10%'}</div>
      <textarea placeholder="${p.placeholder}" data-key="${p.key}">${state[p.key] || ''}</textarea>
    `;
    panelsContainer.appendChild(panel);

    const textarea = panel.querySelector('textarea');
    textarea.addEventListener('input', () => {
      state[p.key] = textarea.value;
      save();
      updatePreview();
    });
  });

  function updatePreview() {
    const s = state.situation || '';
    const t = state.task || '';
    const a = state.action || '';
    const r = state.result || '';

    if (!s && !t && !a && !r) {
      previewText.innerHTML = '<span style="color:var(--ink-faint);font-style:italic;">在上方填写内容, 这里会自动生成你的 STAR 故事...</span>';
    } else {
      let html = '';
      if (s) html += `<span class="star-label s-label">S</span> ${escapeHtml(s)} `;
      if (t) html += `<br><br><span class="star-label t-label">T</span> ${escapeHtml(t)} `;
      if (a) html += `<br><br><span class="star-label a-label">A</span> ${escapeHtml(a)} `;
      if (r) html += `<br><br><span class="star-label r-label">R</span> ${escapeHtml(r)} `;
      previewText.innerHTML = html;
    }

    // Word count and time estimate
    const totalText = s + t + a + r;
    const charCount = totalText.replace(/\s/g, '').length;
    const wordCount = totalText.trim() ? totalText.trim().split(/\s+/).length : 0;
    // Chinese: ~250 chars/min speaking speed
    const timeMin = Math.ceil(charCount / 250);

    if (wordCountEl) wordCountEl.textContent = charCount;
    if (timeEstEl) timeEstEl.textContent = timeMin < 1 ? '< 1' : '~' + timeMin;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Preview button
  const previewBtn = document.getElementById('star-preview-btn');
  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      const previewEl = document.getElementById('star-preview');
      if (previewEl) {
        previewEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Reset button
  const resetBtn = document.getElementById('star-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state = {};
      save();
      builder.querySelectorAll('textarea').forEach(ta => { ta.value = ''; });
      updatePreview();
    });
  }

  // Fill example button
  const exampleBtn = document.getElementById('star-example');
  if (exampleBtn) {
    exampleBtn.addEventListener('click', () => {
      state.situation = '我在一家女性健康创业公司担任唯一的 AI PM. 产品 Vitamin 是一款基于 5 状态身体追踪的 AI App, 用户日活约 10,000. 但数据显示, D7 留存 40% → D30 留存仅 15%, 用户流失严重.';
      state.task = '我的目标是: 3 个月内通过引入 AI 功能, 将 D30 留存率从 15% 提升到 25%. 约束条件: 月 Token 成本不超过 $200, 团队只有 2 个后端工程师.';
      state.action = '我做了 4 件事:\n\n(1) 用户调研 — 访谈了 20 个流失用户, 发现 60% 的人觉得"每天手动记录太麻烦". 核心需求是"说一句话就完成记录".\n\n(2) 方案设计 — 设计了 AI 智能记录功能: 用户语音或文字输入 (如"今天有点累, 吃了沙拉"), AI 自动提取情绪、饮食、运动等信息, 分类到 5 状态体系.\n\n(3) 技术选型 — 对比了 3 种方案: 纯 Prompt、RAG、Fine-tune. 最终选了 RAG + GPT-4o-mini: RAG 负责健康知识检索, GPT-4o-mini 控制成本 (比 GPT-4o 便宜 15 倍). 建了 100 条评测集, F1 达到 0.87.\n\n(4) 灰度上线 — 先给 10% 用户开放, 监控幻觉率和用户满意度. 幻觉率从 8% 降到 2% 后全量上线.';
      state.result = '上线 6 周后:\n• D30 留存率: 15% → 28% (超过目标)\n• 月 Token 成本: $108 (远低于 $200 预算)\n• 用户 NPS: 32 → 51\n• AI 功能日均使用率: 73% 的活跃用户每天至少用 1 次';
      save();
      builder.querySelectorAll('textarea').forEach(ta => {
        ta.value = state[ta.dataset.key] || '';
      });
      updatePreview();
    });
  }

  updatePreview();
})();
