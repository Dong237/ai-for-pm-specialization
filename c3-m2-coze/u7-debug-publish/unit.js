/* Unit 7 · Debug & Publish — step-through debug panel */
(() => {
  'use strict';

  const stepBtn = document.getElementById('debug-step-btn');
  const resetBtn = document.getElementById('debug-reset-btn');
  const statusEl = document.getElementById('debug-status');
  const steps = document.querySelectorAll('.debug-step');

  if (!stepBtn || !steps.length) return;

  const stepData = [
    { input: '"我经期第二天, 今天能跑步吗?"', output: '消息已接收, 传给下一节点' },
    { input: '"我经期第二天, 今天能跑步吗?"', output: 'intent: "exercise"' },
    { input: 'query: "经期运动建议"\ncity: "深圳"', output: 'temperature: 28°C\nweather: "多云"' },
    { input: 'query: "经期第二天运动"\ntop_k: 5', output: '[1] 经期前两天建议轻柔运动...\n[2] 避免剧烈运动和倒立...\n[3] 经期运动注意保暖...' },
    { input: 'user_query + weather_data + kb_results + persona', output: '经期第二天建议做轻柔运动哦~ 今天深圳 28 度多云, 可以室内做瑜伽或拉伸. 避免跑步等剧烈运动. [来源: 经期健康指南]' },
    { input: '最终回复文本', output: '已发送给用户 ✓' },
  ];

  let currentStep = -1;

  function updateUI() {
    steps.forEach((s, i) => {
      s.classList.remove('active', 'done');
      const ioBoxes = s.querySelectorAll('.debug-io-content');
      if (i < currentStep) {
        s.classList.add('done');
        if (ioBoxes.length >= 2) {
          ioBoxes[0].textContent = stepData[i].input;
          ioBoxes[1].textContent = stepData[i].output;
        }
      } else if (i === currentStep) {
        s.classList.add('active');
        if (ioBoxes.length >= 2) {
          ioBoxes[0].textContent = stepData[i].input;
          ioBoxes[1].textContent = stepData[i].output;
        }
      } else {
        if (ioBoxes.length >= 2) {
          ioBoxes[0].textContent = '等待中...';
          ioBoxes[1].textContent = '等待中...';
        }
      }
    });

    if (currentStep >= steps.length) {
      stepBtn.textContent = '调试完成 ✓';
      stepBtn.disabled = true;
      statusEl.textContent = `完成! ${steps.length}/${steps.length} 步`;
    } else {
      stepBtn.textContent = '下一步 →';
      stepBtn.disabled = false;
      statusEl.textContent = `${Math.max(0, currentStep + 1)}/${steps.length} 步`;
    }
  }

  stepBtn.addEventListener('click', () => {
    if (currentStep >= steps.length - 1) {
      currentStep = steps.length;
      updateUI();
      return;
    }
    currentStep++;
    updateUI();

    // Scroll active step into view
    if (steps[currentStep]) {
      steps[currentStep].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  resetBtn.addEventListener('click', () => {
    currentStep = -1;
    updateUI();
  });

  updateUI();
})();
