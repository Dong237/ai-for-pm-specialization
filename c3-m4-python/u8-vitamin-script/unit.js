/* Unit 8 — Script Builder Widget */
(() => {
  'use strict';

  const widget = document.getElementById('script-builder');
  if (!widget) return;

  const nextBtn = widget.querySelector('.sb-btn:not(.reset)');
  const resetBtn = widget.querySelector('.sb-btn.reset');
  const display = widget.querySelector('.sb-display');
  const dots = widget.querySelectorAll('.sb-step-dot');
  const report = widget.querySelector('.sb-report');

  const steps = [
    {
      title: 'Step 1: Loading .env...',
      logs: [
        { text: '>>> from dotenv import load_dotenv', cls: 'log-info' },
        { text: '>>> load_dotenv()', cls: 'log-info' },
        { text: 'API Key loaded: sk-proj-abc1...', cls: 'log-ok' },
      ]
    },
    {
      title: 'Step 2: Reading input.csv...',
      logs: [
        { text: '>>> Reading vitamin_test_cases.csv', cls: 'log-info' },
        { text: 'Found 10 rows, 5 columns', cls: 'log-ok' },
        { text: 'Columns: id, question, category, body_state, expected_tone', cls: 'log-info' },
      ]
    },
    {
      title: 'Step 3: Processing rows...',
      logs: [
        { text: '[1/10]  "经期可以运动吗?" ... OK (42+98 tokens)', cls: 'log-ok' },
        { text: '[2/10]  "孕早期吃什么好?" ... OK (38+112 tokens)', cls: 'log-ok' },
        { text: '[3/10]  "失眠怎么办?" ... OK (35+87 tokens)', cls: 'log-ok' },
        { text: '[4/10]  "痛经如何缓解?" ... OK (40+95 tokens)', cls: 'log-ok' },
        { text: '[5/10]  "排卵期有什么症状?" ... 429 Rate Limit!', cls: 'log-warn' },
        { text: '         Waiting 2s... Retry... OK (44+103 tokens)', cls: 'log-ok' },
        { text: '[6/10]  "黄体期情绪低落正常吗?" ... OK (48+120 tokens)', cls: 'log-ok' },
        { text: '[7/10]  "喝冰水影响月经吗?" ... OK (41+91 tokens)', cls: 'log-ok' },
        { text: '[8/10]  "经期头痛怎么处理?" ... OK (43+88 tokens)', cls: 'log-ok' },
        { text: '[9/10]  "备孕需要补什么?" ... OK (37+105 tokens)', cls: 'log-ok' },
        { text: '[10/10] "月经不调要看医生吗?" ... OK (45+110 tokens)', cls: 'log-ok' },
      ]
    },
    {
      title: 'Step 4: Writing output.csv...',
      logs: [
        { text: '>>> Writing output.csv (10 rows, 9 columns)', cls: 'log-info' },
        { text: 'New columns: ai_response, status, tokens_used, cost_usd', cls: 'log-info' },
        { text: 'File saved: output.csv (utf-8-sig)', cls: 'log-ok' },
      ]
    },
    {
      title: 'Step 5: Generating report...',
      logs: [
        { text: '=== VITAMIN QA REPORT ===', cls: 'log-title' },
        { text: 'Total calls:    10', cls: 'log-info' },
        { text: 'Successful:     10 (100%)', cls: 'log-ok' },
        { text: 'Failed:         0', cls: 'log-ok' },
        { text: 'Total tokens:   1,409', cls: 'log-info' },
        { text: 'Total cost:     $0.00065', cls: 'log-info' },
        { text: 'Avg cost/call:  $0.000065', cls: 'log-info' },
        { text: 'Time elapsed:   12.3s', cls: 'log-info' },
        { text: '', cls: '' },
        { text: 'Monthly estimate (1000 DAU, 3 msgs/day):', cls: 'log-info' },
        { text: '  Calls: 90,000/month', cls: 'log-info' },
        { text: '  Cost:  ~$5.85/month', cls: 'log-ok' },
        { text: '', cls: '' },
        { text: 'Done! Results in output.csv', cls: 'log-ok' },
      ]
    }
  ];

  let currentStep = -1;

  function addLog(text, cls) {
    const line = document.createElement('div');
    if (cls) line.className = cls;
    line.textContent = text;
    display.appendChild(line);
    display.scrollTop = display.scrollHeight;
  }

  function runStep() {
    currentStep++;
    if (currentStep >= steps.length) {
      nextBtn.textContent = 'Complete!';
      nextBtn.disabled = true;
      report.classList.add('visible');
      return;
    }

    // Update dots
    dots.forEach((d, i) => {
      d.classList.remove('active');
      if (i < currentStep) d.classList.add('done');
      if (i === currentStep) d.classList.add('active');
    });

    const step = steps[currentStep];
    addLog('', '');
    addLog('--- ' + step.title + ' ---', 'log-title');

    let i = 0;
    const interval = setInterval(() => {
      if (i >= step.logs.length) {
        clearInterval(interval);
        // Mark done
        dots[currentStep].classList.remove('active');
        dots[currentStep].classList.add('done');
        nextBtn.disabled = false;
        return;
      }

      nextBtn.disabled = true;
      addLog(step.logs[i].text, step.logs[i].cls);
      i++;
    }, 300);
  }

  nextBtn.addEventListener('click', runStep);

  resetBtn.addEventListener('click', () => {
    currentStep = -1;
    display.innerHTML = '<span class="log-info">Click "Next Step" to start the Vitamin script...</span>';
    dots.forEach(d => { d.classList.remove('active', 'done'); });
    report.classList.remove('visible');
    nextBtn.textContent = 'Next Step \u2192';
    nextBtn.disabled = false;
  });
})();
