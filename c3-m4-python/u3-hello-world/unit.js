/* Unit 3 — Code Runner Widget */
(() => {
  'use strict';

  const runner = document.getElementById('code-runner');
  if (!runner) return;

  const runBtn = runner.querySelector('.cr-run-btn');
  const output = runner.querySelector('.cr-output');

  const responses = [
    "经期运动是可以的! 建议做低强度运动:\n\n1. 散步 20-30 分钟\n2. 温和的瑜伽 (避免倒立体式)\n3. 轻度拉伸\n\n避免高强度运动和游泳. 如果感到不适, 请休息.\n\n注意: 这是一般建议, 具体请咨询医生.",
    "经期期间可以适当运动, 但要注意强度:\n\n推荐:\n- 散步、慢跑\n- 简单瑜伽\n- 拉伸运动\n\n不推荐:\n- 剧烈跑步\n- 重量训练\n- 游泳 (视个人情况)\n\n运动能促进血液循环, 缓解痛经. 但请听从身体的感觉.",
    "可以运动! 适当运动反而有助于缓解经期不适.\n\n适合的运动:\n1. 瑜伽 (推荐猫牛式、婴儿式)\n2. 散步\n3. 轻度有氧\n\n建议避免:\n- 高强度 HIIT\n- 倒立动作\n- 腹部高压运动\n\n记得多喝水, 注意保暖."
  ];

  let isRunning = false;

  runBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    runBtn.disabled = true;
    runBtn.textContent = 'Running...';
    runBtn.classList.add('running');

    output.innerHTML = '<span class="out-label">$ python3 first_call.py</span>\n\n';

    // Simulate loading
    setTimeout(() => {
      output.innerHTML += '<span class="out-key">Sending request to API...</span>\n';
    }, 500);

    setTimeout(() => {
      output.innerHTML += '<span class="out-key">Response received!</span>\n\n';

      const resp = responses[Math.floor(Math.random() * responses.length)];
      let idx = 0;
      const respSpan = document.createElement('span');
      respSpan.className = 'out-val';
      output.appendChild(respSpan);

      // Typing effect
      const typeInterval = setInterval(() => {
        if (idx < resp.length) {
          respSpan.textContent += resp[idx];
          idx++;
          output.scrollTop = output.scrollHeight;
        } else {
          clearInterval(typeInterval);
          output.innerHTML += '\n\n<span class="out-key">---</span>\n';
          output.innerHTML += '<span class="out-key">Model:</span> gpt-4o-mini\n';
          output.innerHTML += '<span class="out-key">Tokens:</span> prompt=' + (42 + Math.floor(Math.random()*10)) + ', completion=' + (85 + Math.floor(Math.random()*30)) + '\n';
          output.innerHTML += '<span class="out-label">Done!</span>';
          runBtn.disabled = false;
          runBtn.textContent = '\u25B6 Run Again';
          runBtn.classList.remove('running');
          isRunning = false;
        }
      }, 20);
    }, 1500);
  });
})();
