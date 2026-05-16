/* U8 · Debug Flowchart — 4-step interactive debugger */
(() => {
  'use strict';
  const stepBtns = document.querySelectorAll('.debug-step-btn');
  const panels = document.querySelectorAll('.debug-panel');
  const actionBtns = document.querySelectorAll('.debug-action-btn');
  if (!stepBtns.length) return;

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stepBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const step = btn.dataset.step;
      const panel = document.getElementById('debug-panel-' + step);
      if (panel) panel.classList.add('active');
    });
  });

  actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const resultId = btn.dataset.result;
      const result = document.getElementById(resultId);
      if (result) {
        result.classList.add('show');
        btn.textContent = '已执行 ✓';
        btn.disabled = true;
        btn.style.opacity = '0.6';
        // Mark step as done
        const panel = btn.closest('.debug-panel');
        if (panel) {
          const stepNum = panel.id.replace('debug-panel-', '');
          const stepBtn = document.querySelector(`.debug-step-btn[data-step="${stepNum}"]`);
          if (stepBtn) stepBtn.classList.add('done');
        }
      }
    });
  });
})();
