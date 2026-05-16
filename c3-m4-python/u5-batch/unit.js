/* Unit 5 — Batch Processor Widget */
(() => {
  'use strict';

  const widget = document.getElementById('batch-processor');
  if (!widget) return;

  const crashBtn = widget.querySelector('.batch-mode-btn.crash');
  const successBtn = widget.querySelector('.batch-mode-btn.success');
  const log = widget.querySelector('.batch-log');
  const progressFill = widget.querySelector('.batch-progress-fill');
  const statSuccess = document.getElementById('batch-success');
  const statFail = document.getElementById('batch-fail');
  const statTime = document.getElementById('batch-time');

  const TOTAL = 20;
  let running = false;

  function reset() {
    log.innerHTML = '<span class="log-info">Click a mode to start...</span>';
    progressFill.style.width = '0%';
    progressFill.className = 'batch-progress-fill';
    statSuccess.textContent = '0';
    statFail.textContent = '0';
    statTime.textContent = '-';
  }

  function addLog(msg, cls) {
    const line = document.createElement('div');
    line.className = cls || '';
    line.textContent = msg;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  }

  // Mode 1: Run All (no rate limit) — crashes at item 7
  crashBtn.addEventListener('click', () => {
    if (running) return;
    running = true;
    reset();
    log.innerHTML = '';
    addLog('[Mode: Run All — no rate limiting]', 'log-info');
    progressFill.classList.add('err');

    let i = 0;
    let ok = 0;
    const crashAt = 6;

    const timer = setInterval(() => {
      if (i >= TOTAL) {
        clearInterval(timer);
        running = false;
        return;
      }

      if (i === crashAt) {
        addLog(`[${i+1}/${TOTAL}] 429 RateLimitError! 程序崩溃!`, 'log-err');
        addLog('Traceback: openai.RateLimitError: Rate limit reached', 'log-err');
        addLog(`--- 崩溃! 只完成了 ${ok}/${TOTAL} 条, 前面的结果可能丢失 ---`, 'log-err');
        progressFill.style.width = ((i+1) / TOTAL * 100) + '%';
        statFail.textContent = (TOTAL - ok);
        statTime.textContent = '崩溃';
        clearInterval(timer);
        running = false;
        return;
      }

      ok++;
      addLog(`[${i+1}/${TOTAL}] \u2713 Success — "${sampleQs[i % sampleQs.length]}"`, 'log-ok');
      progressFill.style.width = ((i+1) / TOTAL * 100) + '%';
      statSuccess.textContent = ok;
      i++;
    }, 200);
  });

  // Mode 2: Rate Limited — all succeed
  successBtn.addEventListener('click', () => {
    if (running) return;
    running = true;
    reset();
    log.innerHTML = '';
    addLog('[Mode: Rate Limited — time.sleep(0.5) between calls]', 'log-info');
    progressFill.classList.add('ok');

    let i = 0;
    let ok = 0;
    const startTime = Date.now();

    function processNext() {
      if (i >= TOTAL) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        addLog(`--- 完成! ${ok}/${TOTAL} 条全部成功, 耗时 ${elapsed}s ---`, 'log-info');
        statTime.textContent = elapsed + 's';
        running = false;
        return;
      }

      // Simulate occasional rate limit hit with retry
      if (i === 8 || i === 15) {
        addLog(`[${i+1}/${TOTAL}] 429 Rate limit — waiting 1s...`, 'log-wait');
        setTimeout(() => {
          addLog(`[${i+1}/${TOTAL}] \u2713 Retry success`, 'log-ok');
          ok++;
          statSuccess.textContent = ok;
          progressFill.style.width = ((i+1) / TOTAL * 100) + '%';
          i++;
          setTimeout(processNext, 300);
        }, 800);
        return;
      }

      ok++;
      addLog(`[${i+1}/${TOTAL}] \u2713 Success — "${sampleQs[i % sampleQs.length]}"`, 'log-ok');
      progressFill.style.width = ((i+1) / TOTAL * 100) + '%';
      statSuccess.textContent = ok;
      i++;
      setTimeout(processNext, 250);
    }

    processNext();
  });

  const sampleQs = [
    '经期可以运动吗?',
    '孕早期吃什么好?',
    '失眠怎么办?',
    '痛经如何缓解?',
    '排卵期有什么症状?',
    '黄体期情绪低落正常吗?',
    '喝冰水对月经有影响吗?',
    '经期头痛怎么处理?',
    '备孕需要补什么?',
    '经前综合征怎么缓解?',
    '月经不调要看医生吗?',
    '产后多久恢复月经?',
    '卵泡期适合做什么运动?',
    '经期可以喝咖啡吗?',
    '如何计算排卵日?',
    '黄体期体温升高正常吗?',
    '痛经严重要吃药吗?',
    '经期能吃水果吗?',
    '怀孕初期注意什么?',
    '月经量突然变少什么原因?'
  ];

  reset();
})();
