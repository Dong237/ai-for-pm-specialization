/* ============================================
   Unit 2 · 闭源 vs 开源 — Compare Widget
   ============================================ */

(() => {
  'use strict';

  // Model data for the compare widget
  const models = [
    {
      name: 'DeepSeek V4 Flash',
      org: 'DeepSeek',
      type: 'open',
      costInput: 0.14,
      costOutput: 0.28,
      capability: 82,   // 0-100 relative score
      control: 95,       // 0-100 relative score
      license: 'MIT'
    },
    {
      name: 'Mistral Small 4',
      org: 'Mistral',
      type: 'open',
      costInput: 0.15,
      costOutput: 0.60,
      capability: 75,
      control: 95,
      license: 'Apache 2.0'
    },
    {
      name: 'Kimi K2.6',
      org: 'Moonshot',
      type: 'open',
      costInput: 0.60,
      costOutput: 2.50,
      capability: 86,
      control: 90,
      license: 'MIT*'
    },
    {
      name: 'DeepSeek V4 Pro',
      org: 'DeepSeek',
      type: 'open',
      costInput: 0.44,
      costOutput: 0.87,
      capability: 88,
      control: 95,
      license: 'MIT'
    },
    {
      name: 'GLM-5',
      org: '智谱 AI',
      type: 'open',
      costInput: 0.50,
      costOutput: 2.00,
      capability: 83,
      control: 95,
      license: 'MIT'
    },
    {
      name: 'Qwen3.6-27B',
      org: '阿里',
      type: 'open',
      costInput: 0.30,
      costOutput: 1.20,
      capability: 84,
      control: 95,
      license: 'Apache 2.0'
    },
    {
      name: 'Gemini 2.5 Pro',
      org: 'Google',
      type: 'closed',
      costInput: 1.25,
      costOutput: 10.00,
      capability: 90,
      control: 30,
      license: 'Proprietary'
    },
    {
      name: 'Claude Opus 4.7',
      org: 'Anthropic',
      type: 'closed',
      costInput: 5.00,
      costOutput: 25.00,
      capability: 96,
      control: 25,
      license: 'Proprietary'
    },
    {
      name: 'GPT-5.5',
      org: 'OpenAI',
      type: 'closed',
      costInput: 5.00,
      costOutput: 30.00,
      capability: 95,
      control: 25,
      license: 'Proprietary'
    },
    {
      name: 'Doubao-Seed-2.0',
      org: '字节跳动',
      type: 'closed',
      costInput: 0.45,
      costOutput: 2.20,
      capability: 85,
      control: 35,
      license: 'Proprietary'
    }
  ];

  const cardsContainer = document.getElementById('cw-cards');
  const sortButtons = document.querySelectorAll('.cw-sort');

  function sortModels(sortBy) {
    const sorted = [...models];
    switch (sortBy) {
      case 'cost':
        sorted.sort((a, b) => (a.costInput + a.costOutput) - (b.costInput + b.costOutput));
        break;
      case 'capability':
        sorted.sort((a, b) => b.capability - a.capability);
        break;
      case 'control':
        sorted.sort((a, b) => b.control - a.control);
        break;
    }
    return sorted;
  }

  function renderCards(sortBy) {
    const sorted = sortModels(sortBy);
    cardsContainer.innerHTML = '';

    sorted.forEach((m, i) => {
      const card = document.createElement('div');
      card.className = `cw-card ${m.type === 'open' ? 'is-open' : 'is-closed'}`;

      const costTotal = (m.costInput + m.costOutput).toFixed(2);
      const costLabel = sortBy === 'cost'
        ? `$${costTotal}`
        : `$${m.costInput}/${m.costOutput}`;

      card.innerHTML = `
        <div class="cw-rank">${i + 1}</div>
        <div class="cw-name">${m.name}<small>${m.org} · ${m.license}</small></div>
        <div class="cw-cost">${costLabel}</div>
        <div class="cw-cap">${m.capability}/100</div>
        <div class="cw-ctrl">${m.control}/100</div>
      `;

      // Stagger animation
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      cardsContainer.appendChild(card);

      requestAnimationFrame(() => {
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 50);
      });
    });
  }

  // Sort button handlers
  sortButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sortButtons.forEach(b => {
        b.classList.remove('active');
        b.classList.add('btn-ghost');
        b.classList.remove('btn-primary');
      });
      btn.classList.add('active');
      btn.classList.remove('btn-ghost');
      btn.classList.add('btn-primary');

      renderCards(btn.dataset.sort);
    });
  });

  // Initial render
  renderCards('cost');

})();
