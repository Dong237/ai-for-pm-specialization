/* U6: Tool Call Visualizer Widget */
(() => {
  'use strict';
  const widget = document.getElementById('tool-visualizer');
  if (!widget) return;

  const scenarios = [
    {
      name: '查天气',
      steps: [
        { type: 'user-msg', label: 'User', text: '"今天深圳天气怎么样? 适合户外运动吗?"' },
        { type: 'llm-think', label: 'LLM 思考', text: '用户想知道天气. 我需要调用天气工具获取实时数据, 不能编造.' },
        { type: 'fn-call', label: 'Function Call', text: '{\n  "name": "get_weather",\n  "arguments": {\n    "city": "深圳",\n    "date": "today"\n  }\n}' },
        { type: 'fn-result', label: 'Tool 返回', text: '{\n  "temp": 28,\n  "humidity": 75,\n  "condition": "多云",\n  "uv_index": 6,\n  "aqi": 45\n}' },
        { type: 'llm-answer', label: 'LLM 回答', text: '今天深圳28度, 多云, 空气质量优(AQI 45). 不过紫外线指数6, 建议涂防晒! 温度和空气都不错, 适合户外运动, 但记得补水哦~' }
      ]
    },
    {
      name: '查周期记录',
      steps: [
        { type: 'user-msg', label: 'User', text: '"我上次经期是什么时候开始的?"' },
        { type: 'llm-think', label: 'LLM 思考', text: '用户问经期历史. 我需要查她的周期记录数据库.' },
        { type: 'fn-call', label: 'Function Call', text: '{\n  "name": "get_cycle_history",\n  "arguments": {\n    "user_id": "u_12345",\n    "limit": 3\n  }\n}' },
        { type: 'fn-result', label: 'Tool 返回', text: '{\n  "cycles": [\n    {"start": "2026-04-18", "duration": 5, "cycle_length": 28},\n    {"start": "2026-03-21", "duration": 4, "cycle_length": 28},\n    {"start": "2026-02-21", "duration": 5, "cycle_length": 29}\n  ]\n}' },
        { type: 'llm-answer', label: 'LLM 回答', text: '你上次经期是4月18号开始的, 持续了5天. 最近三个周期都很规律, 大约28天一个周期. 按这个推算, 下次大约5月16号来哦, 注意提前准备~' }
      ]
    },
    {
      name: '查营养数据库',
      steps: [
        { type: 'user-msg', label: 'User', text: '"我今天早上吃了燕麦牛奶和一个苹果, 营养够吗?"' },
        { type: 'llm-think', label: 'LLM 思考', text: '用户想知道早餐的营养评估. 我需要查营养数据库获取食物的营养成分.' },
        { type: 'fn-call', label: 'Function Call', text: '{\n  "name": "query_nutrition",\n  "arguments": {\n    "foods": ["燕麦牛奶", "苹果"],\n    "meal": "breakfast"\n  }\n}' },
        { type: 'fn-result', label: 'Tool 返回', text: '{\n  "total_calories": 380,\n  "protein": 12,\n  "carbs": 58,\n  "fat": 8,\n  "fiber": 6,\n  "iron": 2.1,\n  "vitamin_c": 14,\n  "daily_target_pct": 22\n}' },
        { type: 'llm-answer', label: 'LLM 回答', text: '你的早餐约380大卡, 占全天目标的22%. 蛋白质12g, 碳水58g, 还不错! 不过蛋白质偏少, 建议加一个鸡蛋或者一把坚果, 让早餐更均衡~' }
      ]
    }
  ];

  let currentScenario = 0;
  let currentStep = 0;

  const tabsEl = document.getElementById('tool-tabs');
  const flowEl = document.getElementById('tool-flow');
  const stepBtn = document.getElementById('tool-step-btn');
  const resetBtn = document.getElementById('tool-reset');
  const counterEl = document.getElementById('tool-counter');

  function renderTabs() {
    if (!tabsEl) return;
    tabsEl.innerHTML = '';
    scenarios.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.className = 'tool-tab' + (i === currentScenario ? ' active' : '');
      btn.textContent = s.name;
      btn.addEventListener('click', () => { currentScenario = i; currentStep = 0; render(); });
      tabsEl.appendChild(btn);
    });
  }

  function render() {
    if (flowEl) flowEl.innerHTML = '';
    currentStep = 0;
    renderTabs();
    updateCounter();
  }

  function advance() {
    const s = scenarios[currentScenario];
    if (currentStep >= s.steps.length) return;
    const step = s.steps[currentStep];
    const el = document.createElement('div');
    el.className = `tool-flow-step ${step.type}`;
    el.innerHTML = `<span class="tool-flow-label">${step.label}</span>${step.text}`;
    if (flowEl) flowEl.appendChild(el);
    currentStep++;
    updateCounter();
  }

  function updateCounter() {
    const s = scenarios[currentScenario];
    if (counterEl) counterEl.textContent = `${currentStep} / ${s.steps.length}`;
    if (stepBtn) {
      if (currentStep >= s.steps.length) {
        stepBtn.textContent = '完成 ✓';
        stepBtn.disabled = true;
      } else {
        stepBtn.textContent = '下一步 →';
        stepBtn.disabled = false;
      }
    }
  }

  if (stepBtn) stepBtn.addEventListener('click', advance);
  if (resetBtn) resetBtn.addEventListener('click', render);

  render();
})();
