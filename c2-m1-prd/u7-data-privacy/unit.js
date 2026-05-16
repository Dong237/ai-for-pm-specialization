/* U7 — Data Privacy Checklist Widget */
(() => {
  'use strict';

  const checkboxes = document.querySelectorAll('.pc-item input[type="checkbox"]');
  const progressFill = document.getElementById('pc-fill');
  const progressText = document.getElementById('pc-text');
  const total = checkboxes.length;

  if (!total) return;

  function updateProgress() {
    let checked = 0;
    checkboxes.forEach(cb => {
      const item = cb.closest('.pc-item');
      if (cb.checked) {
        checked++;
        item.classList.add('checked');
      } else {
        item.classList.remove('checked');
      }
    });

    const pct = Math.round((checked / total) * 100);
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressText) {
      if (pct === 100) {
        progressText.textContent = '全部完成! 数据隐私合规就绪.';
        progressText.style.color = 'var(--green)';
      } else {
        progressText.textContent = checked + '/' + total + ' 项已确认 (' + pct + '%)';
        progressText.style.color = 'var(--ink-soft)';
      }
    }
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateProgress));
  updateProgress();
})();
