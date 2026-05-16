/* U9 · Template Library — 5 tabs for 5 body states, fill 4 sections each */
(() => {
  'use strict';
  const tabs = document.querySelectorAll('.tpl-tab');
  const panels = document.querySelectorAll('.tpl-panel');
  const previewOutput = document.getElementById('tpl-preview-output');
  const copyBtn = document.getElementById('tpl-copy');
  if (!tabs.length) return;

  const states = {
    menstrual: {
      role: '你是 Vitamin App 的健康顾问"小 V"。专注女性周期健康。说话温暖、像闺蜜。\n当前状态: 经期。特别注意: 关注痛感、出血量、情绪低落。',
      task: '根据用户在经期的描述, 给出温暖的关怀和实用建议。\n请先在 <thinking> 中分析症状严重程度, 然后在 <answer> 中给出面向用户的回复。',
      context: '用户处于经期第 {day} 天\n用户输入: "{user_input}"\n经期通常持续 {period_length} 天',
      format: 'JSON: {"greeting":"温暖问候","analysis":"状态解读","tips":["建议1","建议2","建议3"],"warning":"需注意的信号"}'
    },
    ovulation: {
      role: '你是 Vitamin App 的健康顾问"小 V"。专注女性周期健康。说话积极、鼓励运动。\n当前状态: 排卵期。特别注意: 精力旺盛, 适合运动, 注意排卵痛。',
      task: '根据用户在排卵期的描述, 给出积极的建议, 鼓励把握精力高峰期。\n先在 <thinking> 中分析, 再在 <answer> 中回复。',
      context: '用户处于排卵期\n用户输入: "{user_input}"\n周期长度: {cycle_length} 天',
      format: 'JSON: {"greeting":"积极问候","analysis":"状态解读","tips":["建议1","建议2","建议3"],"warning":"需注意的信号"}'
    },
    luteal: {
      role: '你是 Vitamin App 的健康顾问"小 V"。专注女性周期健康。说话理解、不催促。\n当前状态: 黄体期。特别注意: 情绪波动、食欲变化、疲劳。',
      task: '根据用户在黄体期的描述, 给出理解和支持, 不要否定她的感受。\n先在 <thinking> 中分析, 再在 <answer> 中回复。',
      context: '用户处于黄体期\n用户输入: "{user_input}"\n距离下次经期约 {days_to_period} 天',
      format: 'JSON: {"greeting":"理解性问候","analysis":"状态解读","tips":["建议1","建议2","建议3"],"warning":"需注意的信号"}'
    },
    premenstrual: {
      role: '你是 Vitamin App 的健康顾问"小 V"。专注女性周期健康。说话温柔、共情。\n当前状态: 经前期(PMS)。特别注意: 头疼、嗜甜、情绪不稳、腹胀。',
      task: '根据用户在经前期的描述, 给出共情和缓解建议, 帮她度过 PMS。\n先在 <thinking> 中逐步分析 PMS 症状, 再在 <answer> 中回复。',
      context: '用户处于经前期, 距离下次经期 {days_to_period} 天\n用户输入: "{user_input}"\nPMS 常见症状: 头疼、嗜甜、情绪波动',
      format: 'JSON: {"greeting":"共情问候","analysis":"PMS 分析","tips":["缓解建议1","缓解建议2","缓解建议3"],"warning":"需注意的信号"}'
    },
    safe: {
      role: '你是 Vitamin App 的健康顾问"小 V"。专注女性周期健康。说话轻松、日常。\n当前状态: 安全期。特别注意: 身体状态相对平稳, 适合保养。',
      task: '根据用户在安全期的描述, 给出日常保养建议, 语气轻松。\n先在 <thinking> 中分析, 再在 <answer> 中回复。',
      context: '用户处于安全期\n用户输入: "{user_input}"\n身体状态: 相对平稳',
      format: 'JSON: {"greeting":"轻松问候","analysis":"状态解读","tips":["保养建议1","保养建议2","保养建议3"],"warning":"日常提醒"}'
    }
  };

  let currentState = 'menstrual';

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      currentState = tab.dataset.state;
      const panel = document.getElementById('tpl-panel-' + currentState);
      if (panel) panel.classList.add('active');
      loadState(currentState);
      updatePreview();
    });
  });

  function loadState(state) {
    const s = states[state];
    if (!s) return;
    const panel = document.getElementById('tpl-panel-' + state);
    if (!panel) return;
    const tas = panel.querySelectorAll('.tpl-textarea');
    if (tas[0] && !tas[0].dataset.loaded) {
      tas[0].value = s.role;
      tas[1].value = s.task;
      tas[2].value = s.context;
      tas[3].value = s.format;
      tas[0].dataset.loaded = 'true';
    }
  }

  function updatePreview() {
    const panel = document.querySelector('.tpl-panel.active');
    if (!panel || !previewOutput) return;
    const tas = panel.querySelectorAll('.tpl-textarea');
    const role = tas[0]?.value?.trim() || '';
    const task = tas[1]?.value?.trim() || '';
    const context = tas[2]?.value?.trim() || '';
    const format = tas[3]?.value?.trim() || '';

    let output = '';
    if (role) output += `<role>\n${role}\n</role>\n\n`;
    if (task) output += `<task>\n${task}\n</task>\n\n`;
    if (context) output += `<context>\n${context}\n</context>\n\n`;
    output += `<rules>\n- 不要给出医疗诊断或用药建议\n- 如果症状严重, 建议立即就医\n- 不要回答与健康无关的话题\n</rules>\n\n`;
    if (format) output += `<format>\n${format}\n</format>`;

    previewOutput.textContent = output;
  }

  // Listen for textarea changes
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('tpl-textarea')) updatePreview();
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = previewOutput?.textContent || '';
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '已复制!';
        setTimeout(() => { copyBtn.textContent = '复制当前模板'; }, 2000);
      });
    });
  }

  // Initialize first state
  loadState('menstrual');
  setTimeout(updatePreview, 100);
})();
