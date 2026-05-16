/* ===========================================
   Unit 4 · Context Window — Memory Bucket
   ===========================================
   Simulates filling a context window with messages.
   When full, earlier messages get truncated.
*/

(() => {
  'use strict';

  // Model context sizes (in tokens, simplified)
  const MODELS = {
    'gpt35':  { name: 'GPT-3.5', limit: 4096 },
    'gpt4':   { name: 'GPT-4',   limit: 128000 },
    'claude': { name: 'Claude',  limit: 200000 },
    'gemini': { name: 'Gemini',  limit: 1000000 },
    'ds':     { name: 'DeepSeek', limit: 128000 }
  };

  // For the demo, we scale everything down to make 4K feel constrained
  // Display scale: 1 "demo token" = 1 real token, but we use small context for GPT-3.5
  const SCALE = {
    'gpt35': 400,    // 400 demo tokens (fills fast!)
    'gpt4': 2000,    // 2000 demo tokens
    'claude': 3000,  // 3000 demo tokens
    'gemini': 5000,  // 5000 demo tokens
    'ds': 2000       // same as GPT-4
  };

  // Pre-defined messages to add
  const MESSAGES = [
    { role: 'system', text: 'You are Vitamin, a women\'s health AI assistant. Track user\'s 5 body states and give personalized health advice in Chinese.', tokens: 45 },
    { role: 'user', text: '你好！我最近经期不太规律，想问问有什么建议。', tokens: 28 },
    { role: 'assistant', text: '你好！经期不规律是很常见的。我先了解一下你的情况：最近作息有变化吗？压力大吗？饮食有什么特别的吗？', tokens: 52 },
    { role: 'user', text: '最近加班比较多，每天都要到晚上 10 点才下班，饮食也不太规律，经常吃外卖。', tokens: 38 },
    { role: 'assistant', text: '了解了。加班 + 饮食不规律确实容易影响经期。建议你：1. 尽量在 11 点前入睡 2. 多吃温热食物，少吃冷饮 3. 适当运动，比如散步或瑜伽 4. 如果连续 3 个月不规律，建议去看医生。', tokens: 85 },
    { role: 'user', text: '好的谢谢！那我想记录一下今天的状态：今天心情还行，但是有点疲惫，早上吃了面包和牛奶，中午吃的盒饭。', tokens: 45 },
    { role: 'assistant', text: '已记录！今日状态总结：\n- 心情：😊 还行\n- 能量：😴 疲惫\n- 早餐：面包+牛奶 (碳水为主，蛋白质偏少)\n- 午餐：盒饭\n\n建议下午补充一些水果或坚果，晚上尽量早点休息。明天试试加一个鸡蛋？', tokens: 92 },
    { role: 'user', text: '对了，我上周问你经期能不能跑步来着，你还记得吗？', tokens: 26 },
    { role: 'assistant', text: '让我翻一下我们的对话记录... 嗯，关于经期跑步，一般建议：经期前 2 天可以做轻运动（散步、瑜伽），第 3 天起可以慢跑，但不建议剧烈运动。你的体质如果没有痛经的话，轻度跑步是没问题的。', tokens: 78 },
    { role: 'user', text: '我还想问一下，吃维生素 B6 对经期有帮助吗？我朋友推荐我吃。', tokens: 32 },
    { role: 'assistant', text: '维生素 B6 确实有一些研究表明对经前综合征（PMS）有帮助，但注意：1. 剂量不要超过 100mg/天 2. 最好先咨询医生 3. 效果因人而异。我不能给你具体的医疗建议，如果症状明显，建议去看妇科。', tokens: 88 },
    { role: 'user', text: '那你能帮我制定一个这周的饮食计划吗？我想调理一下身体。', tokens: 30 },
    { role: 'assistant', text: '好的！根据你的情况，这周饮食建议：\n\n周一：早-小米粥+鸡蛋 午-鸡胸肉沙拉 晚-三文鱼+糙米\n周二：早-燕麦+蓝莓 午-番茄牛肉面 晚-清蒸鱼+蔬菜\n周三：早-全麦面包+牛油果 午-鸡汤面 晚-豆腐煲\n...\n\n核心原则：多温食、少冷饮、保证蛋白质、多铁质食物。', tokens: 120 },
  ];

  let currentModel = 'gpt35';
  let addedMessages = [];
  let msgIndex = 0;

  // DOM elements
  const container = document.getElementById('bucket-container');
  const progressFill = document.getElementById('bucket-progress-fill');
  const meterUsed = document.getElementById('bucket-used');
  const meterLimit = document.getElementById('bucket-limit');
  const addBtn = document.getElementById('bucket-add');
  const resetBtn = document.getElementById('bucket-reset');
  const modelBtns = document.querySelectorAll('.bucket-model-btn');

  if (!container) return;

  function getLimit() { return SCALE[currentModel] || 400; }

  function getTotalTokens() {
    return addedMessages.reduce((sum, m) => sum + m.tokens, 0);
  }

  function render() {
    const limit = getLimit();
    const total = getTotalTokens();
    const pct = Math.min(100, (total / limit) * 100);

    // Update meter
    meterUsed.textContent = total;
    meterLimit.textContent = limit;
    if (total > limit) {
      meterUsed.className = 'bucket-meter-used bucket-meter-full';
    } else {
      meterUsed.className = 'bucket-meter-used';
    }

    // Update progress bar
    progressFill.style.width = pct + '%';

    // Determine which messages are truncated (FIFO: oldest first, but keep system)
    let tokenBudget = limit;
    const msgStates = addedMessages.map(() => false); // false = not truncated

    // Always keep system prompt if fits
    // Walk from newest to oldest, marking as kept until budget runs out
    const keepFlags = new Array(addedMessages.length).fill(false);
    for (let i = addedMessages.length - 1; i >= 0; i--) {
      if (tokenBudget >= addedMessages[i].tokens) {
        keepFlags[i] = true;
        tokenBudget -= addedMessages[i].tokens;
      }
    }
    // System prompt (index 0) always kept if possible
    if (addedMessages.length > 0 && !keepFlags[0] && addedMessages[0].role === 'system') {
      // Try to force-keep system by truncating the oldest non-system
      keepFlags[0] = true;
    }

    // Render messages
    container.innerHTML = '';
    addedMessages.forEach((msg, i) => {
      const div = document.createElement('div');
      div.className = 'bucket-msg ' + msg.role + (keepFlags[i] ? '' : ' truncated');
      div.innerHTML = `
        <span class="msg-role">${msg.role === 'system' ? 'System' : msg.role === 'user' ? 'User' : 'AI'}</span>
        <span class="msg-text">${msg.text.substring(0, 80)}${msg.text.length > 80 ? '...' : ''}</span>
        <span class="msg-tokens">${msg.tokens}t</span>
      `;
      container.appendChild(div);
    });

    // Flash if overflowing
    if (total > limit) {
      container.classList.add('overflowing');
      setTimeout(() => container.classList.remove('overflowing'), 600);
    }

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;

    // Update button
    if (msgIndex >= MESSAGES.length) {
      addBtn.textContent = '对话结束 ✓';
      addBtn.disabled = true;
    } else {
      addBtn.textContent = '+ 下一条消息';
      addBtn.disabled = false;
    }
  }

  function addMessage() {
    if (msgIndex >= MESSAGES.length) return;
    addedMessages.push({ ...MESSAGES[msgIndex] });
    msgIndex++;
    render();
  }

  function reset() {
    addedMessages = [];
    msgIndex = 0;
    container.innerHTML = '<div style="color:var(--ink-muted);text-align:center;padding:20px;font-size:14px;">点击 "+ 下一条消息" 开始模拟对话</div>';
    progressFill.style.width = '0%';
    meterUsed.textContent = '0';
    meterLimit.textContent = getLimit();
    meterUsed.className = 'bucket-meter-used';
    addBtn.textContent = '+ 下一条消息';
    addBtn.disabled = false;
  }

  function switchModel(model) {
    currentModel = model;
    modelBtns.forEach(b => b.classList.toggle('active', b.dataset.model === model));
    render();
  }

  // Bind events
  addBtn.addEventListener('click', addMessage);
  resetBtn.addEventListener('click', reset);
  modelBtns.forEach(btn => {
    btn.addEventListener('click', () => switchModel(btn.dataset.model));
  });

  // Initialize
  reset();

  // ----- Lost-in-middle chart -----
  const litmBars = document.querySelectorAll('.litm-bar');
  if (litmBars.length) {
    // Attention scores: high at start, low in middle, high at end
    const scores = [95, 88, 72, 55, 42, 35, 30, 28, 32, 38, 45, 52, 60, 72, 85, 92];
    const litmObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          litmBars.forEach((bar, i) => {
            const score = scores[i] || 50;
            setTimeout(() => {
              bar.style.height = score + '%';
            }, i * 50);
          });
          litmObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    if (litmBars[0]) litmObserver.observe(litmBars[0].parentElement);
  }

})();
