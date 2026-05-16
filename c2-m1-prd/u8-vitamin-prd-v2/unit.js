/* U8 — PRD Template Filler Widget */
(() => {
  'use strict';

  // Toggle sections
  document.querySelectorAll('.pt-section-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.parentElement;
      section.classList.toggle('open');
    });
  });

  // Preview
  const previewBtn = document.getElementById('preview-btn');
  const previewEl = document.getElementById('pt-preview');
  const copyBtn = document.getElementById('copy-btn');

  if (previewBtn && previewEl) {
    previewBtn.addEventListener('click', () => {
      const sections = document.querySelectorAll('.pt-section');
      let text = '# Vitamin AI PRD v2 — 每日健康总结\n\n';

      sections.forEach(s => {
        const title = s.querySelector('.pt-section-header').textContent.replace(/[▶▼]/g, '').trim();
        const textarea = s.querySelector('textarea');
        const content = textarea ? textarea.value.trim() : '';
        text += '## ' + title + '\n';
        text += (content || '(未填写)') + '\n\n';
      });

      previewEl.textContent = text;
      previewEl.classList.toggle('visible');
      previewBtn.textContent = previewEl.classList.contains('visible') ? '收起预览' : '预览完整 PRD';
    });
  }

  if (copyBtn && previewEl) {
    copyBtn.addEventListener('click', () => {
      const text = previewEl.textContent;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '已复制!';
        setTimeout(() => { copyBtn.textContent = '复制到剪贴板'; }, 2000);
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyBtn.textContent = '已复制!';
        setTimeout(() => { copyBtn.textContent = '复制到剪贴板'; }, 2000);
      });
    });
  }

})();
