/* U1 — Traditional vs AI PRD · Interactive PRD Comparison Widget */
(() => {
  'use strict';

  // ---- PRD Comparison Tabs ----
  const tabs = document.querySelectorAll('.prd-tab');
  const panels = document.querySelectorAll('.prd-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
    });
  });

  // ---- Diff mode toggle ----
  const diffBtn = document.getElementById('diff-toggle');
  const compareWidget = document.getElementById('prd-compare');
  if (diffBtn && compareWidget) {
    diffBtn.addEventListener('click', () => {
      const isDiff = compareWidget.classList.toggle('diff-mode');
      diffBtn.textContent = isDiff ? '切回标签页模式' : '并排对比模式';
      if (isDiff) {
        panels.forEach(p => p.classList.add('active'));
      } else {
        // Restore tab mode
        const activeTab = document.querySelector('.prd-tab.active');
        const target = activeTab ? activeTab.dataset.tab : 'traditional';
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
      }
    });
  }

  // ---- Animate sections on scroll ----
  const sections = document.querySelectorAll('.prd-section');
  if (sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateX(0)';
          sectionObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(s => {
      s.style.opacity = '0';
      s.style.transform = 'translateX(-12px)';
      s.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      sectionObserver.observe(s);
    });
  }

  // ---- Highlight new sections pulse ----
  const newSections = document.querySelectorAll('.prd-section.ai-new');
  newSections.forEach((s, i) => {
    s.style.animationDelay = (i * 0.15) + 's';
  });

})();
