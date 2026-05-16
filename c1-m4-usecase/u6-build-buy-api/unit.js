/* ============================================
   U6 · Build vs Buy vs API — Path Chooser Widget
   ============================================ */
(() => {
  'use strict';

  // ---- Questions ----
  const questions = [
    {
      text: '预算多少?',
      options: [
        { label: '< ¥1 万', value: 'low' },
        { label: '¥1-10 万', value: 'mid' },
        { label: '> ¥10 万', value: 'high' }
      ]
    },
    {
      text: '多久要上线?',
      options: [
        { label: '< 2 周', value: 'fast' },
        { label: '2-8 周', value: 'mid' },
        { label: '> 2 个月', value: 'slow' }
      ]
    },
    {
      text: '团队有开发者吗?',
      options: [
        { label: '有', value: 'yes' },
        { label: '没有', value: 'no' }
      ]
    },
    {
      text: '需要深度定制吗?',
      options: [
        { label: '是, 数据/模型都要定制', value: 'yes' },
        { label: '否, 通用能力就够', value: 'no' }
      ]
    },
    {
      text: '涉及敏感数据吗?',
      options: [
        { label: '是 (健康/金融/个人隐私)', value: 'yes' },
        { label: '否', value: 'no' }
      ]
    }
  ];

  // ---- Decision logic ----
  function decide(answers) {
    const [budget, timeline, hasDev, needCustom, sensitive] = answers;

    // Scoring
    let buildScore = 0, buyScore = 0, apiScore = 0;

    // Budget
    if (budget === 'low') { buyScore += 3; }
    else if (budget === 'mid') { apiScore += 2; buyScore += 1; }
    else { buildScore += 2; apiScore += 1; }

    // Timeline
    if (timeline === 'fast') { buyScore += 3; }
    else if (timeline === 'mid') { apiScore += 2; buyScore += 1; }
    else { buildScore += 2; apiScore += 1; }

    // Developer
    if (hasDev === 'yes') { apiScore += 2; buildScore += 1; }
    else { buyScore += 3; }

    // Customization
    if (needCustom === 'yes') { buildScore += 3; apiScore += 1; }
    else { buyScore += 2; apiScore += 1; }

    // Sensitive data
    if (sensitive === 'yes') { buildScore += 2; apiScore += 1; }
    else { buyScore += 1; }

    // Determine winner
    const scores = { build: buildScore, buy: buyScore, api: apiScore };
    const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    return { winner, scores };
  }

  // ---- Result templates ----
  const results = {
    build: {
      icon: '🏗️',
      title: 'Build (自训/自研)',
      titleClass: 'build',
      reason: '你的预算充足、时间宽裕、需要深度定制或涉及敏感数据. 自研能给你最大控制权, 但也意味着更长的周期和更高的团队要求.',
      tools: 'Fine-tuning (LoRA/QLoRA) · 自建 RAG pipeline · 私有化部署 (vLLM, TGI)',
      timeline: '3-6 个月',
      cost: '¥10-50 万+',
      control: '最高'
    },
    buy: {
      icon: '🛒',
      title: 'Buy (SaaS/平台)',
      titleClass: 'buy',
      reason: '你预算有限、时间紧、团队没有开发者, 或者只是想快速验证一个想法. 平台方案让 PM 自己就能搭出 MVP, 几天就能上线.',
      tools: 'Coze (扣子) · Dify · FastGPT · 百度智能云 AppBuilder',
      timeline: '1-2 周',
      cost: '¥0-5K/月',
      control: '有限'
    },
    api: {
      icon: '🔌',
      title: 'API (调 API)',
      titleClass: 'api',
      reason: '你有开发者、需要嵌入到自己的产品里、对体验和流程有一定定制需求, 但不需要从零训模型. 这是大多数产品级 AI 功能的最佳路径.',
      tools: 'OpenAI API · DeepSeek API · Claude API · 豆包 API · 通义千问 API',
      timeline: '2-4 周',
      cost: '¥150-3K/月 (按量)',
      control: '良好'
    }
  };

  // ---- DOM ----
  const questionArea = document.getElementById('path-questions');
  const resultArea = document.getElementById('path-result');
  const progressDots = document.querySelectorAll('.path-dot');
  const resetBtn = document.getElementById('path-reset');

  if (!questionArea || !resultArea) return;

  let currentStep = 0;
  let answers = [];

  // ---- Render question ----
  function renderQuestion(idx) {
    const q = questions[idx];
    const optionsHTML = q.options.map(opt =>
      `<button class="path-option-btn" data-value="${opt.value}">${opt.label}</button>`
    ).join('');

    questionArea.innerHTML = `
      <div class="path-q-num">问题 ${idx + 1} / 5</div>
      <div class="path-q-text">${q.text}</div>
      <div class="path-options">${optionsHTML}</div>
    `;

    // Update progress dots
    progressDots.forEach((dot, i) => {
      dot.classList.remove('done', 'current');
      if (i < idx) dot.classList.add('done');
      else if (i === idx) dot.classList.add('current');
    });

    // Bind option clicks
    questionArea.querySelectorAll('.path-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Highlight selected
        questionArea.querySelectorAll('.path-option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        answers[idx] = btn.dataset.value;

        // Delay then advance
        setTimeout(() => {
          currentStep++;
          if (currentStep < questions.length) {
            renderQuestion(currentStep);
          } else {
            showResult();
          }
        }, 300);
      });
    });
  }

  // ---- Show result ----
  function showResult() {
    questionArea.style.display = 'none';

    const { winner } = decide(answers);
    const r = results[winner];

    // Mark all dots done
    progressDots.forEach(d => { d.classList.remove('current'); d.classList.add('done'); });

    resultArea.innerHTML = `
      <span class="path-result-icon">${r.icon}</span>
      <div class="path-result-title ${r.titleClass}">推荐: ${r.title}</div>
      <div class="path-result-reason">${r.reason}</div>

      <div class="path-result-meta">
        <div class="path-result-meta-item">
          <span class="meta-val" style="color:var(--amber);">${r.timeline}</span>
          <span class="meta-label">预计工期</span>
        </div>
        <div class="path-result-meta-item">
          <span class="meta-val" style="color:var(--red);">${r.cost}</span>
          <span class="meta-label">预计成本</span>
        </div>
        <div class="path-result-meta-item">
          <span class="meta-val" style="color:var(--blue);">${r.control}</span>
          <span class="meta-label">控制权</span>
        </div>
      </div>

      <div class="path-result-tools">
        <strong>推荐工具:</strong>
        ${r.tools}
      </div>

      <button class="path-reset-btn" id="path-reset-inner">重新选择 →</button>
    `;
    resultArea.classList.add('visible');

    // Bind reset
    document.getElementById('path-reset-inner').addEventListener('click', reset);
  }

  // ---- Reset ----
  function reset() {
    currentStep = 0;
    answers = [];
    questionArea.style.display = 'flex';
    resultArea.classList.remove('visible');
    resultArea.innerHTML = '';
    renderQuestion(0);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', reset);
  }

  // ---- Init ----
  renderQuestion(0);

})();
