/* ============================================
   Unit 1 · AI 公司 3 层堆栈 — Stack Explorer widget
   ============================================ */

(() => {
  'use strict';

  // ---------------------------------
  // Stack Explorer — click to expand/collapse layers
  // ---------------------------------
  const layers = document.querySelectorAll('.stack-layer');

  layers.forEach(layer => {
    const header = layer.querySelector('.stack-header');
    const toggle = layer.querySelector('.stack-toggle');

    header.addEventListener('click', () => {
      const isExpanded = layer.classList.contains('expanded');

      // Collapse all first
      layers.forEach(l => {
        l.classList.remove('expanded');
        const t = l.querySelector('.stack-toggle');
        if (t) t.textContent = '点击展开 ▾';
      });

      // If it wasn't expanded, expand it
      if (!isExpanded) {
        layer.classList.add('expanded');
        if (toggle) toggle.textContent = '收起 ▴';
      }
    });
  });

  // Auto-expand the application layer on load
  const appLayer = document.getElementById('layer-app');
  if (appLayer) {
    setTimeout(() => {
      appLayer.classList.add('expanded');
      const t = appLayer.querySelector('.stack-toggle');
      if (t) t.textContent = '收起 ▴';
    }, 600);
  }

})();
