/* U5 · Refusal Rate Tuner widget */
(() => {
  'use strict';

  const slider = document.getElementById('refusal-slider');
  const valEl = document.getElementById('refusal-val');
  const riskEl = document.getElementById('refusal-risk');
  const benefitEl = document.getElementById('refusal-benefit');
  const verdictEl = document.getElementById('refusal-verdict');

  if (!slider) return;

  const zones = [
    { max: 5,  val: 'var(--red)',   risk: '幻觉泛滥: AI 对什么问题都回答, 即使完全不知道. 用户会收到大量错误信息.', benefit: '用户体验流畅, 永远能得到回答.', verdict: '危险! AI 在乱答. 健康产品绝对不能这样.', verdictBg: 'var(--red-bg)', verdictColor: 'var(--red)' },
    { max: 10, val: 'var(--amber)', risk: '仍然偏低. AI 在不确定的领域强行回答, 幻觉风险高.', benefit: '大部分问题都有回答, 用户很少遇到 "我不知道".', verdict: '偏低. 需要加强 safety guardrails.', verdictBg: 'var(--amber-bg)', verdictColor: 'var(--amber)' },
    { max: 20, val: 'var(--green)', risk: '可控范围. AI 对真正不确定的问题说 "我不确定", 其余正常回答.', benefit: '平衡了安全性和可用性. 用户偶尔看到拒答, 但理解原因.', verdict: '甜蜜区间! 健康产品推荐 10-20%.', verdictBg: 'var(--green-bg)', verdictColor: 'var(--green)' },
    { max: 35, val: 'var(--amber)', risk: '拒答开始影响体验. 用户经常被告知 "我无法回答这个问题".', benefit: '安全性好. AI 不会给出错误的健康建议.', verdict: '偏高. 安全但体验变差, 用户可能流失.', verdictBg: 'var(--amber-bg)', verdictColor: 'var(--amber)' },
    { max: 60, val: 'var(--red)',   risk: '过度拒答. 用户问正常问题也经常被拒. 功能形同虚设.', benefit: '极度安全. 永远不会出错误信息.', verdict: '太高! AI 几乎什么都不答, 等于没有这个功能.', verdictBg: 'var(--red-bg)', verdictColor: 'var(--red)' },
    { max: 100, val: 'var(--red)',  risk: '完全拒答. AI 变成了一个只会说 "我不知道" 的机器人.', benefit: '100% 安全... 因为什么都没说.', verdict: '荒谬. 这不叫 AI 产品, 这叫占位符.', verdictBg: 'var(--red-bg)', verdictColor: 'var(--red)' },
  ];

  function update() {
    const v = parseInt(slider.value, 10);
    valEl.textContent = v + '%';

    const zone = zones.find(z => v <= z.max) || zones[zones.length - 1];
    valEl.style.color = zone.val;
    riskEl.innerHTML = `<h4>风险</h4><p>${zone.risk}</p>`;
    benefitEl.innerHTML = `<h4>好处</h4><p>${zone.benefit}</p>`;
    verdictEl.textContent = zone.verdict;
    verdictEl.style.background = zone.verdictBg;
    verdictEl.style.color = zone.verdictColor;
  }

  slider.addEventListener('input', update);
  update();
})();
