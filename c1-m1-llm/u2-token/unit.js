/* ===========================================
   Unit 2 · Token 是什么 — Interactive tokenizer
   ===========================================
   Pre-computed tokenization data for common phrases.
   No WASM dependency — works from file:// on iPad.
*/

(() => {
  'use strict';

  // Pre-computed tokenization data (GPT-4 / cl100k_base approximate)
  // Each entry: { text, tokens: [string], charCount, tokenCount }
  const TOKEN_DATA = {
    '今天天气真好': {
      tokens: ['今天', '天气', '真', '好'],
      charCount: 6, tokenCount: 4
    },
    'The weather is great today': {
      tokens: ['The', ' weather', ' is', ' great', ' today'],
      charCount: 26, tokenCount: 5
    },
    '我爱你': {
      tokens: ['我', '爱', '你'],
      charCount: 3, tokenCount: 3
    },
    'I love you': {
      tokens: ['I', ' love', ' you'],
      charCount: 10, tokenCount: 3
    },
    'Vitamin 是一款女性健康 AI 应用': {
      tokens: ['Vitamin', ' 是', '一', '款', '女性', '健康', ' AI', ' 应用'],
      charCount: 16, tokenCount: 8
    },
    'Vitamin is a women\'s health AI app': {
      tokens: ['Vitamin', ' is', ' a', ' women', '\'s', ' health', ' AI', ' app'],
      charCount: 35, tokenCount: 8
    },
    '经期可以跑步吗？': {
      tokens: ['经', '期', '可以', '跑步', '吗', '？'],
      charCount: 8, tokenCount: 6
    },
    'Can I run during my period?': {
      tokens: ['Can', ' I', ' run', ' during', ' my', ' period', '?'],
      charCount: 27, tokenCount: 7
    },
    'unhappiness': {
      tokens: ['un', 'happiness'],
      charCount: 11, tokenCount: 2
    },
    'ChatGPT': {
      tokens: ['Chat', 'GPT'],
      charCount: 7, tokenCount: 2
    },
    '人工智能': {
      tokens: ['人工', '智能'],
      charCount: 4, tokenCount: 2
    },
    'artificial intelligence': {
      tokens: ['artificial', ' intelligence'],
      charCount: 23, tokenCount: 2
    },
    '请帮我写一份产品需求文档': {
      tokens: ['请', '帮', '我', '写', '一份', '产品', '需求', '文档'],
      charCount: 12, tokenCount: 8
    },
    'Please help me write a PRD': {
      tokens: ['Please', ' help', ' me', ' write', ' a', ' PRD'],
      charCount: 26, tokenCount: 6
    },
    '维他命': {
      tokens: ['维', '他', '命'],
      charCount: 3, tokenCount: 3
    },
    'LLM': {
      tokens: ['LL', 'M'],
      charCount: 3, tokenCount: 2
    },
    '大语言模型': {
      tokens: ['大', '语言', '模型'],
      charCount: 5, tokenCount: 3
    },
    'large language model': {
      tokens: ['large', ' language', ' model'],
      charCount: 20, tokenCount: 3
    },
    '今天吃了一个苹果和一杯酸奶': {
      tokens: ['今天', '吃', '了', '一个', '苹果', '和', '一杯', '酸', '奶'],
      charCount: 13, tokenCount: 9
    },
    'I ate an apple and a yogurt today': {
      tokens: ['I', ' ate', ' an', ' apple', ' and', ' a', ' yogurt', ' today'],
      charCount: 32, tokenCount: 8
    },
    '你好': {
      tokens: ['你好'],
      charCount: 2, tokenCount: 1
    },
    'hello': {
      tokens: ['hello'],
      charCount: 5, tokenCount: 1
    },
    '深度学习是人工智能的一个分支': {
      tokens: ['深度', '学习', '是', '人工', '智能', '的', '一个', '分支'],
      charCount: 13, tokenCount: 8
    },
    'Temperature': {
      tokens: ['Temperature'],
      charCount: 11, tokenCount: 1
    },
    '温度参数': {
      tokens: ['温度', '参数'],
      charCount: 4, tokenCount: 2
    }
  };

  // Simple fallback tokenizer for arbitrary text
  // Approximation: Chinese chars ≈ 1 token per 1-2 chars, English ≈ 1 token per 4 chars
  function approximateTokenize(text) {
    if (TOKEN_DATA[text]) return TOKEN_DATA[text];

    const tokens = [];
    let i = 0;
    while (i < text.length) {
      const code = text.charCodeAt(i);
      // CJK character range
      if (code >= 0x4E00 && code <= 0x9FFF) {
        // Chinese: sometimes 2 chars = 1 token, sometimes 1 char = 1 token
        if (i + 1 < text.length) {
          const next = text.charCodeAt(i + 1);
          if (next >= 0x4E00 && next <= 0x9FFF && Math.random() > 0.4) {
            tokens.push(text.substring(i, i + 2));
            i += 2;
            continue;
          }
        }
        tokens.push(text[i]);
        i++;
      } else if (code > 127) {
        // Other non-ASCII (punctuation etc)
        tokens.push(text[i]);
        i++;
      } else if (text[i] === ' ') {
        // Space attaches to next word
        let end = i + 1;
        while (end < text.length && text[end] !== ' ' && text.charCodeAt(end) < 0x4E00) end++;
        tokens.push(text.substring(i, end));
        i = end;
      } else {
        // ASCII word
        let end = i;
        while (end < text.length && text[end] !== ' ' && text.charCodeAt(end) < 128) end++;
        tokens.push(text.substring(i, end));
        i = end;
      }
    }
    return {
      tokens,
      charCount: text.length,
      tokenCount: tokens.length
    };
  }

  // Color classes for tokens (cycle)
  const COLORS = ['c0', 'c1', 'c2', 'c3', 'c4'];

  function renderTokens(data, container, statsContainer) {
    container.innerHTML = '';
    data.tokens.forEach((t, i) => {
      const span = document.createElement('span');
      span.className = 'token-seg ' + COLORS[i % COLORS.length];
      span.textContent = t;
      span.style.animationDelay = (i * 0.06) + 's';
      container.appendChild(span);
    });

    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stat-chars">
          <span class="token-stat-num">${data.charCount}</span>
          字符数
        </div>
        <div class="stat-tokens">
          <span class="token-stat-num">${data.tokenCount}</span>
          Token 数
        </div>
      `;
    }
  }

  // ----- Interactive tokenizer widget -----
  const input = document.getElementById('tokenizer-input');
  const segments = document.getElementById('tokenizer-segments');
  const stats = document.getElementById('tokenizer-stats');
  const presetBtns = document.querySelectorAll('.preset-btn');

  if (input && segments) {
    function updateTokenizer(text) {
      if (!text.trim()) {
        segments.innerHTML = '<span style="color:var(--ink-muted);font-size:15px;">输入文字, 看 token 怎么切 ↑</span>';
        if (stats) stats.innerHTML = '';
        return;
      }
      const data = TOKEN_DATA[text] || approximateTokenize(text);
      renderTokens(data, segments, stats);
    }

    input.addEventListener('input', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      updateTokenizer(input.value);
    });

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.text;
        input.value = text;
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateTokenizer(text);
      });
    });

    // Initialize with first preset
    if (presetBtns.length > 0) {
      presetBtns[0].click();
    }
  }

  // ----- Static token displays (steps 3, 6) -----
  // Render pre-set token displays on page load
  document.querySelectorAll('[data-token-text]').forEach(el => {
    const text = el.dataset.tokenText;
    const data = TOKEN_DATA[text] || approximateTokenize(text);
    const segsEl = el.querySelector('.token-segments');
    const statsEl = el.querySelector('.token-stats');
    if (segsEl) renderTokens(data, segsEl, statsEl);
  });

})();
