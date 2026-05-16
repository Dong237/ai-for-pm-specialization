/* U8: Handoff Simulator Widget */
(() => {
  'use strict';
  const widget = document.getElementById('handoff-sim');
  if (!widget) return;

  const contextFields = [
    { id: 'user_id', label: 'user_id: "u_12345"', essential: true },
    { id: 'cycle_phase', label: 'cycle_phase: "黄体期"', essential: true },
    { id: 'cycle_day', label: 'cycle_day: 22', essential: false },
    { id: 'mood', label: 'current_mood: "有点烦躁"', essential: true },
    { id: 'diet_today', label: 'diet_today: ["燕麦", "牛奶"]', essential: false },
    { id: 'allergies', label: 'allergies: ["花生"]', essential: true },
    { id: 'prev_advice', label: 'previous_advice: "多补充镁"', essential: false },
    { id: 'conversation_summary', label: 'conversation_summary: "用户因PMS不适来咨询"', essential: true }
  ];

  const responses = {
    8: { quality: 'good', label: '完整上下文', text: '因为你现在是黄体期第22天, 而且花生过敏, 我推荐你试试菠菜豆腐汤 — 富含镁, 有助于缓解你说的烦躁感. 之前周期Agent建议多补充镁, 我们就从食物补起! 另外今天已经吃了燕麦和牛奶, 晚上可以加个深绿色蔬菜.' },
    6: { quality: 'degraded', label: '部分丢失', text: '根据你的情况, 建议吃一些富含镁的食物, 比如坚果和深绿色蔬菜. 今天可以试试...(注意: 缺少过敏信息, 可能推荐了花生类食物; 缺少之前的建议, 可能重复给建议)' },
    4: { quality: 'degraded', label: '严重丢失', text: '你好! 推荐一些健康的饮食建议: 多吃水果蔬菜, 保持均衡饮食...(注意: 完全变成了泛泛而谈的通用建议, 没有任何个性化)' },
    2: { quality: 'bad', label: '几乎全丢', text: '你好, 请问你有什么饮食方面的问题吗?(注意: Agent完全不知道用户的状况, 相当于新对话, 用户需要把所有信息重复一遍)' }
  };

  let included = new Set(contextFields.map(f => f.id));

  const fieldsEl = document.getElementById('context-fields');
  const responseEl = document.getElementById('handoff-response');
  const qualityDot = document.getElementById('quality-dot');
  const qualityLabel = document.getElementById('quality-label');
  const responseText = document.getElementById('response-text');
  const responseArea = document.getElementById('response-area');

  function render() {
    if (!fieldsEl) return;
    fieldsEl.innerHTML = '';
    contextFields.forEach(f => {
      const el = document.createElement('div');
      const isIn = included.has(f.id);
      el.className = `context-field ${isIn ? 'included' : 'excluded'}`;
      el.innerHTML = `<span class="context-toggle">${isIn ? '✓' : '✗'}</span><span>${f.label}</span>`;
      el.addEventListener('click', () => {
        if (isIn) included.delete(f.id);
        else included.add(f.id);
        render();
        updateResponse();
      });
      fieldsEl.appendChild(el);
    });
  }

  function updateResponse() {
    const count = included.size;
    let resp;
    if (count >= 7) resp = responses[8];
    else if (count >= 5) resp = responses[6];
    else if (count >= 3) resp = responses[4];
    else resp = responses[2];

    if (qualityDot) qualityDot.className = `quality-dot ${resp.quality}`;
    if (qualityLabel) { qualityLabel.className = `quality-label ${resp.quality}`; qualityLabel.textContent = resp.label + ` (${count}/${contextFields.length} 字段)`; }
    if (responseText) responseText.textContent = resp.text;
    if (responseArea) responseArea.className = `response-area ${resp.quality === 'good' ? '' : resp.quality}`;
  }

  render();
  updateResponse();
})();
