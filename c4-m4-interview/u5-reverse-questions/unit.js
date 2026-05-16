/* U5: 反向提问 — Question Bank Builder Widget */
(() => {
  'use strict';

  const bankEl = document.getElementById('qbank');
  if (!bankEl) return;

  const STORAGE_KEY = 'u5-qbank';

  const categories = [
    {
      key: 'business', name: '业务类', icon: '📊',
      defaults: [
        { text: '你们 AI 产品目前最大的技术挑战是什么? 团队在怎么解决?', note: '了解技术难度和团队能力' },
        { text: '这个 AI 功能的核心商业指标是什么? 目前达成情况如何?', note: '了解产品阶段和成功标准' }
      ]
    },
    {
      key: 'team', name: '团队类', icon: '👥',
      defaults: [
        { text: 'AI PM 在你们团队跟 ML Engineer 的协作方式是怎样的? 日常沟通机制?', note: '了解团队文化和工作方式' },
        { text: '团队目前有多少人? AI PM 的汇报线是什么样的?', note: '了解组织架构和发展空间' }
      ]
    },
    {
      key: 'product', name: '产品类', icon: '🚀',
      defaults: [
        { text: '这个 AI 产品接下来 6 个月最重要的里程碑是什么?', note: '了解产品方向是否跟你的预期匹配' },
        { text: '你们怎么评测 AI 功能的效果? 有没有建好的 eval pipeline?', note: '了解技术成熟度' }
      ]
    },
    {
      key: 'growth', name: '发展类', icon: '📈',
      defaults: [
        { text: '你们对新入职的 AI PM 前 90 天的期望是什么?', note: '了解考核标准, 为 U8 做准备' },
        { text: '团队里做得最好的 AI PM 有什么共同特质?', note: '了解成功画像, 面试后模仿' }
      ]
    }
  ];

  // State
  let state = {};
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) state = saved;
  } catch (e) { /* ignore */ }

  function getQuestions(catKey) {
    if (!state[catKey]) {
      const cat = categories.find(c => c.key === catKey);
      state[catKey] = cat.defaults.map(d => ({ text: d.text, note: d.note, rating: 0, isDefault: true }));
    }
    return state[catKey];
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  let activeTab = 'business';

  function render() {
    const tabsEl = bankEl.querySelector('.qbank-tabs');
    const contentEl = bankEl.querySelector('.qbank-content');
    const badgeEl = document.getElementById('qbank-badge');

    // Tabs
    tabsEl.innerHTML = '';
    categories.forEach(cat => {
      const tab = document.createElement('button');
      tab.className = 'qbank-tab' + (activeTab === cat.key ? ' active' : '');
      tab.textContent = cat.icon + ' ' + cat.name;
      tab.addEventListener('click', () => {
        activeTab = cat.key;
        render();
      });
      tabsEl.appendChild(tab);
    });

    // Content
    const questions = getQuestions(activeTab);
    contentEl.innerHTML = '';

    questions.forEach((q, qi) => {
      const item = document.createElement('div');
      item.className = 'qbank-item';

      const starsHTML = [1, 2, 3, 4, 5].map(s =>
        `<button class="${s <= q.rating ? 'filled' : ''}" data-qi="${qi}" data-star="${s}">★</button>`
      ).join('');

      item.innerHTML = `
        <div class="qbank-item-text">
          <strong>${q.text}</strong>
          ${q.note ? `<div class="qbank-item-note">${q.note}</div>` : ''}
        </div>
        <div class="qbank-stars">${starsHTML}</div>
      `;

      item.querySelectorAll('.qbank-stars button').forEach(btn => {
        btn.addEventListener('click', () => {
          questions[qi].rating = parseInt(btn.dataset.star);
          save();
          render();
        });
      });

      contentEl.appendChild(item);
    });

    // Add input
    const addDiv = document.createElement('div');
    addDiv.className = 'qbank-add';
    addDiv.innerHTML = `
      <input type="text" placeholder="添加你自己的问题..." id="qbank-new-input" />
      <button class="btn btn-primary" id="qbank-add-btn">添加</button>
    `;
    contentEl.appendChild(addDiv);

    const addBtn = addDiv.querySelector('#qbank-add-btn');
    const addInput = addDiv.querySelector('#qbank-new-input');
    addBtn.addEventListener('click', () => {
      const text = addInput.value.trim();
      if (!text) return;
      questions.push({ text, note: '', rating: 0, isDefault: false });
      save();
      render();
    });
    addInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addBtn.click();
    });

    // Badge: check if all categories have >= 2 questions
    if (badgeEl) {
      let allReady = true;
      categories.forEach(cat => {
        const qs = getQuestions(cat.key);
        if (qs.length < 2) allReady = false;
      });
      badgeEl.className = 'qbank-badge ' + (allReady ? 'ready' : 'not-ready');
      badgeEl.textContent = allReady ? '✓ Interview Ready — 每类都有 2+ 问题' : '继续添加... 每类至少需要 2 个问题';
    }
  }

  render();
})();
