/* ===========================================
   Unit 8 · Vitamin 成本优化路径 — Optimization Waterfall
   =========================================== */
(() => {
  'use strict';

  const bars = [
    { id: 'wf-baseline', target: 240, val: '¥5,000' },
    { id: 'wf-output', target: 192, val: '¥4,000' },
    { id: 'wf-cache', target: 120, val: '¥2,500' },
    { id: 'wf-route', target: 60, val: '¥1,200' },
    { id: 'wf-final', target: 36, val: '¥750' },
  ];

  const animateBtn = document.getElementById('wf-animate');
  let animated = false;

  function animateWaterfall() {
    bars.forEach((b, i) => {
      const el = document.getElementById(b.id);
      if (!el) return;
      setTimeout(() => {
        el.style.height = b.target + 'px';
      }, i * 400);
    });
    animated = true;
  }

  // Auto-animate on scroll into view
  const wfChart = document.querySelector('.wf-chart');
  if (wfChart) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !animated) {
          setTimeout(animateWaterfall, 300);
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(wfChart);
  }

  if (animateBtn) {
    animateBtn.addEventListener('click', () => {
      // Reset then animate
      bars.forEach(b => {
        const el = document.getElementById(b.id);
        if (el) el.style.height = '0px';
      });
      animated = false;
      setTimeout(animateWaterfall, 200);
    });
  }
})();
