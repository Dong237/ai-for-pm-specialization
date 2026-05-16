/* U4: Single Agent Stress Test Widget */
(() => {
  'use strict';
  const widget = document.getElementById('stress-test');
  if (!widget) return;

  const queries = [
    { text: '用户: "今天吃什么好?"', response: '建议多吃蔬菜水果, 搭配优质蛋白. 今天可以试试西兰花炒鸡胸肉.', quality: 'ok', stress: 15, issue: '简单问题, 单Agent轻松搞定' },
    { text: '用户: "我最近经期不太规律, 而且总觉得累, 饮食上该怎么调整?"', response: '经期不规律可能与压力、饮食有关. 建议补充铁和B族维生素, 多吃红枣、菠菜...', quality: 'ok', stress: 35, issue: '跨领域(周期+营养), 还行但回复比较泛' },
    { text: '用户: "帮我分析上周的饮食记录, 对比我的经期数据, 给出本周的个性化建议, 并帮我设置提醒"', response: '好的, 我来分析... [但模型没有访问历史数据的能力, 开始编造数据]. 你上周摄入了约1800大卡...', quality: 'degraded', stress: 60, issue: '需要调用工具(数据库+日历), 单Agent无法做到, 开始hallucinate' },
    { text: '用户: "我心情不好. 但我不想听大道理, 我想要温柔一点的回复. 同时告诉我能吃什么comfort food但不要太不健康的."', response: '我理解你现在心情不太好. [语气突然变成医学百科] 根据营养学研究, 以下食物有助于改善情绪: 1. 深海鱼类含Omega-3...', quality: 'degraded', stress: 80, issue: 'Persona冲突: 要求温柔但切换成了科普模式. 单Agent一个Prompt无法同时扮演多种角色' },
    { text: '用户: "综合我过去一个月的所有对话、我的身体数据、我的饮食记录、当前的天气和我的日程安排, 给我一个完整的今日健康方案"', response: '[模型开始出现重复内容, 逻辑混乱] 根据你的...根据你的...建议你...建议你多喝水...考虑到天气...[context overflow]', quality: 'fail', stress: 100, issue: 'Context overflow + 需要多工具协作 + 多步推理. 单Agent完全崩溃.' }
  ];

  let sentCount = 0;
  const stressFill = document.getElementById('stress-fill');
  const stressText = document.getElementById('stress-text');
  const queryList = document.getElementById('query-list');
  const resetBtn = document.getElementById('stress-reset');

  function render() {
    if (!queryList) return;
    queryList.innerHTML = '';
    queries.forEach((q, i) => {
      const item = document.createElement('div');
      item.className = 'query-item' + (i < sentCount ? (q.quality === 'fail' ? ' failed' : ' sent') : '');
      item.innerHTML = `
        <div class="query-text">${q.text}${i < sentCount ? `<span class="query-tag ${q.quality}">${q.quality === 'ok' ? '正常' : q.quality === 'degraded' ? '质量下降' : '崩溃'}</span>` : ''}</div>
        <div class="query-response ${i < sentCount ? 'show' : ''}">${i < sentCount ? q.response + '<br/><em style="color:var(--amber);">→ ' + q.issue + '</em>' : ''}</div>
      `;
      if (i === sentCount) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => sendNext());
      }
      queryList.appendChild(item);
    });
    updateMeter();
  }

  function sendNext() {
    if (sentCount >= queries.length) return;
    sentCount++;
    render();
  }

  function updateMeter() {
    if (!stressFill) return;
    const q = sentCount > 0 ? queries[sentCount - 1] : { stress: 0 };
    const pct = sentCount > 0 ? q.stress : 0;
    stressFill.style.width = pct + '%';
    stressFill.className = 'stress-fill' + (pct > 70 ? ' high' : pct > 40 ? ' medium' : '');
    if (stressText) stressText.textContent = pct > 70 ? '过载!' : pct > 40 ? '吃力...' : pct > 0 ? '轻松' : '待命';
  }

  function reset() {
    sentCount = 0;
    render();
  }

  if (resetBtn) resetBtn.addEventListener('click', reset);
  render();
})();
