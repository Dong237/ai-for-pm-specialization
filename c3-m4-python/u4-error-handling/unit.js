/* Unit 4 — Error Simulator Widget */
(() => {
  'use strict';

  const sim = document.getElementById('error-sim');
  if (!sim) return;

  const tabs = sim.querySelectorAll('.error-tab');
  const displays = sim.querySelectorAll('.error-display');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.error;

      // Update active states
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      displays.forEach(d => {
        d.classList.toggle('active', d.dataset.error === target);
      });
    });
  });

  // Activate first tab
  if (tabs.length > 0) {
    tabs[0].classList.add('active');
    displays[0].classList.add('active');
  }
})();
