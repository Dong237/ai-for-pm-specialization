/* Unit 1 — Setup Checklist Interactive Widget */
(() => {
  'use strict';

  const checklist = document.getElementById('setup-checklist');
  if (!checklist) return;

  const steps = checklist.querySelectorAll('.setup-step');
  const progressFill = document.getElementById('setup-progress-fill');
  const progressLabel = document.getElementById('setup-progress-label');
  const totalSteps = steps.length;

  function updateProgress() {
    const done = checklist.querySelectorAll('.setup-step.done').length;
    const pct = Math.round((done / totalSteps) * 100);
    progressFill.style.width = pct + '%';
    progressLabel.textContent = done + ' / ' + totalSteps + ' 完成 (' + pct + '%)';

    if (done === totalSteps) {
      progressLabel.textContent = '全部完成! 你的 Python 环境已就绪!';
      progressLabel.style.color = 'var(--green)';
      progressLabel.style.fontWeight = '600';
    }
  }

  steps.forEach(step => {
    const header = step.querySelector('.setup-step-header');
    const check = step.querySelector('.setup-step-check');

    // Toggle expand/collapse
    header.addEventListener('click', (e) => {
      // If clicking the check circle, toggle done state
      if (e.target === check || check.contains(e.target)) {
        e.stopPropagation();
        step.classList.toggle('done');
        check.textContent = step.classList.contains('done') ? '\u2713' : '';
        updateProgress();
        return;
      }
      // Otherwise toggle body
      step.classList.toggle('open');
    });

    // Double-click to mark done
    check.addEventListener('click', (e) => {
      e.stopPropagation();
      step.classList.toggle('done');
      check.textContent = step.classList.contains('done') ? '\u2713' : '';
      updateProgress();
    });
  });

  updateProgress();
})();
