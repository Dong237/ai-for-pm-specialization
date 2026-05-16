/* ===========================================
   Unit 7 · "70% 准确率" 上线门槛
   Interactive: Accuracy Threshold Slider
   =========================================== */

(() => {
  'use strict';

  // ---- Scenario cards data ----
  const scenarios = [
    { name: '内容推荐',   icon: '📰', threshold: 65, why: '错了 → 用户跳过' },
    { name: '聊天陪伴',   icon: '💬', threshold: 70, why: '错了 → 有点尴尬' },
    { name: '情绪分类',   icon: '😊', threshold: 75, why: '错了 → 体验变差' },
    { name: '饮食建议',   icon: '🥗', threshold: 80, why: '错了 → 可能不适' },
    { name: '健康建议',   icon: '💊', threshold: 90, why: '错了 → 影响健康' },
    { name: '症状评估',   icon: '🩺', threshold: 92, why: '错了 → 延误就医' },
    { name: '药物交互',   icon: '⚠️', threshold: 95, why: '错了 → 有危险' },
    { name: '紧急转诊',   icon: '🚑', threshold: 99, why: '错了 → 可能致命' },
  ];

  const slider = document.getElementById('acc-slider');
  const valueEl = document.getElementById('acc-value');
  const gridEl = document.getElementById('tw-grid');
  const countGreen = document.getElementById('tw-count-green');
  const countRed = document.getElementById('tw-count-red');
  const tipEl = document.getElementById('tw-tip');

  if (!slider || !gridEl) return;

  // ---- Build cards ----
  scenarios.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'tw-card';
    card.dataset.threshold = s.threshold;
    card.dataset.index = i;
    card.innerHTML = `
      <div class="tw-card-status"></div>
      <div class="tw-card-icon">${s.icon}</div>
      <div class="tw-card-name">${s.name}</div>
      <div class="tw-card-req">需要 ≥${s.threshold}%</div>
      <div style="font-size:11px;color:var(--ink-muted);margin-top:4px;">${s.why}</div>
    `;
    gridEl.appendChild(card);
  });

  const cards = gridEl.querySelectorAll('.tw-card');

  // ---- Tips for different accuracy levels ----
  const tips = [
    { max: 60,  text: '50-60%: 跟随机猜差不多, 几乎没有功能能上线.' },
    { max: 70,  text: '60-70%: 只有最低风险的内容推荐勉强可以上.' },
    { max: 75,  text: '70-75%: 内容推荐和简单聊天可以上线了.' },
    { max: 80,  text: '75-80%: 情绪分类等中等风险功能开始可用.' },
    { max: 85,  text: '80-85%: 大部分非医疗功能可以上线.' },
    { max: 90,  text: '85-90%: 饮食建议也能上了, 但健康相关还差一点.' },
    { max: 95,  text: '90-95%: 连健康建议都可以上了! 但药物相关还不够.' },
    { max: 99,  text: '95-99%: 只有紧急转诊还需要更高准确率 (或用规则).' },
    { max: 101, text: '99-100%: 所有功能都可以上线! 但现实中几乎不可能达到.' },
  ];

  function update() {
    const val = parseInt(slider.value, 10);
    valueEl.textContent = val + '%';

    let greenCount = 0;
    let redCount = 0;

    cards.forEach(card => {
      const thresh = parseInt(card.dataset.threshold, 10);
      const statusEl = card.querySelector('.tw-card-status');
      if (val >= thresh) {
        card.classList.add('tw-ok');
        card.classList.remove('tw-no');
        statusEl.textContent = '✓';
        greenCount++;
      } else {
        card.classList.add('tw-no');
        card.classList.remove('tw-ok');
        statusEl.textContent = '✗';
        redCount++;
      }
    });

    countGreen.textContent = greenCount;
    countRed.textContent = redCount;

    // Update tip
    const tip = tips.find(t => val < t.max) || tips[tips.length - 1];
    tipEl.textContent = tip.text;

    // Update slider color
    const pct = ((val - 50) / 50) * 100;
    slider.style.setProperty('--fill-pct', pct + '%');
  }

  slider.addEventListener('input', update);
  update();

})();
