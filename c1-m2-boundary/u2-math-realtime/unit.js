/* =============================================
   Unit 2 · AI 死穴 1: 精确数学 + 实时数据
   AI vs Calculator Widget + BMI Comparison
   ============================================= */

(() => {
  'use strict';

  // ===== AI vs Calculator Showdown =====
  const problems = [
    {
      question: '17 × 24 = ?',
      aiAnswer: '408',
      realAnswer: '408',
      aiCorrect: true,
      verdict: 'AI 答对了! 因为训练数据中"17×24=408"出现过很多次, 它记住了模式.'
    },
    {
      question: '1,847 × 293 = ?',
      aiAnswer: '541,171',
      realAnswer: '541,171',
      aiCorrect: true,
      verdict: 'AI 答对了. 中等难度的乘法, 训练数据中可能见过类似的.'
    },
    {
      question: '184,729 × 73,921 = ?',
      aiAnswer: '13,657,843,209',
      realAnswer: '13,658,597,409',
      aiCorrect: false,
      verdict: '错了! AI 给出的数字看起来"差不多对", 但差了 754,200. 这种数额在财务中是灾难.'
    },
    {
      question: '√(7,849,362) = ?',
      aiAnswer: '2,801.67',
      realAnswer: '2,801.67',
      aiCorrect: true,
      verdict: 'AI 碰巧接近了. 但注意: 它不是在算, 是在猜一个"看起来合理的数字".'
    },
    {
      question: '3.7% × ¥184,500 的利息 = ?',
      aiAnswer: '¥6,826.50',
      realAnswer: '¥6,826.50',
      aiCorrect: true,
      verdict: 'AI 答对了. 但你敢用这个结果给用户做贷款计算吗? 下一次问同样的问题, 答案可能不同.'
    },
    {
      question: '身高 165cm, 体重 58kg 的 BMI = ?',
      aiAnswer: '21.5',
      realAnswer: '21.30',
      aiCorrect: false,
      verdict: '错了! BMI = 58 / 1.65² = 21.30, AI 给出 21.5. 看似接近, 但分类可能从"正常"变成不同区间.'
    }
  ];

  const container = document.getElementById('calc-problems');
  const revealAllBtn = document.getElementById('calc-reveal-all');
  const resetBtn = document.getElementById('calc-reset');
  const scoreEl = document.getElementById('calc-score');

  if (!container) return;

  let revealed = 0;

  function renderProblems() {
    container.innerHTML = '';
    revealed = 0;
    updateScore();

    problems.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = 'calc-problem';
      div.dataset.index = i;
      div.innerHTML = `
        <div class="calc-q">${p.question}</div>
        <div class="calc-answers">
          <div class="calc-ans ai-ans">
            <div class="calc-ans-label">🤖 AI 的回答</div>
            <div class="calc-ans-val hidden" data-val="${p.aiAnswer}">████████</div>
          </div>
          <div class="calc-ans real-ans">
            <div class="calc-ans-label">🧮 计算器的回答</div>
            <div class="calc-ans-val hidden" data-val="${p.realAnswer}">████████</div>
          </div>
        </div>
        <div class="calc-verdict"></div>
        <button class="btn btn-ghost calc-reveal-btn">揭晓 →</button>
      `;
      container.appendChild(div);

      const btn = div.querySelector('.calc-reveal-btn');
      btn.addEventListener('click', () => revealProblem(div, p));
    });
  }

  function revealProblem(div, p) {
    if (div.classList.contains('revealed')) return;
    div.classList.add('revealed');

    // Show answers
    const vals = div.querySelectorAll('.calc-ans-val');
    vals.forEach(v => {
      v.classList.remove('hidden');
      v.textContent = v.dataset.val;
    });

    // Show verdict
    const verdict = div.querySelector('.calc-verdict');
    if (p.aiCorrect) {
      verdict.className = 'calc-verdict right';
      verdict.textContent = '✓ ' + p.verdict;
      div.classList.add('is-right');
    } else {
      verdict.className = 'calc-verdict wrong';
      verdict.textContent = '✗ ' + p.verdict;
      div.classList.add('is-wrong');
    }

    // Hide button
    div.querySelector('.calc-reveal-btn').style.display = 'none';

    revealed++;
    updateScore();
  }

  function updateScore() {
    if (!scoreEl) return;
    const wrongCount = problems.filter(p => !p.aiCorrect).length;
    if (revealed === problems.length) {
      scoreEl.textContent = `结果: AI 在 ${problems.length} 题中答错了 ${wrongCount} 题. 你敢让它算你的工资吗?`;
      scoreEl.style.color = 'var(--red)';
    } else {
      scoreEl.textContent = `已揭晓 ${revealed} / ${problems.length}`;
    }
  }

  if (revealAllBtn) {
    revealAllBtn.addEventListener('click', () => {
      container.querySelectorAll('.calc-problem').forEach((div, i) => {
        if (!div.classList.contains('revealed')) {
          setTimeout(() => revealProblem(div, problems[i]), i * 200);
        }
      });
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', renderProblems);
  }

  renderProblems();

  // ===== BMI Calculator Comparison =====
  const heightInput = document.getElementById('bmi-height');
  const weightInput = document.getElementById('bmi-weight');
  const bmiCalcBtn = document.getElementById('bmi-calc-btn');
  const bmiAiVal = document.getElementById('bmi-ai-val');
  const bmiFormulaVal = document.getElementById('bmi-formula-val');

  if (!bmiCalcBtn) return;

  // Simulate AI's "approximation" (intentionally slightly wrong)
  function fakeAiBmi(h, w) {
    const real = w / ((h / 100) ** 2);
    // AI adds a small random-ish error
    const errors = [0.2, -0.3, 0.15, -0.25, 0.4, -0.1, 0.35];
    const errorIdx = Math.floor((h * w) % errors.length);
    return (real + errors[errorIdx]).toFixed(1);
  }

  function calcBmi() {
    const h = parseFloat(heightInput.value);
    const w = parseFloat(weightInput.value);

    if (!h || !w || h < 100 || h > 250 || w < 20 || w > 200) {
      bmiAiVal.textContent = '?';
      bmiFormulaVal.textContent = '?';
      return;
    }

    const realBmi = (w / ((h / 100) ** 2)).toFixed(2);
    const aiBmi = fakeAiBmi(h, w);

    // Animate AI "thinking"
    bmiAiVal.textContent = '...';
    bmiFormulaVal.textContent = '...';

    setTimeout(() => {
      bmiAiVal.textContent = aiBmi;
      bmiAiVal.style.color = aiBmi !== realBmi ? 'var(--red)' : 'var(--green)';
    }, 600);

    setTimeout(() => {
      bmiFormulaVal.textContent = realBmi;
      bmiFormulaVal.style.color = 'var(--green)';
    }, 300);
  }

  bmiCalcBtn.addEventListener('click', calcBmi);
  // Also calc on Enter
  [heightInput, weightInput].forEach(input => {
    if (input) input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') calcBmi();
    });
  });

})();
