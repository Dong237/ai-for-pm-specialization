/* Unit 6 · Citation Viewer — clickable source references */
(() => {
  'use strict';

  const answerEl = document.getElementById('cite-answer');
  if (!answerEl) return;

  const sources = document.querySelectorAll('.cite-source');
  const refs = document.querySelectorAll('.cite-ref');

  // Click citation reference to highlight source
  refs.forEach(ref => {
    ref.addEventListener('click', (e) => {
      e.preventDefault();
      const num = ref.dataset.cite;

      // Toggle active state
      const wasActive = ref.classList.contains('active');
      refs.forEach(r => r.classList.remove('active'));
      sources.forEach(s => s.classList.remove('highlighted'));

      if (!wasActive) {
        ref.classList.add('active');
        // Highlight corresponding source
        sources.forEach(s => {
          if (s.dataset.source === num) {
            s.classList.add('highlighted');
            s.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      }
    });
  });

  // Click source to highlight corresponding refs
  sources.forEach(source => {
    source.addEventListener('click', () => {
      const num = source.dataset.source;
      const wasHighlighted = source.classList.contains('highlighted');

      sources.forEach(s => s.classList.remove('highlighted'));
      refs.forEach(r => r.classList.remove('active'));

      if (!wasHighlighted) {
        source.classList.add('highlighted');
        refs.forEach(r => {
          if (r.dataset.cite === num) r.classList.add('active');
        });
      }
    });
  });
})();
