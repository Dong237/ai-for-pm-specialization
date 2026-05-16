/* U6: Behavioral Interview — Mock Interview Simulator Widget */
(() => {
  'use strict';

  const mockEl = document.getElementById('mock-interview');
  if (!mockEl) return;

  const questions = [
    { q: '说说你最骄傲的一个项目.', tip: '考核: 成就感来源 + 你的贡献', sample: 'S: Vitamin 产品 D30 留存只有 15%, 团队士气低. T: 我负责找到提升留存的方案. A: 我主导了 3 轮用户调研, 发现核心痛点是 "记录太麻烦", 设计了 AI 智能记录功能, 选了 RAG + GPT-4o-mini, 建了评测集. R: 留存 15%→28%, 这是我最骄傲的, 因为是从用户洞察到技术落地的完整闭环.' },
    { q: '说说你踩过最大的坑.', tip: '考核: 自我反思 + 从失败中学习', sample: 'S: 在 Vitamin 项目初期, 我直接选了 GPT-4o 作为模型. T: 上线后发现月成本 $1800, 远超预算. A: 我做了 3 件事: 紧急降级到 GPT-4o-mini, 建了模型分级路由, 建了成本监控 dashboard. R: 成本降到 $108/月. 教训: 永远先算账, 再选模型.' },
    { q: '你跟工程师意见不一致时, 怎么处理?', tip: '考核: 沟通能力 + 冲突解决', sample: 'S: 工程师想用 Fine-tune, 我想用 RAG. T: 需要在 1 周内做出技术决策. A: 我没有直接反驳, 而是提议用数据说话: 两种方案各做 1 天 POC, 在 50 条测试集上跑. 结果 RAG 的 F1 更高, 成本更低. R: 工程师被数据说服了, 最后我们合作非常顺畅.' },
    { q: '说一个你用数据驱动决策的例子.', tip: '考核: 数据思维 + 分析能力', sample: 'S: Vitamin 要决定 AI 功能的 MVP 范围. T: 需要决定先做哪个功能. A: 我分析了 3 个数据源: 用户调研 (20人)、使用日志 (痛点频率)、竞品功能对比. 数据显示 "记录简化" 是最高频痛点. R: 基于数据选择了 AI 智能记录, 上线后验证了假设 — 使用率 73%.' },
    { q: '说一次你在资源有限的情况下怎么交付的.', tip: '考核: 优先级能力 + 执行力', sample: 'S: Vitamin 团队只有 2 个后端, 要在 3 个月内上线 AI 功能. T: 在人力极其有限的情况下交付. A: 我做了 3 个取舍: 用 API 不自建模型 (省 1 个人月), MVP 只做文本输入不做语音 (省 2 周), 用 GPT-4o-mini 不用 GPT-4o (不需要额外优化). R: 准时上线, 没有加班.' },
    { q: '你怎么跟非技术的 stakeholder 解释 AI?', tip: '考核: 沟通降维能力', sample: 'S: CEO 不理解为什么 AI 功能不能 100% 准确. T: 需要让他理解 AI 的概率本质. A: 我用类比: "AI 像一个实习生 — 大多数时候对, 偶尔犯错, 需要老员工审核." 然后展示了幻觉率数据 (2%) 和兜底方案. R: CEO 接受了 "AI + 人工审核" 的方案, 不再要求 100% 准确.' },
    { q: '说说你从销售转 PM 的过程, 最大挑战是什么?', tip: '考核: 转型动机 + 学习能力', sample: 'S: 做了 3 年销售, 发现自己更喜欢定义产品而不是卖产品. T: 转型到 AI PM. A: 我做了 3 件事: 系统学习了 AI 概念 (LLM / Token / RAG 等), 用 Vitamin 项目从头做了一个 AI 产品, 从 0 到 1 建了评测体系. R: 这个转型让我有了独特视角 — 我既懂用户 (销售经验) 又懂技术 (AI 学习).' },
    { q: '如果你加入我们, 前 30 天你会做什么?', tip: '考核: 规划能力 + 主动性 (呼应 U8)', sample: 'S: 新入职一家公司. T: 前 30 天要建立基础. A: 3 件事: (1) 约每个团队成员 1:1 coffee chat, 了解现有产品和痛点. (2) 通读产品文档, 自己做一遍用户体验. (3) 找到一个 quick win — 比如改进一个 prompt, 能快速看到效果. R: 30 天结束时, 我要让团队觉得 "这个人靠谱".' }
  ];

  let currentIdx = 0;
  let practiced = new Set();
  let timerInterval = null;
  let timerSeconds = 0;
  let isRunning = false;
  const MAX_TIME = 120; // 2 minutes

  const STORAGE_KEY = 'u6-mock-state';
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.practiced) saved.practiced.forEach(i => practiced.add(i));
  } catch (e) {}

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ practiced: [...practiced] }));
  }

  const questionText = mockEl.querySelector('.mock-question-text');
  const questionHint = mockEl.querySelector('.mock-question-hint');
  const timerDisplay = mockEl.querySelector('.mock-timer-display');
  const timerFill = mockEl.querySelector('.mock-timer-fill');
  const sampleEl = mockEl.querySelector('.mock-sample');
  const sampleContent = mockEl.querySelector('.mock-sample-content');
  const startBtn = document.getElementById('mock-start');
  const nextBtn = document.getElementById('mock-next');
  const showBtn = document.getElementById('mock-show');
  const progressEl = mockEl.querySelector('.mock-progress');

  function shuffle() {
    // Pick random unpracticed, or random from all
    const unpracticed = questions.map((_, i) => i).filter(i => !practiced.has(i));
    if (unpracticed.length > 0) {
      currentIdx = unpracticed[Math.floor(Math.random() * unpracticed.length)];
    } else {
      currentIdx = Math.floor(Math.random() * questions.length);
    }
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function updateDisplay() {
    const q = questions[currentIdx];
    questionText.textContent = q.q;
    questionHint.textContent = q.tip;
    sampleEl.classList.remove('visible');

    // Timer reset
    timerSeconds = 0;
    timerDisplay.textContent = formatTime(MAX_TIME);
    timerDisplay.className = 'mock-timer-display';
    timerFill.style.width = '0%';
    if (timerInterval) clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = '开始计时 (2 min)';

    // Progress dots
    progressEl.innerHTML = '';
    questions.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'mock-progress-dot';
      if (practiced.has(i)) dot.classList.add('done');
      if (i === currentIdx) dot.classList.add('current');
      dot.textContent = i + 1;
      progressEl.appendChild(dot);
    });
  }

  startBtn.addEventListener('click', () => {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.textContent = '继续';
      return;
    }
    isRunning = true;
    startBtn.textContent = '暂停';
    timerInterval = setInterval(() => {
      timerSeconds++;
      const remaining = Math.max(0, MAX_TIME - timerSeconds);
      timerDisplay.textContent = formatTime(remaining);
      timerFill.style.width = ((timerSeconds / MAX_TIME) * 100) + '%';
      timerDisplay.className = 'mock-timer-display';
      if (remaining <= 15) timerDisplay.classList.add('danger');
      else if (remaining <= 30) timerDisplay.classList.add('warning');
      if (remaining <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = '时间到!';
        practiced.add(currentIdx);
        save();
        updateDisplay();
      }
    }, 1000);
  });

  nextBtn.addEventListener('click', () => {
    practiced.add(currentIdx);
    save();
    if (timerInterval) clearInterval(timerInterval);
    isRunning = false;
    shuffle();
    updateDisplay();
  });

  showBtn.addEventListener('click', () => {
    const q = questions[currentIdx];
    sampleContent.textContent = q.sample;
    sampleEl.classList.toggle('visible');
    showBtn.textContent = sampleEl.classList.contains('visible') ? '隐藏参考' : '看参考答案';
  });

  // BQ list clicks
  document.querySelectorAll('.bq-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('expanded');
    });
  });

  shuffle();
  updateDisplay();
})();
