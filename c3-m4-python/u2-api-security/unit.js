/* Unit 2 — Security Quiz Widget */
(() => {
  'use strict';

  const quiz = document.getElementById('security-quiz');
  if (!quiz) return;

  const scenarios = quiz.querySelectorAll('.sq-scenario');
  const scoreEl = document.getElementById('sq-score');
  let correct = 0;
  let answered = 0;
  const total = scenarios.length;

  scenarios.forEach(sc => {
    const answer = sc.dataset.answer; // 'safe' or 'unsafe'
    const safeBtn = sc.querySelector('.sq-btn-safe');
    const unsafeBtn = sc.querySelector('.sq-btn-unsafe');
    const feedback = sc.querySelector('.sq-feedback');

    function handleAnswer(chosen) {
      safeBtn.disabled = true;
      unsafeBtn.disabled = true;
      answered++;

      if (chosen === answer) {
        correct++;
        sc.classList.add('answered-' + answer);
        feedback.className = 'sq-feedback correct';
        feedback.textContent = '\u2713 ' + sc.dataset.explain;
      } else {
        sc.classList.add('wrong');
        feedback.className = 'sq-feedback incorrect';
        feedback.textContent = '\u2717 ' + sc.dataset.explain;
      }
      feedback.style.display = 'block';
      scoreEl.innerHTML = '<span class="sq-score-num">' + correct + '</span> / ' + total + ' 答对';

      if (answered === total) {
        const msg = correct === total
          ? ' \u2014 满分! 你的安全意识很强!'
          : correct >= 3
            ? ' \u2014 不错, 但要注意错的那几个!'
            : ' \u2014 建议重新看一遍 Step 3-5.';
        scoreEl.innerHTML += msg;
      }
    }

    safeBtn.addEventListener('click', () => handleAnswer('safe'));
    unsafeBtn.addEventListener('click', () => handleAnswer('unsafe'));
  });
})();
