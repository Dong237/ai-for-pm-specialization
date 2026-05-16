/* ===========================================
   Unit 3 · Tokenizer 中英文差异 — Side-by-side
   ===========================================
   Pre-computed comparison data for Chinese vs
   English tokenization across multiple models.
*/

(() => {
  'use strict';

  // Comparison data: 5 sentence pairs with token counts per model
  const PAIRS = [
    {
      id: 'greeting',
      label: '日常问候',
      en: { text: 'How are you doing today?', gpt4: 6, deepseek: 6, qwen: 5 },
      zh: { text: '你今天过得怎么样？', gpt4: 8, deepseek: 5, qwen: 4 }
    },
    {
      id: 'health',
      label: '健康建议',
      en: { text: 'You should drink more water and get enough sleep during your period.', gpt4: 14, deepseek: 14, qwen: 13 },
      zh: { text: '经期期间你应该多喝水，保证充足的睡眠。', gpt4: 18, deepseek: 11, qwen: 10 }
    },
    {
      id: 'product',
      label: 'Vitamin 介绍',
      en: { text: 'Vitamin is an AI-powered women\'s health app that tracks 5 body states.', gpt4: 15, deepseek: 15, qwen: 14 },
      zh: { text: 'Vitamin 是一款 AI 驱动的女性健康应用，追踪 5 种身体状态。', gpt4: 22, deepseek: 14, qwen: 13 }
    },
    {
      id: 'technical',
      label: '技术描述',
      en: { text: 'The large language model generates responses by predicting the next token in a sequence.', gpt4: 15, deepseek: 14, qwen: 14 },
      zh: { text: '大语言模型通过预测序列中的下一个 token 来生成回复。', gpt4: 20, deepseek: 12, qwen: 11 }
    },
    {
      id: 'long',
      label: '长文本',
      en: { text: 'Artificial intelligence has transformed the way we build software products. Product managers need to understand how AI models work, their capabilities and limitations, to make informed decisions about which features to build.', gpt4: 38, deepseek: 37, qwen: 36 },
      zh: { text: '人工智能已经改变了我们构建软件产品的方式。产品经理需要理解 AI 模型的工作原理、能力和局限，才能做出明智的决策，判断该开发哪些功能。', gpt4: 56, deepseek: 34, qwen: 32 }
    }
  ];

  // Currently selected model for comparison
  let currentModel = 'gpt4';

  // Elements
  const btns = document.querySelectorAll('.compare-btn');
  const enText = document.getElementById('compare-en-text');
  const zhText = document.getElementById('compare-zh-text');
  const enBar = document.getElementById('compare-en-bar');
  const zhBar = document.getElementById('compare-zh-bar');
  const enCount = document.getElementById('compare-en-count');
  const zhCount = document.getElementById('compare-zh-count');
  const enBarNum = document.getElementById('compare-en-bar-num');
  const zhBarNum = document.getElementById('compare-zh-bar-num');
  const multiplierNum = document.getElementById('multiplier-num');
  const multiplierLabel = document.getElementById('multiplier-label');

  // Model selector
  const modelBtns = document.querySelectorAll('.model-btn');

  if (!enText || !zhText) return;

  function updateComparison(pairId) {
    const pair = PAIRS.find(p => p.id === pairId);
    if (!pair) return;

    const enTokens = pair.en[currentModel];
    const zhTokens = pair.zh[currentModel];
    const maxTokens = Math.max(enTokens, zhTokens);
    const ratio = (zhTokens / enTokens).toFixed(1);

    enText.textContent = pair.en.text;
    zhText.textContent = pair.zh.text;

    // Animate bars
    const enPct = (enTokens / maxTokens) * 100;
    const zhPct = (zhTokens / maxTokens) * 100;

    requestAnimationFrame(() => {
      enBar.style.width = enPct + '%';
      zhBar.style.width = zhPct + '%';
    });

    enBarNum.textContent = enTokens;
    zhBarNum.textContent = zhTokens;
    enCount.textContent = enTokens;
    zhCount.textContent = zhTokens;

    // Multiplier badge
    if (multiplierNum) {
      multiplierNum.textContent = ratio + 'x';
      multiplierNum.style.animation = 'none';
      void multiplierNum.offsetWidth;
      multiplierNum.style.animation = '';
    }
    if (multiplierLabel) {
      if (ratio > 1.0) {
        multiplierLabel.textContent = '中文比英文多 ' + Math.round((ratio - 1) * 100) + '% tokens';
      } else {
        multiplierLabel.textContent = '中英文 token 数接近！';
      }
    }
  }

  function updateModel(model) {
    currentModel = model;
    modelBtns.forEach(b => b.classList.toggle('active', b.dataset.model === model));
    // Re-render current pair
    const activePair = document.querySelector('.compare-btn.active');
    if (activePair) updateComparison(activePair.dataset.pair);
  }

  // Bind pair buttons
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateComparison(btn.dataset.pair);
    });
  });

  // Bind model buttons
  modelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      updateModel(btn.dataset.model);
    });
  });

  // Initialize
  if (btns.length > 0) {
    btns[0].click();
  }

})();
