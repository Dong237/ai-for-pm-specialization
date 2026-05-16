/* U2 · 三大类 AI 指标 — Metric Category Sorter widget */
(() => {
  'use strict';

  const metrics = [
    { name: 'Acceptance Rate',     cat: 'quality' },
    { name: 'Hallucination Rate',  cat: 'quality' },
    { name: 'Refusal Rate',        cat: 'quality' },
    { name: 'Regen Rate',          cat: 'quality' },
    { name: 'Feature Adoption %',  cat: 'adoption' },
    { name: 'Task Completion Rate',cat: 'adoption' },
    { name: 'Active AI Users',     cat: 'adoption' },
    { name: 'Time to Value',       cat: 'adoption' },
    { name: 'Cost per Query',      cat: 'cost' },
    { name: 'Cost per Task',       cat: 'cost' },
    { name: 'Token Efficiency',    cat: 'cost' },
    { name: 'API Spend / MAU',     cat: 'cost' },
  ];

  // Shuffle metrics
  const shuffled = [...metrics].sort(() => Math.random() - 0.5);

  const bank = document.getElementById('sorter-bank');
  const colQ = document.getElementById('col-quality');
  const colA = document.getElementById('col-adoption');
  const colC = document.getElementById('col-cost');
  const scoreEl = document.getElementById('sorter-score');
  const resetBtn = document.getElementById('sorter-reset');

  if (!bank || !colQ || !colA || !colC) return;

  let selected = null;
  let correct = 0;
  let attempts = 0;

  function init() {
    bank.innerHTML = '';
    colQ.innerHTML = '';
    colA.innerHTML = '';
    colC.innerHTML = '';
    correct = 0;
    attempts = 0;
    selected = null;
    scoreEl.textContent = '';

    const order = [...metrics].sort(() => Math.random() - 0.5);
    order.forEach((m, i) => {
      const chip = document.createElement('span');
      chip.className = 'sorter-chip';
      chip.textContent = m.name;
      chip.dataset.cat = m.cat;
      chip.dataset.idx = i;
      chip.addEventListener('click', () => selectChip(chip));
      bank.appendChild(chip);
    });
  }

  function selectChip(chip) {
    if (chip.classList.contains('placed')) return;
    // Deselect previous
    bank.querySelectorAll('.sorter-chip').forEach(c => c.style.outline = '');
    chip.style.outline = '3px solid var(--blue)';
    selected = chip;
  }

  function placeInColumn(col, catName) {
    if (!selected) return;
    const isCorrect = selected.dataset.cat === catName;
    attempts++;
    if (isCorrect) correct++;

    const sorted = document.createElement('div');
    sorted.className = 'sorted-chip ' + (isCorrect ? 'correct' : 'wrong');
    sorted.textContent = selected.textContent + (isCorrect ? ' ✓' : ' ✗');
    col.appendChild(sorted);

    selected.classList.add('placed');
    selected.style.outline = '';
    selected = null;

    // Check if done
    const total = metrics.length;
    if (attempts >= total) {
      scoreEl.textContent = `${correct} / ${total} 正确!` + (correct >= 10 ? ' 太棒了!' : correct >= 7 ? ' 不错!' : ' 再试一次?');
      scoreEl.style.color = correct >= 10 ? 'var(--green)' : correct >= 7 ? 'var(--amber)' : 'var(--red)';
    }
  }

  // Column click handlers
  document.getElementById('zone-quality')?.addEventListener('click', () => placeInColumn(colQ, 'quality'));
  document.getElementById('zone-adoption')?.addEventListener('click', () => placeInColumn(colA, 'adoption'));
  document.getElementById('zone-cost')?.addEventListener('click', () => placeInColumn(colC, 'cost'));

  resetBtn?.addEventListener('click', init);
  init();

})();
