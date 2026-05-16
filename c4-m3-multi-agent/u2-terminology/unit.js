/* U2: 算法术语速通 — Flash Cards + Quiz Widget */
(() => {
  'use strict';

  const deck = document.getElementById('flashcard-deck');
  if (!deck) return;

  const terms = [
    { term: 'Precision', zh: '精确率', def: '在模型判"是"的结果中, 有多少是真的"是". 越高 = 误报越少.', example: 'Vitamin 情绪分类: 判定"用户焦虑"的里面, 真的焦虑的比例.' },
    { term: 'Recall', zh: '召回率', def: '在所有真正"是"的样本中, 模型找到了多少. 越高 = 漏报越少.', example: 'Vitamin 异常检测: 所有真的异常用户中, 模型检出了多少.' },
    { term: 'F1 Score', zh: 'F1 分数', def: 'Precision 和 Recall 的调和平均值. 两者兼顾的综合指标.', example: '当 Precision 和 Recall 无法两全时, F1 帮你找平衡点.' },
    { term: 'AUC', zh: '曲线下面积', def: '模型区分正负样本的综合能力. 0.5 = 随机猜, 1.0 = 完美区分.', example: 'Vitamin 推荐模型 AUC 0.85 = 在 85% 的情况下能正确区分用户喜欢/不喜欢.' },
    { term: 'Embedding', zh: '向量嵌入', def: '把文字/图片/任何东西变成一组数字(向量), 相似的东西距离近.', example: '"经期疼痛"和"姨妈痛"的 embedding 向量很近, "天气预报"的很远.' },
    { term: 'Token', zh: '词元', def: 'LLM 处理文本的最小单位. 不是字, 不是词, 是模型自己切的"块".', example: '"Vitamin 很好用" 被 GPT 切成 ~5 个 token, 每个 token 都要花钱.' },
    { term: 'Context Window', zh: '上下文窗口', def: '模型一次能"看到"的最大 token 数. 超出就忘记前面的内容.', example: 'GPT-4o 128K context = 约 10 万字. 用户的一周聊天记录大概 5K token.' },
    { term: 'Fine-tuning', zh: '微调', def: '在预训练模型基础上, 用你自己的数据再训练, 让模型适应你的场景.', example: '用 Vitamin 的 1000 条用户对话微调, 让模型更懂女性健康用语.' },
    { term: 'RLHF', zh: '人类反馈强化学习', def: '让人类给模型的回答打分, 模型学会"什么样的回答人类更喜欢".', example: 'ChatGPT 变得"有礼貌"就是 RLHF 的功劳 — 人类标注员训练出来的.' },
    { term: 'Emergence', zh: '涌现', def: '模型规模大到一定程度, 突然出现训练时没有专门教过的能力.', example: 'GPT-3 没人教它做数学, 但它会做简单加法. 这就是涌现.' }
  ];

  let currentIdx = 0;
  let isFlipped = false;
  let quizMode = false;
  let quizIdx = 0;
  let quizScore = 0;
  let quizAnswered = 0;

  const cardEl = document.getElementById('flashcard');
  const counterEl = document.getElementById('card-counter');
  const prevBtn = document.getElementById('card-prev');
  const nextBtn = document.getElementById('card-next');
  const flipBtn = document.getElementById('card-flip');
  const studyBtn = document.getElementById('mode-study');
  const quizBtn = document.getElementById('mode-quiz');
  const studyArea = document.getElementById('study-area');
  const quizArea = document.getElementById('quiz-area');

  function renderCard() {
    if (!cardEl) return;
    const t = terms[currentIdx];
    isFlipped = false;
    cardEl.classList.remove('flipped');

    const front = cardEl.querySelector('.flashcard-front');
    const back = cardEl.querySelector('.flashcard-back');

    if (front) {
      front.innerHTML = `
        <div class="flashcard-term">${t.term}</div>
        <div class="flashcard-hint">点击翻转 →</div>
      `;
    }
    if (back) {
      back.innerHTML = `
        <div class="flashcard-def">${t.def}</div>
        <div class="flashcard-example"><strong>Vitamin 例子:</strong> ${t.example}</div>
      `;
    }
    if (counterEl) counterEl.textContent = `${currentIdx + 1} / ${terms.length}`;
  }

  function flipCard() {
    isFlipped = !isFlipped;
    if (cardEl) cardEl.classList.toggle('flipped', isFlipped);
  }

  function nextCard() {
    currentIdx = (currentIdx + 1) % terms.length;
    renderCard();
  }

  function prevCard() {
    currentIdx = (currentIdx - 1 + terms.length) % terms.length;
    renderCard();
  }

  if (cardEl) cardEl.addEventListener('click', flipCard);
  if (flipBtn) flipBtn.addEventListener('click', flipCard);
  if (nextBtn) nextBtn.addEventListener('click', nextCard);
  if (prevBtn) prevBtn.addEventListener('click', prevCard);

  // Mode switch
  function setStudyMode() {
    quizMode = false;
    if (studyArea) studyArea.style.display = 'block';
    if (quizArea) quizArea.classList.remove('active');
    if (studyBtn) studyBtn.classList.add('btn-primary');
    if (studyBtn) studyBtn.classList.remove('btn-ghost');
    if (quizBtn) quizBtn.classList.remove('btn-primary');
    if (quizBtn) quizBtn.classList.add('btn-ghost');
  }

  function setQuizMode() {
    quizMode = true;
    quizIdx = 0;
    quizScore = 0;
    quizAnswered = 0;
    if (studyArea) studyArea.style.display = 'none';
    if (quizArea) quizArea.classList.add('active');
    if (quizBtn) quizBtn.classList.add('btn-primary');
    if (quizBtn) quizBtn.classList.remove('btn-ghost');
    if (studyBtn) studyBtn.classList.remove('btn-primary');
    if (studyBtn) studyBtn.classList.add('btn-ghost');
    renderQuiz();
  }

  if (studyBtn) studyBtn.addEventListener('click', setStudyMode);
  if (quizBtn) quizBtn.addEventListener('click', setQuizMode);

  // Quiz
  const quizDefEl = document.getElementById('quiz-def');
  const quizInput = document.getElementById('quiz-input');
  const quizSubmit = document.getElementById('quiz-submit');
  const quizResult = document.getElementById('quiz-result');
  const quizScoreEl = document.getElementById('quiz-score');
  const quizNextBtn = document.getElementById('quiz-next');
  const quizCounterEl = document.getElementById('quiz-counter');

  // Shuffle array
  let quizOrder = [];
  function shuffleQuiz() {
    quizOrder = terms.map((_, i) => i);
    for (let i = quizOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [quizOrder[i], quizOrder[j]] = [quizOrder[j], quizOrder[i]];
    }
  }

  function renderQuiz() {
    if (quizAnswered >= terms.length) {
      if (quizDefEl) quizDefEl.textContent = '测验完成!';
      if (quizInput) quizInput.style.display = 'none';
      if (quizSubmit) quizSubmit.style.display = 'none';
      if (quizNextBtn) quizNextBtn.style.display = 'none';
      if (quizResult) {
        quizResult.className = 'quiz-result correct';
        quizResult.textContent = `最终得分: ${quizScore} / ${terms.length}`;
      }
      return;
    }

    if (quizOrder.length === 0) shuffleQuiz();
    const t = terms[quizOrder[quizIdx]];
    if (quizDefEl) quizDefEl.textContent = t.def;
    if (quizInput) { quizInput.value = ''; quizInput.disabled = false; quizInput.style.display = 'inline-block'; }
    if (quizSubmit) { quizSubmit.disabled = false; quizSubmit.style.display = 'inline-block'; }
    if (quizResult) { quizResult.textContent = ''; quizResult.className = 'quiz-result'; }
    if (quizNextBtn) quizNextBtn.style.display = 'none';
    if (quizCounterEl) quizCounterEl.textContent = `${quizAnswered + 1} / ${terms.length}`;
    if (quizScoreEl) quizScoreEl.textContent = quizScore;
    if (quizInput) quizInput.focus();
  }

  function checkQuiz() {
    if (!quizInput || quizInput.disabled) return;
    const t = terms[quizOrder[quizIdx]];
    const answer = quizInput.value.trim().toLowerCase();
    const correct = t.term.toLowerCase();
    const isCorrect = answer === correct || answer === t.zh;

    if (isCorrect) {
      quizScore++;
      if (quizResult) { quizResult.className = 'quiz-result correct'; quizResult.textContent = `✓ 正确! ${t.term} (${t.zh})`; }
    } else {
      if (quizResult) { quizResult.className = 'quiz-result wrong'; quizResult.textContent = `✗ 答案是: ${t.term} (${t.zh})`; }
    }

    quizAnswered++;
    quizInput.disabled = true;
    if (quizSubmit) quizSubmit.disabled = true;
    if (quizScoreEl) quizScoreEl.textContent = quizScore;
    if (quizNextBtn && quizAnswered < terms.length) quizNextBtn.style.display = 'inline-block';
    if (quizAnswered >= terms.length) {
      setTimeout(renderQuiz, 1500);
    }
  }

  function quizNext() {
    quizIdx = (quizIdx + 1) % quizOrder.length;
    renderQuiz();
  }

  if (quizSubmit) quizSubmit.addEventListener('click', checkQuiz);
  if (quizInput) quizInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkQuiz(); });
  if (quizNextBtn) quizNextBtn.addEventListener('click', quizNext);

  // Init
  renderCard();

})();
