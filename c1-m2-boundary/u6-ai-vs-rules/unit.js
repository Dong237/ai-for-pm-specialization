/* ===== Unit 6 · Decision Tree Wizard Widget ===== */
(() => {
  'use strict';

  // ----- 6 Questions -----
  const questions = [
    {
      num: 1,
      text: '输入是否结构化?',
      hint: '结构化 = 固定格式的数字/选项 (如身高体重). 非结构化 = 自由文本/图片/语音.',
      yesLean: 'rules',   // structured → rules more likely
      noLean: 'ai'         // unstructured → AI more likely
    },
    {
      num: 2,
      text: '输出是否需要可解释?',
      hint: '可解释 = 用户/监管方需要知道"为什么给这个结果". 比如: 为什么推荐这个药.',
      yesLean: 'rules',
      noLean: 'ai'
    },
    {
      num: 3,
      text: '用户能容忍偶尔出错吗?',
      hint: '聊天闲聊出错没关系, 用药建议出错可能出人命.',
      yesLean: 'ai',
      noLean: 'rules'
    },
    {
      num: 4,
      text: '是否需要创造性 / 个性化?',
      hint: '千人千面的推荐、自然对话、文案生成 = 需要创造性. BMI 计算 = 不需要.',
      yesLean: 'ai',
      noLean: 'rules'
    },
    {
      num: 5,
      text: '数据量是否足够训练?',
      hint: '有大量历史数据可以训练/微调模型? 还是只有几条规则就能覆盖?',
      yesLean: 'ai',
      noLean: 'rules'
    },
    {
      num: 6,
      text: '是否需要适应新模式?',
      hint: '用户行为/数据模式会持续变化? 还是逻辑固定不变?',
      yesLean: 'ai',
      noLean: 'rules'
    }
  ];

  // ----- Decision logic -----
  // Count how many answers lean toward AI vs rules
  function getVerdict(answers) {
    let aiScore = 0;
    let rulesScore = 0;

    answers.forEach((answer, i) => {
      const q = questions[i];
      if (answer === 'yes') {
        if (q.yesLean === 'ai') aiScore++;
        else rulesScore++;
      } else {
        if (q.noLean === 'ai') aiScore++;
        else rulesScore++;
      }
    });

    if (aiScore >= 5) return { type: 'ai', icon: '🤖', label: '用 AI', explain: `6 条标准中有 ${aiScore} 条指向 AI. 这个功能非常适合用 AI 实现 — 非结构化输入、需要个性化、有足够数据、可以容忍少量误差.` };
    if (rulesScore >= 5) return { type: 'rules', icon: '📐', label: '用规则', explain: `6 条标准中有 ${rulesScore} 条指向规则. 这个功能应该用传统规则实现 — 结构化输入、需要可解释、不能出错、逻辑固定.` };
    if (aiScore >= 4) return { type: 'ai', icon: '🤖', label: '倾向 AI', explain: `AI ${aiScore} 分 vs 规则 ${rulesScore} 分. 主体用 AI, 但在需要精确/可解释的环节加规则保障.` };
    if (rulesScore >= 4) return { type: 'rules', icon: '📐', label: '倾向规则', explain: `规则 ${rulesScore} 分 vs AI ${aiScore} 分. 主体用规则, 可以在输入理解/分类环节引入 AI 辅助.` };
    return { type: 'both', icon: '🔀', label: 'AI + 规则组合', explain: `AI ${aiScore} 分 vs 规则 ${rulesScore} 分, 势均力敌. 最佳方案: AI 负责"理解"(分类/识别/生成), 规则负责"执行"(校验/约束/兜底).` };
  }

  // ----- DOM references -----
  const dots = document.querySelectorAll('.wizard-dot');
  const qArea = document.getElementById('wizard-q-area');
  const qNum = document.getElementById('wizard-q-num');
  const qText = document.getElementById('wizard-q-text');
  const qHint = document.getElementById('wizard-q-hint');
  const yesBtn = document.getElementById('wizard-yes');
  const noBtn = document.getElementById('wizard-no');
  const history = document.getElementById('wizard-history');
  const verdictBox = document.getElementById('wizard-verdict');
  const verdictIcon = document.getElementById('wizard-v-icon');
  const verdictText = document.getElementById('wizard-v-text');
  const verdictExplain = document.getElementById('wizard-v-explain');
  const resetBtn = document.getElementById('wizard-reset');
  const tryAgainBtn = document.getElementById('wizard-try-again');
  const btnContainer = document.getElementById('wizard-btn-container');

  if (!qArea || !yesBtn) return;

  let currentStep = 0;
  let answers = [];

  function renderQuestion() {
    if (currentStep >= questions.length) {
      showVerdict();
      return;
    }

    const q = questions[currentStep];
    qNum.textContent = `问题 ${q.num} / 6`;
    qText.textContent = q.text;
    qHint.textContent = q.hint;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentStep);
      dot.classList.toggle('done', i < currentStep);
    });

    // Show question area, hide verdict
    qArea.style.display = 'flex';
    btnContainer.style.display = 'flex';
    verdictBox.classList.remove('visible');

    // Animate in
    qArea.style.opacity = '0';
    qArea.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => {
      qArea.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      qArea.style.opacity = '1';
      qArea.style.transform = 'translateY(0)';
    });
  }

  function addToHistory(qIdx, answer) {
    const item = document.createElement('div');
    item.className = 'wizard-history-item';
    const q = questions[qIdx];
    const aClass = answer === 'yes' ? 'hist-yes' : 'hist-no';
    const aText = answer === 'yes' ? '是' : '否';
    const lean = answer === 'yes' ? q.yesLean : q.noLean;
    const leanIcon = lean === 'ai' ? '→ AI' : '→ 规则';
    item.innerHTML = `<span class="hist-q">Q${q.num}: ${q.text}</span> <span class="hist-a ${aClass}">${aText}</span> <span style="color:var(--ink-faint);font-size:12px;">${leanIcon}</span>`;
    history.appendChild(item);
  }

  function showVerdict() {
    const v = getVerdict(answers);

    // Hide question, show verdict
    qArea.style.display = 'none';
    btnContainer.style.display = 'none';
    verdictBox.classList.add('visible');

    verdictIcon.textContent = v.icon;
    verdictText.textContent = v.label;
    verdictText.className = 'wizard-verdict-text ' + v.type;
    verdictExplain.textContent = v.explain;

    // All dots done
    dots.forEach(dot => {
      dot.classList.remove('active');
      dot.classList.add('done');
    });
  }

  function reset() {
    currentStep = 0;
    answers = [];
    history.innerHTML = '';
    verdictBox.classList.remove('visible');
    renderQuestion();
  }

  function answer(val) {
    answers.push(val);
    addToHistory(currentStep, val);
    currentStep++;
    renderQuestion();
  }

  yesBtn.addEventListener('click', () => answer('yes'));
  noBtn.addEventListener('click', () => answer('no'));
  resetBtn.addEventListener('click', reset);
  if (tryAgainBtn) tryAgainBtn.addEventListener('click', reset);

  // Init
  renderQuestion();

})();
