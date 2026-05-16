/* U6 · Safety Checklist — toggle "don'ts", see coverage % */
(() => {
  'use strict';
  const rules = document.querySelectorAll('.safety-rule');
  const scoreFill = document.getElementById('safety-fill');
  const scoreValue = document.getElementById('safety-value');
  const hint = document.getElementById('safety-hint');
  if (!rules.length) return;

  rules.forEach(rule => {
    rule.addEventListener('click', () => {
      rule.classList.toggle('active');
      updateScore();
    });
  });

  function updateScore() {
    const total = rules.length;
    const active = document.querySelectorAll('.safety-rule.active').length;
    const pct = Math.round((active / total) * 100);
    if (scoreFill) { scoreFill.style.width = pct + '%'; scoreFill.style.background = pct < 50 ? 'var(--red)' : pct < 80 ? 'var(--amber)' : 'var(--green)'; }
    if (scoreValue) { scoreValue.textContent = pct + '%'; scoreValue.style.color = pct < 50 ? 'var(--red)' : pct < 80 ? 'var(--amber)' : 'var(--green)'; }
    if (hint) {
      if (pct === 100) hint.textContent = '完美! 所有安全规则都已启用. Vitamin 的第一道防线已就位.';
      else if (pct >= 70) hint.textContent = '不错, 但还有一些重要的规则没有启用. 点击激活它们.';
      else hint.textContent = '安全覆盖率较低. 健康类产品至少需要覆盖 80% 以上的安全规则.';
    }
  }
  updateScore();
})();
