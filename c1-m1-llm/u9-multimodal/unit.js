/* ===========================================
   Unit 9 · Multimodal — Modality Unlock Grid
   ===========================================
   Interactive 2x2 grid: Text / Image / Audio / Video.
   Click to unlock each modality and reveal capabilities.
   When all 4 are unlocked, show the Vitamin summary panel.
*/

(() => {
  'use strict';

  // ----- Data -----
  const MODALITIES = [
    {
      id: 'text',
      icon: '\u{1F4DD}',
      label: '\u6587\u672C (Text)',
      capabilities: [
        '\u7406\u89E3 + \u751F\u6210\u81EA\u7136\u8BED\u8A00',
        '\u7FFB\u8BD1\u3001\u6458\u8981\u3001\u6539\u5199',
        '\u4EE3\u7801\u751F\u6210\u3001\u903B\u8F91\u63A8\u7406',
        'RAG \u68C0\u7D22\u589E\u5F3A\u751F\u6210'
      ],
      vitamin: 'Vitamin: \u7528\u6237\u8F93\u5165\u201C\u4ECA\u5929\u5934\u75DB\u201D \u2192 AI \u7ED9\u51FA\u5065\u5EB7\u5EFA\u8BAE'
    },
    {
      id: 'image',
      icon: '\u{1F5BC}\uFE0F',
      label: '\u56FE\u50CF (Image)',
      capabilities: [
        '\u56FE\u50CF\u7406\u89E3: \u7167\u7247 \u2192 \u63CF\u8FF0 (GPT-4V, Claude Vision)',
        'OCR: \u56FE\u7247\u4E2D\u7684\u6587\u5B57 \u2192 \u7ED3\u6784\u5316\u6570\u636E',
        '\u56FE\u50CF\u751F\u6210: \u6587\u5B57 \u2192 \u56FE\u7247 (DALL-E, Midjourney)',
        '\u56FE\u50CF\u7F16\u8F91: \u6307\u5B9A\u533A\u57DF\u4FEE\u6539 (inpainting)'
      ],
      vitamin: 'Vitamin: \u62CD\u7167\u8BC6\u522B\u98DF\u7269 \u2192 \u81EA\u52A8\u8BA1\u7B97\u5361\u8DEF\u91CC\u548C\u8425\u517B\u7D20'
    },
    {
      id: 'audio',
      icon: '\u{1F3A4}',
      label: '\u8BED\u97F3 (Audio)',
      capabilities: [
        'STT: \u8BED\u97F3 \u2192 \u6587\u5B57 (Whisper)',
        'TTS: \u6587\u5B57 \u2192 \u8BED\u97F3 (ElevenLabs, OpenAI TTS)',
        '\u8BED\u97F3\u514B\u9686: \u6A21\u4EFF\u7279\u5B9A\u4EBA\u7684\u58F0\u97F3',
        '\u97F3\u4E50\u751F\u6210: \u6587\u5B57 \u2192 \u97F3\u4E50 (Suno, Udio)'
      ],
      vitamin: 'Vitamin: \u8BED\u97F3\u65E5\u8BB0 \u2014 \u7528\u6237\u53E3\u8FF0\u4ECA\u5929\u72B6\u6001, AI \u81EA\u52A8\u8BB0\u5F55'
    },
    {
      id: 'video',
      icon: '\u{1F3AC}',
      label: '\u89C6\u9891 (Video)',
      capabilities: [
        '\u89C6\u9891\u7406\u89E3: \u89C6\u9891 \u2192 \u63CF\u8FF0/\u5206\u6790',
        '\u89C6\u9891\u751F\u6210: \u6587\u5B57 \u2192 \u89C6\u9891 (Sora, Runway)',
        '\u89C6\u9891\u7F16\u8F91: AI \u81EA\u52A8\u526A\u8F91/\u7279\u6548',
        '\u5B9E\u65F6\u89C6\u9891\u5206\u6790: \u76F4\u64AD\u6D41\u5185\u5BB9\u7406\u89E3'
      ],
      vitamin: 'Vitamin: \u7626\u8EAB\u52A8\u4F5C\u6559\u5B66\u89C6\u9891, AI \u6839\u636E\u7528\u6237\u4F53\u6001\u751F\u6210'
    }
  ];

  // ----- DOM references -----
  const grid = document.getElementById('modality-grid');
  const summaryPanel = document.getElementById('modality-summary');
  const counterEl = document.getElementById('modality-counter');

  if (!grid) return;

  // ----- State -----
  let unlockedSet = new Set();

  // ----- Build cells -----
  MODALITIES.forEach((mod) => {
    const cell = document.createElement('div');
    cell.className = 'modality-cell locked';
    cell.dataset.modality = mod.id;
    cell.setAttribute('role', 'button');
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('aria-label', '\u89E3\u9501 ' + mod.label);

    // Lock overlay
    const lockOverlay = document.createElement('div');
    lockOverlay.className = 'mod-lock-overlay';
    lockOverlay.innerHTML = '<svg class="mod-lock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
    cell.appendChild(lockOverlay);

    // Header
    const header = document.createElement('div');
    header.className = 'mod-header';

    const icon = document.createElement('span');
    icon.className = 'mod-icon';
    icon.textContent = mod.icon;

    const label = document.createElement('span');
    label.className = 'mod-label';
    label.textContent = mod.label;

    const badge = document.createElement('span');
    badge.className = 'mod-badge';
    badge.textContent = '\u{1F512} \u70B9\u51FB\u89E3\u9501';

    header.appendChild(icon);
    header.appendChild(label);
    header.appendChild(badge);
    cell.appendChild(header);

    // Capabilities list
    const capList = document.createElement('ul');
    capList.className = 'mod-capabilities';
    mod.capabilities.forEach((cap) => {
      const li = document.createElement('li');
      li.textContent = cap;
      capList.appendChild(li);
    });
    cell.appendChild(capList);

    // Vitamin example
    const vitBox = document.createElement('div');
    vitBox.className = 'mod-vitamin';
    vitBox.textContent = mod.vitamin;
    cell.appendChild(vitBox);

    // Click handler
    function unlock() {
      if (unlockedSet.has(mod.id)) return;

      unlockedSet.add(mod.id);
      cell.classList.remove('locked');
      cell.classList.add('unlocked');
      badge.textContent = '\u2713 \u5DF2\u89E3\u9501';

      updateCounter();

      if (unlockedSet.size === 4) {
        showSummary();
      }
    }

    cell.addEventListener('click', unlock);
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        unlock();
      }
    });

    grid.appendChild(cell);
  });

  // ----- Counter -----
  function updateCounter() {
    if (!counterEl) return;
    const n = unlockedSet.size;
    if (n === 0) {
      counterEl.innerHTML = '\u70B9\u51FB\u4EFB\u4F55\u4E00\u683C\u5F00\u59CB\u89E3\u9501. \u5DF2\u89E3\u9501: <strong>0 / 4</strong>';
    } else if (n < 4) {
      counterEl.innerHTML = '\u5DF2\u89E3\u9501: <strong>' + n + ' / 4</strong> \u2014 \u7EE7\u7EED\u70B9\u51FB\u89E3\u9501\u5269\u4F59\u6A21\u6001!';
    } else {
      counterEl.innerHTML = '<strong>\u5168\u90E8\u89E3\u9501!</strong> \u2193 \u67E5\u770B Vitamin \u591A\u6A21\u6001\u878D\u5408\u65B9\u6848';
    }
  }

  // ----- Summary panel -----
  function showSummary() {
    if (!summaryPanel) return;
    summaryPanel.classList.add('visible');
  }

  // ----- Init -----
  updateCounter();

})();
