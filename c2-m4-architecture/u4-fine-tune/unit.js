/* U4 · Fine-tune Decision Checker */
(() => {
  'use strict';

  const questions = [
    { text: 'Prompt-only 试过了, 效果不满意?', helpYes: '好, 至少先试了最简方案.', helpNo: '先回去试 Prompt-only, 很可能够用.' },
    { text: '问题是 "风格/语调" 不对, 而不是 "知识" 不对?', helpYes: '风格问题是 Fine-tune 的强项.', helpNo: '知识问题用 RAG 解决, 不是 Fine-tune.' },
    { text: '你有 500+ 条高质量标注数据 (input → ideal output)?', helpYes: '数据量够了, 可以微调.', helpNo: '数据不够, Fine-tune 效果不好. 先积累数据.' },
    { text: '产品已经验证了 PMF (Product-Market Fit)?', helpYes: 'PMF 后投入 Fine-tune 才值得.', helpNo: 'PMF 前别花钱训模型 — 需求可能会变.' }
  ];

  let currentQ = 0;
  let answers = [];

  const questionText = document.getElementById('ft-q-text');
  const questionNum = document.getElementById('ft-q-num');
  const yesBtn = document.getElementById('ft-yes');
  const noBtn = document.getElementById('ft-no');
  const resultPanel = document.getElementById('ft-result');
  const resultIcon = document.getElementById('ft-result-icon');
  const resultText = document.getElementById('ft-result-text');
  const resultReason = document.getElementById('ft-result-reason');
  const dots = document.querySelectorAll('.ft-dot');
  const btnContainer = document.getElementById('ft-btn-container');
  const resetBtn = document.getElementById('ft-reset-btn');

  function updateUI() {
    if (currentQ >= questions.length) {
      showResult();
      return;
    }
    const q = questions[currentQ];
    questionText.textContent = q.text;
    questionNum.textContent = `问题 ${currentQ + 1} / ${questions.length}`;
    dots.forEach((d, i) => {
      d.classList.remove('current', 'answered');
      if (i < currentQ) d.classList.add('answered');
      if (i === currentQ) d.classList.add('current');
    });
    btnContainer.style.display = 'flex';
    resultPanel.classList.remove('visible');
  }

  function answer(isYes) {
    answers.push(isYes);
    if (!isYes) {
      // Early termination — if any answer is No, no Fine-tune needed
      currentQ = questions.length;
      showResult();
      return;
    }
    currentQ++;
    updateUI();
  }

  function showResult() {
    btnContainer.style.display = 'none';
    dots.forEach(d => { d.classList.remove('current'); d.classList.add('answered'); });

    const allYes = answers.length === questions.length && answers.every(a => a);
    if (allYes) {
      resultIcon.textContent = '🎯';
      resultText.textContent = '是的, 你需要 Fine-tune!';
      resultText.style.color = 'var(--green)';
      resultReason.textContent = '4 个条件全部满足: 试过 Prompt → 问题是风格 → 有数据 → 已 PMF. 可以启动微调.';
      resultPanel.style.background = 'var(--green-bg-soft)';
      resultPanel.style.border = '2px solid var(--green)';
    } else {
      const stoppedAt = answers.length;
      const q = questions[stoppedAt - 1];
      resultIcon.textContent = '✋';
      resultText.textContent = '暂时不需要 Fine-tune';
      resultText.style.color = 'var(--amber)';
      resultReason.textContent = q.helpNo + ' 建议: 先用 Prompt-only 或 RAG 解决.';
      resultPanel.style.background = 'var(--amber-bg-soft)';
      resultPanel.style.border = '2px solid var(--amber)';
    }
    resultPanel.classList.add('visible');
    questionText.textContent = allYes ? '所有条件满足!' : '在问题 ' + answers.length + ' 处停下';
    questionNum.textContent = '检查完毕';
  }

  function reset() {
    currentQ = 0;
    answers = [];
    updateUI();
  }

  yesBtn.addEventListener('click', () => answer(true));
  noBtn.addEventListener('click', () => answer(false));
  resetBtn.addEventListener('click', reset);

  updateUI();
})();
