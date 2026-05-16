/* Unit 8 · Vitamin Bot — assembler checklist + phone preview */
(() => {
  'use strict';

  // Assembly checklist
  const items = document.querySelectorAll('.assembly-item');
  const progressFill = document.getElementById('assembly-progress-fill');
  const progressText = document.getElementById('assembly-progress-text');
  const totalItems = items.length;

  function updateProgress() {
    const checked = document.querySelectorAll('.assembly-item.checked').length;
    const pct = totalItems > 0 ? (checked / totalItems) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressText) progressText.textContent = `${checked}/${totalItems} 完成 (${Math.round(pct)}%)`;
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      const check = item.querySelector('.assembly-check');
      if (item.classList.contains('checked')) {
        check.textContent = '\u2713';
      } else {
        check.textContent = '';
      }
      updateProgress();
    });
  });

  updateProgress();

  // Phone preview chat
  const phoneScreen = document.getElementById('phone-screen');
  const phoneInput = document.getElementById('phone-input');
  const phoneSendBtn = document.getElementById('phone-send');

  if (!phoneScreen || !phoneInput || !phoneSendBtn) return;

  const vitaminResponses = [
    '嗨~ 我是 Vitamin 健康小助手 &#127793;\n\n有什么身体上的困扰想聊聊吗?\n试试问我: "经期头疼正常吗?"',
    '经期头疼确实很常见呢~ 主要是因为雌激素水平波动导致的.\n\n建议你:\n1. 保持充足睡眠\n2. 热敷太阳穴\n3. 轻柔运动如瑜伽\n\n如果持续严重, 建议就医检查哦.\n[来源: 女性经期健康指南]',
    '经期第二天建议做轻柔运动~ 今天深圳 28 度多云, 可以室内做瑜伽或拉伸.\n\n避免跑步等剧烈运动和倒立类动作.\n[来源: 运动与睡眠指南]',
    '睡眠对身体状态影响很大呢! 建议:\n\n1. 保持规律作息\n2. 睡前 1 小时少看手机\n3. 试试泡脚或冥想\n4. 经期时可以喝杯热牛奶\n\n你最近一般几点睡呀?',
    '收到你的问题了~ 让我在知识库里查一下...\n\n根据我的健康资料库, 这个情况在经期是比较正常的. 不过如果持续超过一周, 建议去看医生哦.\n\n还有什么想问的吗? &#128522;',
  ];
  let respIdx = 0;

  function addPhoneMsg(text, isUser) {
    const msg = document.createElement('div');
    msg.className = `phone-msg ${isUser ? 'user-msg' : 'bot-msg'}`;
    msg.innerHTML = text.replace(/\n/g, '<br>');
    phoneScreen.appendChild(msg);
    phoneScreen.scrollTop = phoneScreen.scrollHeight;
  }

  function sendPhoneMsg() {
    const text = phoneInput.value.trim();
    if (!text) return;
    addPhoneMsg(text, true);
    phoneInput.value = '';

    setTimeout(() => {
      const resp = vitaminResponses[respIdx % vitaminResponses.length];
      respIdx++;
      addPhoneMsg(resp, false);
    }, 700);
  }

  phoneSendBtn.addEventListener('click', sendPhoneMsg);
  phoneInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); sendPhoneMsg(); }
  });

  // Add initial welcome message
  setTimeout(() => {
    addPhoneMsg(vitaminResponses[0], false);
    respIdx = 1;
  }, 500);

})();
