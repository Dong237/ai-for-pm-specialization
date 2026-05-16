/* U1: 7大高频技术追问 — Interview Card Deck Widget */
(() => {
  'use strict';

  const deckEl = document.getElementById('card-deck');
  if (!deckEl) return;

  const questions = [
    {
      id: 1,
      q: 'RAG 和 Fine-tune 怎么选?',
      answer: '先问 3 个问题: (1) 数据是否频繁更新? 更新快 → RAG. (2) 需要统一风格/格式? → Fine-tune. (3) 预算有限? → 先从 Prompt Engineering 开始, 逐步升级. 最佳实践: Fine-tune 管风格, RAG 管事实.',
      phrases: ['数据更新频率', 'Prompt → RAG → Fine-tune', '风格 vs 事实']
    },
    {
      id: 2,
      q: 'Token 成本怎么控?',
      answer: '4 个杠杆: (1) Prompt 压缩 — 去掉冗余指令, 用 few-shot 代替长描述. (2) 模型选型 — 简单任务用小模型 (GPT-4o-mini), 复杂任务才用大模型. (3) 缓存 — 相同 prompt 前缀用 Prompt Caching. (4) 输出限制 — max_tokens 控制生成长度.',
      phrases: ['Prompt 压缩', '模型分级', 'Prompt Caching', 'max_tokens']
    },
    {
      id: 3,
      q: '幻觉 (Hallucination) 怎么处理?',
      answer: '三层防线: (1) Grounding — 用 RAG 给模型喂真实数据, 减少编造. (2) 检测 — 让模型输出 confidence score, 低于阈值走人工审核. (3) 产品兜底 — UI 显示 "AI 生成, 仅供参考", 关键决策强制人工确认.',
      phrases: ['Grounding', 'Confidence Score', '人工兜底', 'RAG 减幻觉']
    },
    {
      id: 4,
      q: 'Prompt Engineering 和写代码有什么区别?',
      answer: 'Prompt 是产品规格说明 (spec), 不是代码. 区别: (1) Prompt 的输出是概率性的, 代码是确定性的. (2) Prompt 需要 A/B 测试和评测集来验证效果. (3) Prompt 需要版本管理, 每次修改都可能影响全局输出质量.',
      phrases: ['概率性 vs 确定性', 'A/B 测试', '版本管理', 'Eval Set']
    },
    {
      id: 5,
      q: '怎么评测模型好不好?',
      answer: '3 步走: (1) 建评测集 — 50-200 条 golden truth QA pairs. (2) 选指标 — 分任务: 分类用 F1/Accuracy, 生成用 BLEU/ROUGE/人工评分, RAG 用 RAGAS. (3) 持续监控 — 上线后每周跑 regression test, 模型更新时全量回归.',
      phrases: ['Golden Truth', 'F1 / ROUGE', 'RAGAS', 'Regression Test']
    },
    {
      id: 6,
      q: '用户等太久 (延迟) 怎么办?',
      answer: '4 个思路: (1) Streaming — 逐字输出, 感知延迟降 50%. (2) 小模型兜底 — 简单请求走 GPT-4o-mini (延迟 <1s). (3) 异步架构 — 非实时任务放后台, 完成后推送通知. (4) 预生成 — 高频场景提前生成, 缓存结果.',
      phrases: ['Streaming', '模型路由', '异步处理', '预生成缓存']
    },
    {
      id: 7,
      q: '数据安全怎么保障?',
      answer: '4 层: (1) 数据脱敏 — PII (姓名/手机/身份证) 在送入模型前脱敏. (2) 部署选型 — 敏感场景用私有部署, 非敏感用 API. (3) 合规 — 遵守 GDPR / 中国《个人信息保护法》, 用户数据不进训练集. (4) 审计 — 所有 API 调用留日志, 可追溯.',
      phrases: ['PII 脱敏', '私有部署', 'GDPR / PIPL', '审计日志']
    }
  ];

  // State
  const state = {
    flipped: new Set(),
    ratings: {},  // cardId -> rating (1-5)
  };

  // Load from localStorage
  const STORAGE_KEY = 'u1-deck-state';
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      if (saved.flipped) saved.flipped.forEach(id => state.flipped.add(id));
      if (saved.ratings) Object.assign(state.ratings, saved.ratings);
    }
  } catch (e) { /* ignore */ }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      flipped: [...state.flipped],
      ratings: state.ratings
    }));
  }

  function getMasteredCount() {
    return Object.values(state.ratings).filter(r => r >= 4).length;
  }

  function updateProgress() {
    const progressFill = document.getElementById('deck-progress-fill');
    const progressText = document.getElementById('deck-progress-text');
    if (!progressFill || !progressText) return;

    const mastered = getMasteredCount();
    const pct = (mastered / questions.length) * 100;
    progressFill.style.width = pct + '%';
    progressText.textContent = mastered + ' / ' + questions.length + ' 已掌握 (4星+)';
  }

  function renderDeck() {
    deckEl.innerHTML = '';

    questions.forEach(q => {
      const card = document.createElement('div');
      card.className = 'flip-card' + (state.flipped.has(q.id) ? ' flipped' : '');

      const rating = state.ratings[q.id] || 0;
      const starsHTML = [1, 2, 3, 4, 5].map(s =>
        `<button class="star-btn${s <= rating ? ' filled' : ''}" data-card="${q.id}" data-star="${s}" aria-label="${s}星">★</button>`
      ).join('');

      const phrasesHTML = q.phrases.map(p =>
        `<span class="key-phrase">${p}</span>`
      ).join('');

      card.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="card-q-num">Q${q.id}</div>
            <div class="card-q-text">${q.q}</div>
            <div class="card-hint">点击翻转 →</div>
          </div>
          <div class="flip-card-back">
            <div class="card-a-title">参考答案</div>
            <div class="card-a-text">${q.answer}</div>
            <div class="card-key-phrases">${phrasesHTML}</div>
            <div class="star-rating">${starsHTML}</div>
          </div>
        </div>
      `;

      // Flip on click (front only)
      card.querySelector('.flip-card-front').addEventListener('click', () => {
        card.classList.add('flipped');
        state.flipped.add(q.id);
        save();
        updateProgress();
      });

      // Star rating clicks
      card.querySelectorAll('.star-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const starVal = parseInt(btn.dataset.star);
          state.ratings[q.id] = starVal;
          save();
          renderDeck();
          updateProgress();
        });
      });

      deckEl.appendChild(card);
    });
  }

  // Reset button
  const resetBtn = document.getElementById('deck-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.flipped.clear();
      state.ratings = {};
      save();
      renderDeck();
      updateProgress();
    });
  }

  renderDeck();
  updateProgress();
})();
