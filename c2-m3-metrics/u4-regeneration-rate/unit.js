/* U4 · Regeneration Rate — Regen Tracker widget */
(() => {
  'use strict';

  const responses = [
    '根据你的身体状态, 今天建议做30分钟瑜伽, 强度保持在中等偏低. 可以重点做一些髋部打开的动作.',
    '建议今天做20分钟快走, 配合5分钟拉伸. 你目前处于经期第2天, 避免剧烈运动.',
    '今天适合做一些轻柔的普拉提, 时长20-30分钟. 重点关注核心稳定性训练.',
    '推荐你做15分钟的冥想+10分钟的温和拉伸. 你昨晚睡眠不足, 不建议高强度运动.',
    '今天试试游泳吧! 30分钟中等强度, 对关节友好, 适合你当前的身体状态.',
    '建议做一组简单的居家力量训练: 深蹲15个×3组, 平板支撑30秒×3组, 弓步蹲10个×3组.',
  ];

  let regenCount = 0;
  let totalQuestions = 0;
  let currentResponseIdx = 0;

  const outputEl = document.getElementById('regen-output');
  const regenBtn = document.getElementById('regen-btn');
  const acceptBtn = document.getElementById('regen-accept');
  const resetBtn = document.getElementById('regen-reset');
  const countEl = document.getElementById('regen-count');
  const totalEl = document.getElementById('regen-total');
  const rateEl = document.getElementById('regen-rate');
  const barFill = document.getElementById('regen-bar-fill');
  const commentary = document.getElementById('regen-commentary');

  if (!outputEl) return;

  function showResponse() {
    outputEl.style.opacity = '0';
    setTimeout(() => {
      outputEl.innerHTML = `<div class="regen-prompt-label">AI 运动建议 (第 ${currentResponseIdx + 1} 版)</div><p>${responses[currentResponseIdx % responses.length]}</p>`;
      outputEl.style.opacity = '1';
    }, 200);
  }

  function updateStats() {
    countEl.textContent = regenCount;
    totalEl.textContent = totalQuestions;
    const rate = totalQuestions > 0 ? Math.round((regenCount / (regenCount + totalQuestions)) * 100) : 0;
    rateEl.textContent = rate + '%';

    if (rate <= 15) { rateEl.style.color = 'var(--green)'; }
    else if (rate <= 30) { rateEl.style.color = 'var(--amber)'; }
    else { rateEl.style.color = 'var(--red)'; }

    barFill.style.width = Math.min(rate, 100) + '%';
    barFill.textContent = rate + '%';

    if (regenCount === 0) commentary.textContent = '还没有重新生成过. 试试点 "换一个" 看看.';
    else if (regenCount === 1) commentary.textContent = '1 次重新生成 — 正常, 用户可能想看看别的选项.';
    else if (regenCount === 2) commentary.textContent = '2 次了 — 开始说明用户对 AI 输出不太满意.';
    else if (regenCount === 3) commentary.textContent = '3 次! 这是明显的隐式拒绝信号. 需要关注输出质量.';
    else commentary.textContent = `${regenCount} 次重新生成 — 强烈不满信号! 等于用户在说 "你给的全不行".`;
  }

  regenBtn?.addEventListener('click', () => {
    regenCount++;
    currentResponseIdx++;
    showResponse();
    updateStats();
  });

  acceptBtn?.addEventListener('click', () => {
    totalQuestions++;
    currentResponseIdx = 0;
    regenCount = Math.max(0, regenCount); // keep regen count
    showResponse();
    updateStats();
    commentary.textContent = `采纳了! 当前 Regen Rate: ${totalQuestions > 0 ? Math.round((regenCount / (regenCount + totalQuestions)) * 100) : 0}%`;
  });

  resetBtn?.addEventListener('click', () => {
    regenCount = 0;
    totalQuestions = 0;
    currentResponseIdx = 0;
    showResponse();
    updateStats();
  });

  showResponse();
  updateStats();
})();
