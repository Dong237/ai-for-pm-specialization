/* =============================================
   Unit 1 · Reading / Writing / Chatting
   Feature Classifier Widget
   ============================================= */

(() => {
  'use strict';

  // --- Feature data ---
  const features = [
    { id: 1,  label: '用户日记情绪分类',       type: 'reading',  why: '从用户写的文字中提取情绪标签 — 这是 Reading (Classify).' },
    { id: 2,  label: '生成每日健康小贴士',       type: 'writing',  why: '根据用户状态生成新内容 — 这是 Writing (Draft).' },
    { id: 3,  label: '多轮问答: 经期能跑步吗?',  type: 'chatting', why: '用户提问、AI 回答、用户追问 — 这是 Chatting (Q&A).' },
    { id: 4,  label: '提取食物日志中的营养关键词', type: 'reading',  why: '从一段文字中抽出结构化信息 — 这是 Reading (Extract).' },
    { id: 5,  label: '把医学术语改写成大白话',    type: 'writing',  why: '输入专业文本, 输出通俗版本 — 这是 Writing (Paraphrase).' },
    { id: 6,  label: '情绪陪伴: 今天心情不好',    type: 'chatting', why: '持续多轮, 提供情感支持 — 这是 Chatting (Companion).' },
    { id: 7,  label: '一周健康数据总结报告',      type: 'reading',  why: '阅读 7 天数据, 输出摘要 — 这是 Reading (Summarize).' },
    { id: 8,  label: '根据体质生成食谱推荐',      type: 'writing',  why: '基于条件创造新内容 — 这是 Writing (Expand).' },
    { id: 9,  label: '客服: 怎么取消订阅?',      type: 'chatting', why: '用户有具体问题需要解答 — 这是 Chatting (Support).' },
    { id: 10, label: '判断用户输入是否涉及医疗',   type: 'reading',  why: '对输入做二分类判断 — 这是 Reading (Classify).' },
    { id: 11, label: '扩写一句话症状为详细描述',   type: 'writing',  why: '从简短输入扩展成详细文本 — 这是 Writing (Expand).' },
    { id: 12, label: '帮用户规划备孕时间表',      type: 'chatting', why: '需要多轮交互了解情况再给建议 — 这是 Chatting (Q&A).' },
  ];

  // --- DOM refs ---
  const pool = document.getElementById('feature-pool');
  const colR = document.getElementById('col-reading');
  const colW = document.getElementById('col-writing');
  const colC = document.getElementById('col-chatting');
  const explainBox = document.getElementById('cls-explain');
  const customInput = document.getElementById('custom-feature-input');
  const customBtn = document.getElementById('custom-feature-btn');

  if (!pool || !colR) return; // guard

  // --- Render chips ---
  const tilts = [-1.2, 0.8, -0.5, 1.1, -0.9, 0.6, -0.3, 1.4, -0.7, 0.4, -1.0, 0.7];
  features.forEach((f, i) => {
    const chip = document.createElement('button');
    chip.className = 'feature-chip';
    chip.textContent = f.label;
    chip.style.setProperty('--chip-tilt', tilts[i % tilts.length] + 'deg');
    chip.dataset.id = f.id;
    chip.addEventListener('click', () => classifyFeature(f, chip));
    pool.appendChild(chip);
  });

  function classifyFeature(f, chip) {
    // Mark chip as used
    chip.classList.add('used');

    // Create sorted item
    const item = document.createElement('div');
    item.className = 'cls-sorted-item';
    item.textContent = f.label;

    // Add to correct column
    const col = f.type === 'reading' ? colR : f.type === 'writing' ? colW : colC;
    col.appendChild(item);

    // Show explanation
    explainBox.textContent = f.why;
    explainBox.style.opacity = '1';

    // Auto-clear explanation after 4s
    clearTimeout(classifyFeature._timer);
    classifyFeature._timer = setTimeout(() => {
      explainBox.style.opacity = '0.6';
    }, 4000);
  }

  // --- Custom feature input ---
  if (customBtn && customInput) {
    const customClassify = () => {
      const text = customInput.value.trim();
      if (!text) return;

      // Simple keyword-based classification for demo
      const readingKeywords = ['分类', '分析', '提取', '总结', '识别', '判断', '检测', '摘要', '归类', '审核', '理解', '解读'];
      const writingKeywords = ['生成', '写', '创作', '改写', '翻译', '扩写', '草拟', '推荐', '建议文案', '文案', '起名', '编写'];
      const chattingKeywords = ['问答', '聊天', '对话', '客服', '陪伴', '咨询', '沟通', '交流', '互动', '回复'];

      let type = 'chatting'; // default
      let why = '';

      const rScore = readingKeywords.filter(k => text.includes(k)).length;
      const wScore = writingKeywords.filter(k => text.includes(k)).length;
      const cScore = chattingKeywords.filter(k => text.includes(k)).length;

      if (rScore > wScore && rScore > cScore) {
        type = 'reading';
        why = `检测到关键词偏向"阅读理解"类 — 分到 Reading. (AI 需要读懂输入, 输出结构化结果)`;
      } else if (wScore > rScore && wScore > cScore) {
        type = 'writing';
        why = `检测到关键词偏向"内容生成"类 — 分到 Writing. (AI 需要创造新内容)`;
      } else {
        type = 'chatting';
        why = `没有明显的 Reading/Writing 信号 — 默认分到 Chatting. (多轮交互类任务)`;
      }

      // Add to column
      const col = type === 'reading' ? colR : type === 'writing' ? colW : colC;
      const item = document.createElement('div');
      item.className = 'cls-sorted-item';
      item.textContent = text;
      item.style.borderColor = type === 'reading' ? 'var(--blue)' : type === 'writing' ? 'var(--green)' : 'var(--purple)';
      col.appendChild(item);

      explainBox.textContent = `"${text}" → ${type.toUpperCase()}. ${why}`;
      explainBox.style.opacity = '1';

      customInput.value = '';
    };

    customBtn.addEventListener('click', customClassify);
    customInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') customClassify();
    });
  }

  // --- Reset button ---
  const resetBtn = document.getElementById('cls-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Clear columns
      [colR, colW, colC].forEach(col => {
        col.querySelectorAll('.cls-sorted-item').forEach(item => item.remove());
      });
      // Un-use chips
      pool.querySelectorAll('.feature-chip').forEach(chip => {
        chip.classList.remove('used');
      });
      explainBox.textContent = '';
      explainBox.style.opacity = '0';
    });
  }

})();
