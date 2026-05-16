/* U2 Jailbreak Gallery — click to expand */
(() => {
  'use strict';

  const cards = document.querySelectorAll('.jb-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const wasExpanded = card.classList.contains('expanded');
      // Close all
      cards.forEach(c => c.classList.remove('expanded'));
      // Toggle clicked
      if (!wasExpanded) {
        card.classList.add('expanded');
      }
    });
  });
})();
