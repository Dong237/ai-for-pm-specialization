/* Unit 3 · Persona Config — editable persona + live chat preview */
(() => {
  'use strict';

  const roleInput = document.getElementById('persona-role');
  const styleInput = document.getElementById('persona-style');
  const welcomeInput = document.getElementById('persona-welcome');
  const applyBtn = document.getElementById('persona-apply');
  const chatBox = document.getElementById('persona-chat');
  const testInput = document.getElementById('persona-test-input');
  const testBtn = document.getElementById('persona-test-btn');

  if (!applyBtn || !chatBox) return;

  let currentPersona = {
    role: '女性健康顾问',
    style: '温柔、专业、像闺蜜一样聊天',
    welcome: '嗨~ 我是 Vitamin 健康小助手, 有什么身体上的困扰想聊聊吗?'
  };

  // Persona presets for different test inputs
  const responseMap = [
    { keywords: ['经期', '月经', '大姨妈', '例假'],
      response: '经期是身体的自然节律哦~ 如果有不舒服的地方, 比如腹痛或者情绪波动, 都是正常的. 要不要跟我说说具体的感受? 我帮你分析一下.' },
    { keywords: ['头疼', '头痛', '偏头痛'],
      response: '头疼确实让人难受呢. 有几种可能的原因: 睡眠不足、压力大、或者跟生理周期有关. 最近睡眠怎么样? 我们一起排查一下.' },
    { keywords: ['运动', '锻炼', '跑步', '健身'],
      response: '运动是好事! 不过要根据身体状态来调整强度. 如果是经期前两天, 建议做轻柔的瑜伽或散步. 经期结束后就可以恢复正常运动啦~' },
    { keywords: ['饮食', '吃什么', '营养', '早餐'],
      response: '饮食对身体状态影响很大哦! 建议多吃富含铁质的食物 (比如红肉、菠菜), 少吃冰凉的. 要不要我帮你做一个今日饮食小建议?' },
    { keywords: ['睡', '失眠', '熬夜'],
      response: '睡眠质量直接影响身体状态呢. 建议保持规律作息, 睡前 1 小时少看手机. 如果经常失眠, 可以试试冥想或者泡脚~' },
  ];

  const defaultResponse = '收到你的问题了~ 让我想想怎么帮你. 作为你的健康小助手, 我会尽量给你专业又贴心的建议.';

  function addMessage(text, isUser) {
    const msg = document.createElement('div');
    msg.className = `preview-msg ${isUser ? 'user-msg' : 'bot-msg'}`;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function getResponse(input) {
    const lower = input.toLowerCase();
    for (const item of responseMap) {
      if (item.keywords.some(k => lower.includes(k))) {
        return item.response;
      }
    }
    return defaultResponse;
  }

  // Apply persona
  applyBtn.addEventListener('click', () => {
    currentPersona.role = roleInput.value.trim() || currentPersona.role;
    currentPersona.style = styleInput.value.trim() || currentPersona.style;
    currentPersona.welcome = welcomeInput.value.trim() || currentPersona.welcome;

    // Reset chat with new welcome message
    chatBox.innerHTML = '';
    addMessage(currentPersona.welcome, false);

    applyBtn.textContent = '已应用 ✓';
    applyBtn.style.background = 'var(--green-bg)';
    applyBtn.style.borderColor = 'var(--green)';
    setTimeout(() => {
      applyBtn.textContent = '应用人设';
      applyBtn.style.background = '';
      applyBtn.style.borderColor = '';
    }, 2000);
  });

  // Test chat
  if (testBtn && testInput) {
    function sendTest() {
      const text = testInput.value.trim();
      if (!text) return;
      addMessage(text, true);
      testInput.value = '';
      setTimeout(() => {
        addMessage(getResponse(text), false);
      }, 500);
    }
    testBtn.addEventListener('click', sendTest);
    testInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTest(); }
    });
  }

  // Initialize with welcome message
  if (chatBox.children.length === 0) {
    addMessage(currentPersona.welcome, false);
  }

})();
