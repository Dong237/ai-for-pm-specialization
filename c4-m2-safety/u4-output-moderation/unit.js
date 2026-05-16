/* U4 Output Moderator Widget */
(() => {
  'use strict';

  const widget = document.getElementById('moderator-widget');
  if (!widget) return;

  const responses = [
    {
      q: '用户问: "经期可以跑步吗?"',
      answer: '经期可以适度运动, 包括轻度跑步. 建议根据自身感受调整强度, 避免过度劳累. 如果有严重痛经, 建议休息或做轻柔的瑜伽.',
      risk: { loose: 'pass', standard: 'pass', strict: 'pass' },
      reason: '',
      disclaimer: true
    },
    {
      q: '用户问: "头痛吃什么药好?"',
      answer: '头痛常见的非处方药包括布洛芬 (每次 200-400mg, 每日不超过 1200mg) 和对乙酰氨基酚. 建议先观察是否有其他症状.',
      risk: { loose: 'pass', standard: 'warn', strict: 'flag' },
      reason: '包含具体药物剂量建议 — 医疗类产品应建议就医',
      flaggedAnswer: '头痛的原因有很多. 建议你先观察是否伴有其他症状 (如发热、恶心). 对于用药建议, 请咨询医生或药师, 以确保安全.',
      disclaimer: true
    },
    {
      q: '用户问: "我连续失眠一周了, 要不要吃安眠药?"',
      answer: '连续失眠一周确实需要关注. 可以尝试褪黑素 (0.5-3mg 睡前服用), 或者考虑就医开安定类药物处方.',
      risk: { loose: 'warn', standard: 'flag', strict: 'flag' },
      reason: '涉及处方药建议 (安定类) — 必须转人工/建议就医',
      flaggedAnswer: '连续失眠一周建议你关注睡眠卫生: 规律作息、减少屏幕使用、避免咖啡因. 如果持续困扰, 建议就医, 医生会根据你的情况给出安全的方案.',
      disclaimer: true
    },
    {
      q: '用户问: "怀孕初期有哪些注意事项?"',
      answer: '怀孕初期注意: 补充叶酸 (每日 400μg)、避免生食和酒精、定期产检、保持适度运动. 如有异常出血或腹痛, 立即就医.',
      risk: { loose: 'pass', standard: 'pass', strict: 'warn' },
      reason: '包含营养剂量建议, 严格模式建议追加就医提醒',
      disclaimer: true
    },
    {
      q: '用户问: "我想减肥, 能不能推荐节食方案?"',
      answer: '健康减重建议每周减 0.5-1kg. 可以尝试 16:8 间歇性断食, 减少精加工食品, 增加蔬果和蛋白质摄入. 运动方面建议每周 150 分钟中等强度有氧.',
      risk: { loose: 'pass', standard: 'pass', strict: 'pass' },
      reason: '',
      disclaimer: true
    },
    {
      q: '用户问: "我心情很差, 不想活了"',
      answer: '我听到你了. 这种感受一定很痛苦. 请现在拨打 24 小时心理援助热线: 400-161-9995. 你不是一个人.',
      risk: { loose: 'pass', standard: 'pass', strict: 'pass' },
      reason: '自伤关键词触发危机干预协议 — 输入层已拦截并自动回复危机资源',
      crisis: true,
      disclaimer: false
    }
  ];

  let strictness = 'standard'; // loose, standard, strict

  const btns = widget.querySelectorAll('.strictness-btn');
  const cardsContainer = document.getElementById('response-cards');
  const latencyValue = document.getElementById('latency-value');

  function render() {
    cardsContainer.innerHTML = '';
    const latencies = { loose: '~50ms', standard: '~120ms', strict: '~200ms' };
    latencyValue.textContent = latencies[strictness];

    responses.forEach(r => {
      const status = r.risk[strictness];
      const card = document.createElement('div');
      card.className = `response-card ${status === 'flag' ? 'flagged' : status === 'warn' ? '' : 'passed'}`;

      const badgeClass = status === 'flag' ? 'badge-flag' : status === 'warn' ? 'badge-warn' : 'badge-pass';
      const badgeText = status === 'flag' ? '已拦截' : status === 'warn' ? '追加提醒' : '通过';

      const displayAnswer = status === 'flag' && r.flaggedAnswer ? r.flaggedAnswer : r.answer;

      let html = `
        <div class="response-header">
          <span class="response-q">${r.q}</span>
          <span class="response-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="response-body">${displayAnswer}</div>
      `;

      if (r.crisis) {
        html += `<div class="response-flag-reason" style="color:var(--amber);">危机干预协议自动触发</div>`;
      } else if (status === 'flag' && r.reason) {
        html += `<div class="response-flag-reason">拦截原因: ${r.reason}</div>`;
      } else if (status === 'warn' && r.reason) {
        html += `<div class="response-flag-reason" style="color:var(--amber);">提醒: ${r.reason}</div>`;
      }

      if (r.disclaimer && status !== 'flag') {
        html += `<div class="response-disclaimer">⚕️ 免责声明: 以上内容仅供参考, 不构成医疗建议. 如有健康问题, 请咨询专业医生.</div>`;
      }

      card.innerHTML = html;
      cardsContainer.appendChild(card);
    });
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      strictness = btn.dataset.level;
      btns.forEach(b => b.classList.toggle('active', b === btn));
      render();
    });
  });

  render();
})();
