/* U7 · Version Timeline — click versions to see diff and metrics */
(() => {
  'use strict';
  const versionBtns = document.querySelectorAll('.tl-version');
  const details = document.querySelectorAll('.tl-detail');
  if (!versionBtns.length) return;
  versionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      versionBtns.forEach(b => b.classList.remove('active'));
      details.forEach(d => d.classList.remove('active'));
      btn.classList.add('active');
      const v = btn.dataset.version;
      const detail = document.getElementById('tl-detail-' + v);
      if (detail) detail.classList.add('active');
    });
  });
})();
