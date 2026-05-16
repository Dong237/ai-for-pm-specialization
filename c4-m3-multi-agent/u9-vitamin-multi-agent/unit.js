/* U9: Multi-Agent Blueprint Widget */
(() => {
  'use strict';
  const widget = document.getElementById('blueprint');
  if (!widget) return;

  const components = {
    user: { name: '用户', desc: '发送自然语言消息. Vitamin 的最终用户 — 关注饮食、周期、情绪的女性用户.', color: 'ink-faint' },
    router: { name: 'Router (路由器)', desc: '混合路由: 关键词规则覆盖 70% 高频意图, GPT-4o-mini 处理剩余 30%. Confidence < 0.7 时走追问策略. 输出: {agent, confidence, context}.', color: 'amber' },
    nutrition: { name: '营养 Agent', desc: 'Prompt: 专业营养师人格. 工具: query_nutrition(), get_diet_log(), set_reminder(). 擅长: 饮食分析, 营养建议, 食物查询, 喝水提醒.', color: 'green' },
    cycle: { name: '周期 Agent', desc: 'Prompt: 专业妇科顾问人格. 工具: get_cycle_status(), get_cycle_history(). 擅长: 经期预测, 阶段分析, 异常提醒, 周期知识.', color: 'blue' },
    mood: { name: '情绪 Agent', desc: 'Prompt: 温柔闺蜜人格. 工具: log_mood(), get_mood_history(). 擅长: 情绪安抚, 压力缓解, 正念引导, 心情日记.', color: 'purple' },
    memory: { name: 'Shared Memory', desc: '三层记忆: (1) 用户画像 — Redis 持久存储(过敏/偏好/年龄); (2) 会话状态 — 内存缓存(当前对话上下文); (3) 历史摘要 — 7天对话压缩.', color: 'red' }
  };

  const simSteps = [
    { type: 'user-step', label: 'User', text: '"我最近经期快来了, 心情不太好, 今晚吃什么能让我好受点?"' },
    { type: 'router-step', label: 'Router', text: '意图分析: [mood: 0.6, nutrition: 0.7, cycle: 0.5] → 主意图: nutrition, 次意图: mood → 先路由到情绪Agent, 再交接营养Agent' },
    { type: 'agent-step', label: '情绪 Agent', text: '读取 Shared Memory: {mood_history: 最近3天情绪偏低}. Thought: 用户连续几天情绪不好, PMS 相关, 先给情感支持.' },
    { type: 'tool-step', label: 'Tool Call', text: 'log_mood({user_id: "u_12345", mood: "低落", trigger: "PMS"})' },
    { type: 'handoff-step', label: 'Handoff', text: '情绪Agent完成 → Context Object: {mood: "低落/PMS相关", need: "comfort food建议", allergies: ["花生"], summary: "用户因PMS情绪低落, 需要食物安慰"} → 交接给营养Agent' },
    { type: 'agent-step', label: '营养 Agent', text: '收到Context Object. Thought: 用户花生过敏, 想要comfort food, 在黄体期. 需要查营养库找适合的食物.' },
    { type: 'tool-step', label: 'Tool Call', text: 'query_nutrition({phase: "黄体期", goal: "mood_boost", exclude: ["花生"]})' },
    { type: 'answer-step', label: '最终回答', text: '抱抱~ 经前这几天确实容易烦躁, 这很正常的. 今晚给自己做个温暖的南瓜浓汤吧 — 南瓜富含B6和镁, 能帮助缓解PMS不适, 而且热乎乎的喝下去超治愈的. 再配一杯热可可(选黑巧克力的, 抗氧化还能提升心情), 给自己一个小小的犒赏. 别忘了早点休息哦~' }
  ];

  let currentSim = 0;
  const detailEl = document.getElementById('component-detail');
  const detailTitle = document.getElementById('detail-title');
  const detailDesc = document.getElementById('detail-desc');
  const traceEl = document.getElementById('sim-trace');
  const simBtn = document.getElementById('sim-btn');
  const simResetBtn = document.getElementById('sim-reset');
  const simCounter = document.getElementById('sim-counter');

  // Component clicks
  document.querySelectorAll('.arch-component').forEach(el => {
    el.addEventListener('click', () => {
      const key = el.dataset.component;
      const comp = components[key];
      if (!comp) return;
      document.querySelectorAll('.arch-component').forEach(c => c.classList.remove('active'));
      el.classList.add('active');
      if (detailEl) detailEl.classList.add('show');
      if (detailTitle) detailTitle.textContent = comp.name;
      if (detailDesc) detailDesc.textContent = comp.desc;
    });
  });

  // Simulation
  function advanceSim() {
    if (currentSim >= simSteps.length) return;
    const s = simSteps[currentSim];
    const el = document.createElement('div');
    el.className = `sim-trace-step ${s.type}`;
    el.innerHTML = `<span class="sim-trace-label">${s.label}</span>${s.text}`;
    if (traceEl) { traceEl.classList.add('show'); traceEl.appendChild(el); }
    currentSim++;
    if (simCounter) simCounter.textContent = `${currentSim} / ${simSteps.length}`;
    if (currentSim >= simSteps.length && simBtn) { simBtn.textContent = '模拟完成 ✓'; simBtn.disabled = true; }
  }

  function resetSim() {
    currentSim = 0;
    if (traceEl) { traceEl.innerHTML = ''; traceEl.classList.remove('show'); }
    if (simBtn) { simBtn.textContent = '模拟下一步 →'; simBtn.disabled = false; }
    if (simCounter) simCounter.textContent = `0 / ${simSteps.length}`;
  }

  if (simBtn) simBtn.addEventListener('click', advanceSim);
  if (simResetBtn) simResetBtn.addEventListener('click', resetSim);
})();
