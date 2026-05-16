/* ===========================================
   Unit 8 · Knowledge Cutoff — Knowledge Timeline
   ===========================================
   Interactive horizontal timeline showing model
   cutoff dates and which questions fall before/after.
   RAG and Web Search toggles show how post-cutoff
   questions can be recovered.
*/

(() => {
  'use strict';

  // ---- Model data ----
  const MODELS = [
    { id: 'gpt4',     name: 'GPT-4o',           cutoff: '2024-04', cutoffLabel: 'Apr 2024', cutoffYear: 2024.25 },
    { id: 'claude35',  name: 'Claude 3.5 Sonnet', cutoff: '2025-04', cutoffLabel: 'Apr 2025', cutoffYear: 2025.25 },
    { id: 'deepseek', name: 'DeepSeek V3',       cutoff: '2025-03', cutoffLabel: 'Mar 2025', cutoffYear: 2025.17 },
  ];

  // ---- Question cards ----
  // year: when the event happened (approximate decimal)
  // patchable: 'rag' | 'web' | 'both' — which solution can answer it
  const QUESTIONS = [
    { year: 2020.25, text: 'COVID 疫苗研发',         patchable: 'both' },
    { year: 2022.92, text: 'ChatGPT 发布',            patchable: 'both' },
    { year: 2023.25, text: 'GPT-4 发布',              patchable: 'both' },
    { year: 2024.50, text: '2024 诺贝尔奖得主',       patchable: 'both' },
    { year: 2025.08, text: 'DeepSeek R1 发布',        patchable: 'both' },
    { year: 2025.50, text: '2025 新版医疗指南',       patchable: 'rag'  },
    { year: 2025.83, text: 'Claude 4 发布',           patchable: 'web'  },
    { year: 2026.17, text: '2026 奥斯卡最佳影片',     patchable: 'web'  },
  ];

  const YEAR_MIN = 2020;
  const YEAR_MAX = 2026.5;
  const YEAR_RANGE = YEAR_MAX - YEAR_MIN;

  // ---- DOM elements ----
  const modelSelect = document.getElementById('model-select');
  const ragBtn = document.getElementById('patch-rag');
  const webBtn = document.getElementById('patch-web');
  const trackEl = document.getElementById('timeline-track');
  const questionsEl = document.getElementById('timeline-questions');
  const legendEl = document.getElementById('timeline-legend');

  if (!modelSelect || !trackEl) return;

  // ---- State ----
  let currentModel = MODELS[0];
  let ragOn = false;
  let webOn = false;

  // ---- Build timeline track ----
  function buildTrack() {
    trackEl.innerHTML = '';

    // Base line
    const line = document.createElement('div');
    line.className = 'timeline-line';
    trackEl.appendChild(line);

    // Year markers (2020, 2021, ..., 2026)
    for (let y = 2020; y <= 2026; y++) {
      const pct = ((y - YEAR_MIN) / YEAR_RANGE) * 100;
      const tick = document.createElement('div');
      tick.className = 'timeline-year';
      tick.style.left = pct + '%';
      tick.textContent = y;
      trackEl.appendChild(tick);
    }

    // Cutoff markers for all models
    MODELS.forEach(m => {
      const pct = ((m.cutoffYear - YEAR_MIN) / YEAR_RANGE) * 100;

      const label = document.createElement('div');
      label.className = 'timeline-cutoff-label' + (m.id === currentModel.id ? ' active' : ' inactive');
      label.style.left = pct + '%';
      label.textContent = m.name + ' (' + m.cutoffLabel + ')';
      label.dataset.modelId = m.id;
      trackEl.appendChild(label);

      const marker = document.createElement('div');
      marker.className = 'timeline-cutoff-marker' + (m.id === currentModel.id ? ' active' : '');
      marker.style.left = pct + '%';
      marker.dataset.modelId = m.id;
      trackEl.appendChild(marker);
    });

    // Cutoff zone (red shaded area after cutoff)
    const zone = document.createElement('div');
    zone.className = 'timeline-cutoff-zone';
    zone.id = 'cutoff-zone';
    const zonePct = ((currentModel.cutoffYear - YEAR_MIN) / YEAR_RANGE) * 100;
    zone.style.left = zonePct + '%';
    trackEl.appendChild(zone);
  }

  // ---- Build question cards ----
  function buildQuestions() {
    questionsEl.innerHTML = '';

    QUESTIONS.forEach(q => {
      const card = document.createElement('div');
      card.className = 'q-card';
      card.dataset.year = q.year;
      card.dataset.patchable = q.patchable;

      const yearDiv = document.createElement('div');
      yearDiv.className = 'q-year';
      yearDiv.textContent = Math.floor(q.year);

      const textDiv = document.createElement('div');
      textDiv.className = 'q-text';
      textDiv.textContent = q.text;

      const badge = document.createElement('div');
      badge.className = 'q-badge';

      card.appendChild(yearDiv);
      card.appendChild(textDiv);
      card.appendChild(badge);
      questionsEl.appendChild(card);
    });
  }

  // ---- Update all states ----
  function update() {
    const cutoff = currentModel.cutoffYear;

    // Update cutoff zone
    const zone = document.getElementById('cutoff-zone');
    if (zone) {
      const zonePct = ((cutoff - YEAR_MIN) / YEAR_RANGE) * 100;
      zone.style.left = zonePct + '%';
    }

    // Update markers
    trackEl.querySelectorAll('.timeline-cutoff-marker').forEach(m => {
      m.classList.toggle('active', m.dataset.modelId === currentModel.id);
    });
    trackEl.querySelectorAll('.timeline-cutoff-label').forEach(l => {
      const isActive = l.dataset.modelId === currentModel.id;
      l.classList.toggle('active', isActive);
      l.classList.toggle('inactive', !isActive);
    });

    // Update question cards
    const cards = questionsEl.querySelectorAll('.q-card');
    cards.forEach(card => {
      const qYear = parseFloat(card.dataset.year);
      const patchable = card.dataset.patchable;
      const badge = card.querySelector('.q-badge');

      if (qYear <= cutoff) {
        // Before cutoff — model knows this
        card.className = 'q-card known';
        badge.textContent = '✓ 模型知道';
      } else {
        // After cutoff — check patches
        const canRAG = ragOn && (patchable === 'rag' || patchable === 'both');
        const canWeb = webOn && (patchable === 'web' || patchable === 'both');

        if (canRAG || canWeb) {
          card.className = 'q-card patched';
          const methods = [];
          if (canRAG) methods.push('RAG');
          if (canWeb) methods.push('Web');
          badge.textContent = '✓ ' + methods.join('+') + ' 补救';
        } else {
          card.className = 'q-card unknown';
          badge.textContent = '✗ 模型不知道';
        }
      }
    });

    // Update button states
    ragBtn.classList.toggle('active', ragOn);
    webBtn.classList.toggle('active', webOn);

    // Update legend
    updateLegend();
  }

  function updateLegend() {
    const cutoff = currentModel.cutoffYear;
    const totalQ = QUESTIONS.length;
    const knownCount = QUESTIONS.filter(q => q.year <= cutoff).length;
    const unknownCards = questionsEl.querySelectorAll('.q-card.unknown');
    const patchedCards = questionsEl.querySelectorAll('.q-card.patched');

    legendEl.innerHTML =
      '<span><span class="legend-dot green"></span> 模型知道: ' + knownCount + '</span>' +
      '<span><span class="legend-dot red"></span> 模型不知道: ' + unknownCards.length + '</span>' +
      (patchedCards.length > 0
        ? '<span><span class="legend-dot green-dashed"></span> 补救成功: ' + patchedCards.length + '</span>'
        : ''
      ) +
      '<span style="margin-left:auto;font-style:italic;">截止日: ' + currentModel.cutoffLabel + '</span>';
  }

  // ---- Event listeners ----
  modelSelect.addEventListener('change', () => {
    currentModel = MODELS.find(m => m.id === modelSelect.value) || MODELS[0];
    buildTrack();
    update();
  });

  ragBtn.addEventListener('click', () => {
    ragOn = !ragOn;
    update();
  });

  webBtn.addEventListener('click', () => {
    webOn = !webOn;
    update();
  });

  // ---- Init ----
  buildTrack();
  buildQuestions();
  update();

})();
