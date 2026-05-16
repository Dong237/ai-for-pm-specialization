/* ============================================
   Unit 3 · 国内主流模型 — China Model Cards Widget
   ============================================ */

(() => {
  'use strict';

  // ---------------------------------
  // Card expand/collapse
  // ---------------------------------
  const cards = document.querySelectorAll('.ccw-card');

  cards.forEach(card => {
    const header = card.querySelector('.ccw-card-header');
    const toggle = card.querySelector('.ccw-card-toggle');

    header.addEventListener('click', () => {
      const wasExpanded = card.classList.contains('expanded');

      // Toggle this card
      if (wasExpanded) {
        card.classList.remove('expanded');
        if (toggle) toggle.textContent = '展开 ▾';
      } else {
        card.classList.add('expanded');
        if (toggle) toggle.textContent = '收起 ▴';
      }
    });
  });

  // ---------------------------------
  // Mode toggle: cards vs table
  // ---------------------------------
  const modeButtons = document.querySelectorAll('.ccw-mode');
  const cardsView = document.getElementById('ccw-cards-view');
  const tableView = document.getElementById('ccw-table-view');

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;

      modeButtons.forEach(b => {
        b.classList.remove('active');
        b.classList.add('btn-ghost');
        b.classList.remove('btn-primary');
      });
      btn.classList.add('active');
      btn.classList.remove('btn-ghost');
      btn.classList.add('btn-primary');

      if (mode === 'cards') {
        cardsView.style.display = '';
        tableView.style.display = 'none';
      } else {
        cardsView.style.display = 'none';
        tableView.style.display = '';
      }
    });
  });

  // Auto-expand first card after a delay
  setTimeout(() => {
    const firstCard = cards[0];
    if (firstCard && !firstCard.classList.contains('expanded')) {
      firstCard.classList.add('expanded');
      const t = firstCard.querySelector('.ccw-card-toggle');
      if (t) t.textContent = '收起 ▴';
    }
  }, 800);

})();
