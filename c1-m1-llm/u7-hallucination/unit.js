/* ===========================================
   Unit 7 · 幻觉 (Hallucination)
   — Confidence vs Correctness Quiz
   ===========================================
   Shows 6 AI-generated health/science statements.
   User guesses real or hallucinated.
   Reveals: AI says everything with equal confidence.
*/

(() => {
  'use strict';

  // ---- Quiz data ----
  // Each item: statement, source attribution, isReal, fakeConfidence, explanation
  const QUIZ_DATA = [
    {
      statement: '成年人每天需要大约 7-9 小时的睡眠来维持最佳健康状态，长期睡眠不足会增加心血管疾病风险。',
      source: '— 基于 National Sleep Foundation 建议',
      isReal: true,
      confidence: 96,
      explain: '真实. National Sleep Foundation 确实建议成年人每晚 7-9 小时. 这是被广泛引用的循证建议, 训练数据里出现了无数次.'
    },
    {
      statement: '2019 年《Nature Medicine》发表的一项研究表明，每天饮用 500ml 芹菜汁可以降低 47% 的乳腺癌风险。',
      source: '— Chen, L. et al., Nature Medicine, 2019; 25(4): 812-819',
      isReal: false,
      confidence: 94,
      explain: '幻觉. 这篇论文不存在. 作者名、期刊、卷号、页码全部是 AI 编造的. 格式看起来很专业, 但没有一个细节是真的. 这是典型的 "编造引用" 幻觉.'
    },
    {
      statement: '世界卫生组织建议成年人每周至少进行 150 分钟中等强度有氧运动，或 75 分钟高强度运动。',
      source: '— WHO Guidelines on Physical Activity, 2020',
      isReal: true,
      confidence: 97,
      explain: '真实. WHO 2020 年发布的运动指南确实给出了这个建议 (150 分钟中等强度 / 75 分钟高强度). 这是全球公共卫生领域的基础知识.'
    },
    {
      statement: '根据 2022 年 MIT 和哈佛联合研究, 女性在月经周期黄体期的基础代谢率会升高 23.7%, 因此该阶段可以多摄入约 340 大卡。',
      source: '— Hoffman & Patel, Journal of Metabolic Health, 2022',
      isReal: false,
      confidence: 93,
      explain: '幻觉. 黄体期代谢率确实会略微升高, 这是真的. 但 "23.7%" 和 "340 大卡" 这两个精确数字是 AI 编造的, 引用的期刊和作者也不存在. 这种 "半真半假" 的幻觉最危险.'
    },
    {
      statement: '维生素 D 缺乏在全球范围内普遍存在, 估计影响约 10 亿人, 与骨质疏松、免疫功能下降等健康问题相关。',
      source: '— Holick, M.F., NEJM, 2007',
      isReal: true,
      confidence: 95,
      explain: '真实. Holick 2007 年在 NEJM 发表的综述确实讨论了维生素 D 缺乏的全球流行情况, "约 10 亿人" 是被广泛引用的估计数字.'
    },
    {
      statement: 'Stanford 大学 2023 年发布的 Menstrual Health Index (MHI) 将经期疼痛分为 7 个等级, 目前已被 FDA 采纳为临床标准。',
      source: '— Stanford Digital Health Lab, 2023 Annual Report',
      isReal: false,
      confidence: 95,
      explain: '幻觉. "Menstrual Health Index" 不存在, Stanford 没有发布过这个指数, FDA 也没有采纳过. 但注意 AI 给出了具体机构名、年份和 "7 个等级" 这样的细节 — 全是编的.'
    }
  ];

  // ---- DOM references ----
  const container = document.getElementById('quiz-container');
  if (!container) return;

  const progressText = document.getElementById('quiz-progress-text');
  const progressFill = document.getElementById('quiz-progress-fill');
  const summaryEl = document.getElementById('quiz-summary');
  const scoreEl = document.getElementById('quiz-score');
  const takeawayEl = document.getElementById('quiz-takeaway');
  const resetBtn = document.getElementById('quiz-reset');

  let answered = 0;
  let correctCount = 0;

  // ---- Build quiz cards ----
  function buildCards() {
    container.innerHTML = '';
    answered = 0;
    correctCount = 0;
    updateProgress();
    summaryEl.classList.remove('visible');

    QUIZ_DATA.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'quiz-card';
      card.dataset.index = idx;

      // Statement
      const stmt = document.createElement('p');
      stmt.className = 'quiz-statement';
      stmt.textContent = (idx + 1) + '. ' + item.statement;

      // Source
      const src = document.createElement('p');
      src.className = 'quiz-source';
      src.textContent = item.source;

      // Confidence (hidden until answered)
      const conf = document.createElement('div');
      conf.className = 'quiz-confidence';
      const confBar = document.createElement('span');
      confBar.className = 'confidence-bar';
      confBar.style.width = '0px';
      confBar.style.background = item.confidence >= 95 ? 'var(--red)' : 'var(--amber)';
      conf.innerHTML = 'AI 置信度: <strong>' + item.confidence + '%</strong>';
      conf.appendChild(confBar);

      // Buttons
      const btns = document.createElement('div');
      btns.className = 'quiz-buttons';

      const btnReal = document.createElement('button');
      btnReal.className = 'quiz-btn quiz-btn-real';
      btnReal.textContent = '真实 \u2713';
      btnReal.addEventListener('click', () => handleAnswer(card, idx, true));

      const btnFake = document.createElement('button');
      btnFake.className = 'quiz-btn quiz-btn-fake';
      btnFake.textContent = '幻觉 \u2717';
      btnFake.addEventListener('click', () => handleAnswer(card, idx, false));

      btns.appendChild(btnReal);
      btns.appendChild(btnFake);

      // Result tag
      const tag = document.createElement('div');
      tag.className = 'quiz-result-tag';

      // Explanation
      const explain = document.createElement('div');
      explain.className = 'quiz-explain';
      explain.textContent = item.explain;

      card.appendChild(stmt);
      card.appendChild(src);
      card.appendChild(conf);
      card.appendChild(btns);
      card.appendChild(tag);
      card.appendChild(explain);
      container.appendChild(card);
    });
  }

  // ---- Handle answer ----
  function handleAnswer(card, idx, userSaysReal) {
    if (card.classList.contains('answered')) return;

    const item = QUIZ_DATA[idx];
    const isCorrect = (userSaysReal === item.isReal);

    card.classList.add('answered');
    card.classList.add(isCorrect ? 'correct' : 'incorrect');

    // Result tag
    const tag = card.querySelector('.quiz-result-tag');
    if (isCorrect) {
      tag.textContent = '\u2713';
      tag.style.color = 'var(--green)';
      correctCount++;
    } else {
      tag.textContent = '\u2717';
      tag.style.color = 'var(--red)';
    }

    // Animate confidence bar
    const confBar = card.querySelector('.confidence-bar');
    requestAnimationFrame(() => {
      confBar.style.width = item.confidence + 'px';
    });

    answered++;
    updateProgress();

    // All done?
    if (answered === QUIZ_DATA.length) {
      showSummary();
    }
  }

  // ---- Update progress ----
  function updateProgress() {
    const total = QUIZ_DATA.length;
    progressText.textContent = answered + ' / ' + total + ' 已回答';
    progressFill.style.width = (answered / total * 100) + '%';
  }

  // ---- Show summary ----
  function showSummary() {
    const total = QUIZ_DATA.length;
    scoreEl.textContent = '得分: ' + correctCount + ' / ' + total;

    let takeaway = '';
    if (correctCount === total) {
      takeaway = '满分! 你已经对幻觉有很好的直觉了. 但注意 — 即使你做对了, 每条声明的 AI 置信度都在 93% 以上. AI 说真话和说假话时, 语气没有任何区别.';
    } else if (correctCount >= total - 2) {
      takeaway = '不错! 但你注意到了吗 — 你判断错误的那些, AI 说起来和真的一样自信. 置信度都在 93%+. 这就是幻觉最危险的地方: 你无法从语气判断真假.';
    } else {
      takeaway = '这正好说明了幻觉的危险性 — 连人类都很难分辨! 每条声明的 AI 置信度都在 93% 以上, 无论真假. AI 不会因为在编造就 "心虚", 因为它根本不知道自己在编造.';
    }
    takeawayEl.textContent = takeaway;
    summaryEl.classList.add('visible');

    // Scroll to summary
    setTimeout(() => {
      summaryEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  // ---- Reset ----
  if (resetBtn) {
    resetBtn.addEventListener('click', buildCards);
  }

  // ---- Initialize ----
  buildCards();

})();
