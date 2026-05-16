/* U1 · Prompt Builder — 4-panel editor with live combined preview */
(() => {
  'use strict';

  // ===== Prompt Builder Widget =====
  const tabs = document.querySelectorAll('.pb-tab');
  const panels = document.querySelectorAll('.pb-panel');
  const previewOutput = document.getElementById('pb-preview-output');
  const copyBtn = document.getElementById('pb-copy');
  const scoreEl = document.getElementById('pb-score');
  const scoreFill = document.getElementById('pb-score-fill');

  if (!tabs.length || !previewOutput) return;

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const section = tab.dataset.section;
      document.getElementById('pb-panel-' + section).classList.add('active');
    });
  });

  // Text areas
  const roleTA = document.getElementById('ta-role');
  const taskTA = document.getElementById('ta-task');
  const contextTA = document.getElementById('ta-context');
  const formatTA = document.getElementById('ta-format');

  // Default values
  const defaults = {
    role: '你是一位专业的女性健康顾问,有10年临床经验,擅长用通俗易懂的语言解释复杂的健康概念。',
    task: '根据用户描述的身体状态,给出个性化的健康建议和注意事项。',
    context: '用户正在使用 Vitamin 女性健康 App,她当前处于经期第2天,感觉腹部不适和疲劳。',
    format: '请按以下格式输出:\n1. 状态解读(1-2句)\n2. 建议措施(3条,每条一句话)\n3. 需要注意的信号(1条)'
  };

  // Set defaults
  roleTA.value = defaults.role;
  taskTA.value = defaults.task;
  contextTA.value = defaults.context;
  formatTA.value = defaults.format;

  function buildPreview() {
    const role = roleTA.value.trim();
    const task = taskTA.value.trim();
    const context = contextTA.value.trim();
    const format = formatTA.value.trim();

    let parts = [];
    let filledCount = 0;

    if (role) {
      parts.push(`<span class="tag-role">## Role</span>\n${role}`);
      filledCount++;
    }
    if (task) {
      parts.push(`<span class="tag-task">## Task</span>\n${task}`);
      filledCount++;
    }
    if (context) {
      parts.push(`<span class="tag-context">## Context</span>\n${context}`);
      filledCount++;
    }
    if (format) {
      parts.push(`<span class="tag-format">## Output Format</span>\n${format}`);
      filledCount++;
    }

    if (parts.length === 0) {
      previewOutput.innerHTML = '<span style="color:var(--ink-muted);font-style:italic;">在左边的面板中填写内容, 这里会实时生成完整的 Prompt...</span>';
    } else {
      previewOutput.innerHTML = parts.join('\n\n');
    }

    // Score
    const score = filledCount * 25;
    if (scoreEl) scoreEl.textContent = score + '%';
    if (scoreFill) {
      scoreFill.style.width = score + '%';
      if (score <= 25) { scoreFill.style.background = 'var(--red)'; }
      else if (score <= 50) { scoreFill.style.background = 'var(--amber)'; }
      else if (score <= 75) { scoreFill.style.background = 'var(--blue)'; }
      else { scoreFill.style.background = 'var(--green)'; }
    }
  }

  [roleTA, taskTA, contextTA, formatTA].forEach(ta => {
    ta.addEventListener('input', buildPreview);
  });

  // Copy to clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const role = roleTA.value.trim();
      const task = taskTA.value.trim();
      const context = contextTA.value.trim();
      const format = formatTA.value.trim();

      let text = '';
      if (role) text += `## Role\n${role}\n\n`;
      if (task) text += `## Task\n${task}\n\n`;
      if (context) text += `## Context\n${context}\n\n`;
      if (format) text += `## Output Format\n${format}`;

      navigator.clipboard.writeText(text.trim()).then(() => {
        copyBtn.textContent = '已复制!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = '复制完整 Prompt';
          copyBtn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        copyBtn.textContent = '复制失败';
        setTimeout(() => { copyBtn.textContent = '复制完整 Prompt'; }, 2000);
      });
    });
  }

  // Initial render
  buildPreview();

  // ===== Before/After scoring animation =====
  const scoreBars = document.querySelectorAll('.score-bar-fill[data-score]');
  if (scoreBars.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.score + '%';
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    scoreBars.forEach(b => observer.observe(b));
  }

})();
