/* Unit 2 · Hello World — Bot Creator interactive widget */
(() => {
  'use strict';

  const nameInput = document.getElementById('bot-name');
  const descInput = document.getElementById('bot-desc');
  const createBtn = document.getElementById('bot-create-btn');
  const preview = document.getElementById('bot-preview');
  const previewName = document.getElementById('preview-name');
  const previewDesc = document.getElementById('preview-desc');
  const chatSim = document.getElementById('chat-sim');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');

  if (!createBtn || !preview) return;

  // Bot creation
  createBtn.addEventListener('click', () => {
    const name = nameInput.value.trim() || 'My First Bot';
    const desc = descInput.value.trim() || 'A helpful AI assistant';

    previewName.textContent = name;
    previewDesc.textContent = desc;

    preview.classList.add('visible');
    createBtn.textContent = 'Bot 已创建 ✓';
    createBtn.disabled = true;
    createBtn.style.background = 'var(--green-bg)';
    createBtn.style.borderColor = 'var(--green)';

    // Update step indicators
    document.querySelectorAll('.flow-step').forEach((s, i) => {
      if (i <= 1) s.classList.add('done');
    });

    preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Chat simulation
  if (!chatSim || !chatInput || !chatSendBtn) return;

  const botResponses = [
    '你好! 我是你刚创建的第一个 Bot. 很高兴认识你!',
    '我现在还是一个"白纸" Bot -- 只有基础的聊天能力. 后面的单元会给我加知识库和插件, 让我变得更强大.',
    '没问题! 你可以问我任何问题, 虽然我现在只能用通用模型来回答.',
    '这是个好问题! 作为一个刚创建的 Bot, 我还没有接入知识库. 等 U4 学完, 我就能回答专业领域的问题了.',
    '哈哈, 你真有好奇心! 继续往下学, 你会发现 Coze 还有很多有趣的功能.',
  ];
  let responseIdx = 0;

  function addMessage(text, isUser) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
    msg.innerHTML = `
      <div class="chat-avatar-mini">${isUser ? '&#128100;' : '&#129302;'}</div>
      <div class="chat-bubble">${text}</div>
    `;
    chatSim.appendChild(msg);
    chatSim.scrollTop = chatSim.scrollHeight;
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    chatInput.value = '';

    // Simulate bot typing delay
    setTimeout(() => {
      const response = botResponses[responseIdx % botResponses.length];
      responseIdx++;
      addMessage(response, false);
    }, 600);
  }

  chatSendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

})();
