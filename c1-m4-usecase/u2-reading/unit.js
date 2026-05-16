/* ===========================================
   Unit 2 · Reading 类用例
   Interactive widgets
   =========================================== */

(() => {
  'use strict';

  // -----------------------------------------------
  // 1. Animate classification bars in Step 1
  // -----------------------------------------------
  const rCbarFills = document.querySelectorAll('.r-cbar-fill');
  if (rCbarFills.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const fill = e.target;
          const v = parseFloat(fill.dataset.value || '0');
          fill.style.width = v + '%';
          obs.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });
    rCbarFills.forEach(f => obs.observe(f));
  }

  // -----------------------------------------------
  // 2. Summarize demo (Step 3)
  // -----------------------------------------------
  const sumBtn = document.getElementById('sum-btn');
  const sumOutput = document.getElementById('sum-output');
  const sumInputText = document.getElementById('sum-input-text');

  if (sumBtn && sumOutput && sumInputText) {
    let sumDone = false;
    sumBtn.addEventListener('click', () => {
      if (sumDone) return;
      sumDone = true;
      sumBtn.disabled = true;
      sumBtn.textContent = '扫描中...';

      const words = sumInputText.querySelectorAll('.td-word');
      const keyWords = sumInputText.querySelectorAll('.td-word.key');

      // Phase 1: scan animation (highlight all words sequentially)
      let idx = 0;
      const scanInterval = setInterval(() => {
        if (idx > 0) words[idx - 1].classList.remove('highlighted');
        if (idx < words.length) {
          words[idx].classList.add('highlighted');
          idx++;
        } else {
          clearInterval(scanInterval);
          // Phase 2: dim non-key, highlight key
          setTimeout(() => {
            words.forEach(w => {
              w.classList.remove('highlighted');
              if (!w.classList.contains('key')) {
                w.classList.add('dimmed');
              } else {
                w.classList.add('highlighted');
              }
            });

            // Phase 3: show output
            setTimeout(() => {
              sumOutput.style.display = 'block';
              sumBtn.textContent = '扫描完成 ✓';
            }, 800);
          }, 400);
        }
      }, 60);
    });
  }

  // -----------------------------------------------
  // 3. Classify demo (Step 4)
  // -----------------------------------------------
  const clsBtn = document.getElementById('cls-btn');
  const clsOutput = document.getElementById('cls-output');
  const clsInputText = document.getElementById('cls-input-text');

  if (clsBtn && clsOutput && clsInputText) {
    let clsDone = false;
    clsBtn.addEventListener('click', () => {
      if (clsDone) return;
      clsDone = true;
      clsBtn.disabled = true;
      clsBtn.textContent = '分析中...';

      const emphWords = clsInputText.querySelectorAll('.td-word.emph');
      const allWords = clsInputText.querySelectorAll('.td-word');

      // Phase 1: scan
      let idx = 0;
      const scanInterval = setInterval(() => {
        if (idx > 0 && allWords[idx - 1]) {
          allWords[idx - 1].style.background = '';
          allWords[idx - 1].style.transition = '';
        }
        if (idx < allWords.length) {
          allWords[idx].style.transition = 'background 0.1s';
          allWords[idx].style.background = 'var(--amber-bg)';
          idx++;
        } else {
          clearInterval(scanInterval);
          // Phase 2: highlight emph words
          setTimeout(() => {
            allWords.forEach(w => { w.style.background = ''; });
            emphWords.forEach(w => {
              w.classList.add('emph-active');
            });

            // Phase 3: show output + animate bars
            setTimeout(() => {
              clsOutput.style.display = 'block';
              clsBtn.textContent = '分析完成 ✓';

              // Animate classify bars
              const clsFills = clsOutput.querySelectorAll('.cls-fill');
              clsFills.forEach(fill => {
                const v = parseFloat(fill.dataset.value || '0');
                setTimeout(() => { fill.style.width = v + '%'; }, 100);
              });
            }, 600);
          }, 400);
        }
      }, 50);
    });
  }

  // -----------------------------------------------
  // 4. Extract demo (Step 5)
  // -----------------------------------------------
  const extBtn = document.getElementById('ext-btn');
  const extOutput = document.getElementById('ext-output');
  const extInputText = document.getElementById('ext-input-text');

  if (extBtn && extOutput && extInputText) {
    let extDone = false;
    extBtn.addEventListener('click', () => {
      if (extDone) return;
      extDone = true;
      extBtn.disabled = true;
      extBtn.textContent = '提取中...';

      const words = extInputText.querySelectorAll('.td-word');

      // Entities to highlight in the input
      const entities = {
        '头疼': 'e-symptom',
        '失眠': 'e-symptom',
        '食欲不好': 'e-symptom',
        '布洛芬': 'e-med',
        '上周': 'e-time',
        '昨天': 'e-time',
        '37.2': 'e-vital',
        '经期': 'e-time',
        '第三天': 'e-time'
      };

      // Phase 1: scan
      let idx = 0;
      const scanInterval = setInterval(() => {
        if (idx > 0 && words[idx - 1]) {
          words[idx - 1].style.background = '';
        }
        if (idx < words.length) {
          words[idx].style.transition = 'background 0.08s';
          words[idx].style.background = 'var(--blue-bg)';
          idx++;
        } else {
          clearInterval(scanInterval);

          // Phase 2: highlight entities in input
          setTimeout(() => {
            words.forEach(w => {
              w.style.background = '';
              const text = w.textContent.trim();
              if (entities[text]) {
                const cls = entities[text];
                w.style.background = cls === 'e-symptom' ? 'var(--red-bg)' :
                                     cls === 'e-med' ? 'var(--blue-bg)' :
                                     cls === 'e-time' ? 'var(--green-bg)' :
                                     cls === 'e-vital' ? 'var(--blue-bg-soft)' : '';
                w.style.fontWeight = '600';
                w.style.padding = '2px 4px';
                w.style.borderRadius = '3px';
              }
            });

            // Phase 3: show output
            setTimeout(() => {
              extOutput.style.display = 'block';
              extBtn.textContent = '提取完成 ✓';
            }, 600);
          }, 400);
        }
      }, 50);
    });
  }

  // -----------------------------------------------
  // 5. Reading Toolkit widget (Step 8)
  // -----------------------------------------------
  const toolkit = document.getElementById('reading-toolkit');
  if (!toolkit) return;

  // Tab switching
  const rtTabs = toolkit.querySelectorAll('.rt-tab');
  const rtPanels = toolkit.querySelectorAll('.rt-panel');

  rtTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      rtTabs.forEach(t => t.classList.toggle('active', t === tab));
      rtPanels.forEach(p => p.classList.toggle('active', p.dataset.mode === mode));
    });
  });

  // Process buttons
  const processButtons = toolkit.querySelectorAll('.rt-process');
  processButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      processText(mode);
    });
  });

  function processText(mode) {
    const inputEl = document.getElementById(`rt-${mode.substring(0, 3)}-input`);
    const outputEl = document.getElementById(`rt-${mode.substring(0, 3)}-output`);
    const resultEl = document.getElementById(`rt-${mode.substring(0, 3)}-result`);

    if (!inputEl || !outputEl || !resultEl) return;

    const text = inputEl.value.trim();
    if (!text) return;

    if (mode === 'summarize') {
      // Generate summary
      const sentences = text.split(/[。.!！？?，,]/).filter(s => s.trim().length > 3);
      const summary = sentences.slice(0, 3).map(s => {
        const trimmed = s.trim();
        return trimmed.length > 25 ? trimmed.substring(0, 25) + '...' : trimmed;
      });

      resultEl.innerHTML = `<div class="rt-sum-bullets">` +
        summary.map(s => `<p>&#8226; ${s}</p>`).join('') +
        `<p style="font-size:12px;color:var(--ink-muted);margin-top:10px;">
          ${text.length} 字 &rarr; ${summary.join('').length} 字. 压缩率 ${Math.round((1 - summary.join('').length / text.length) * 100)}%
        </p></div>`;
    }

    else if (mode === 'classify') {
      // Simple keyword-based classification demo
      const keywords = {
        positive: ['好', '开心', '快乐', '棒', '喜欢', '高兴', '犒劳', '超', '美', '笑'],
        anxious: ['焦虑', '压力', '紧张', '烦', '急', '担心', '不安'],
        tired: ['累', '疲', '困', '睡不好', '失眠', '乏', '没劲'],
        sad: ['难过', '低落', '伤心', '哭', '沮丧', '郁闷']
      };

      let scores = { '愉快': 10, '焦虑': 10, '疲惫': 10, '沮丧': 10, '平静': 20 };
      const colors = { '愉快': 'var(--green)', '焦虑': 'var(--amber)', '疲惫': 'var(--red)', '沮丧': 'var(--purple)', '平静': 'var(--blue)' };

      for (const char of text) {
        if (keywords.positive.some(k => text.includes(k))) scores['愉快'] += 15;
        if (keywords.anxious.some(k => text.includes(k))) scores['焦虑'] += 15;
        if (keywords.tired.some(k => text.includes(k))) scores['疲惫'] += 15;
        if (keywords.sad.some(k => text.includes(k))) scores['沮丧'] += 15;
        break; // Only count once
      }

      // Normalize
      const total = Object.values(scores).reduce((a, b) => a + b, 0);
      Object.keys(scores).forEach(k => { scores[k] = Math.round(scores[k] / total * 100); });

      // Sort by score
      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

      resultEl.innerHTML = `<div class="rt-cls-bars">` +
        sorted.map(([label, score]) => `
          <div class="rt-cls-bar">
            <span class="rt-cls-label">${label}</span>
            <div class="rt-cls-track">
              <div class="rt-cls-fill" style="width:0;background:${colors[label]}" data-value="${score}">
                <span>${score}%</span>
              </div>
            </div>
          </div>
        `).join('') +
        `</div>
        <div style="margin-top:8px;">
          <span class="pill" style="background:var(--amber-bg);color:var(--amber)">主要情绪: ${sorted[0][0]}</span>
        </div>`;

      // Animate bars
      setTimeout(() => {
        resultEl.querySelectorAll('.rt-cls-fill').forEach(fill => {
          const v = parseFloat(fill.dataset.value || '0');
          fill.style.width = v + '%';
        });
      }, 100);
    }

    else if (mode === 'extract') {
      // Simple entity extraction demo
      const entityRules = [
        { pattern: /(\d+\.?\d*)\s*(kg|公斤|斤)/gi, type: '体重', cls: 'e-vital' },
        { pattern: /(\d+\.?\d*)\s*度/gi, type: '体温', cls: 'e-vital' },
        { pattern: /(\d+)\s*步/gi, type: '步数', cls: 'e-vital' },
        { pattern: /(\d+)\s*(小时|个小时|hrs?)/gi, type: '睡眠', cls: 'e-vital' },
        { pattern: /(鸡蛋|粥|水果|火锅|面包|牛奶|米饭|蔬菜|肉|鱼|豆腐)/g, type: '饮食', cls: 'e-cause' },
        { pattern: /(布洛芬|维生素\s*[A-Za-z]*|阿司匹林|感冒药|止痛药|叶酸)/g, type: '用药', cls: 'e-med' },
        { pattern: /(头疼|失眠|腹痛|恶心|疲劳|头晕|不舒服|痛经|发烧)/g, type: '症状', cls: 'e-symptom' },
        { pattern: /(瑜伽|跑步|游泳|散步|运动|健身)/g, type: '运动', cls: 'e-time' },
      ];

      const extracted = {};
      entityRules.forEach(rule => {
        const matches = text.match(rule.pattern);
        if (matches) {
          if (!extracted[rule.type]) extracted[rule.type] = [];
          matches.forEach(m => {
            if (!extracted[rule.type].includes(m)) extracted[rule.type].push(m);
          });
        }
      });

      if (Object.keys(extracted).length === 0) {
        resultEl.innerHTML = `<p style="color:var(--ink-muted)">没有识别到明显的结构化实体. 试试输入含有症状、用药、运动、饮食等关键词的文本.</p>`;
      } else {
        const clsMap = {};
        entityRules.forEach(r => { clsMap[r.type] = r.cls; });

        resultEl.innerHTML = `<div class="rt-ext-fields">` +
          Object.entries(extracted).map(([type, vals]) => `
            <div class="rt-ext-field">
              <span style="color:var(--blue);font-weight:600;">${type}:</span>
              ${vals.map(v => `<span class="r-entity ${clsMap[type] || 'e-symptom'}">${v}</span>`).join(' ')}
            </div>
          `).join('') +
          `</div>`;
      }
    }

    outputEl.style.display = 'block';
    outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

})();
