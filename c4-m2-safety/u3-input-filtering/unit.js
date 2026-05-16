/* U3 Input Filter Builder Widget */
(() => {
  'use strict';

  const widget = document.getElementById('filter-builder');
  if (!widget) return;

  // State
  let keywords = ['忽略指令', '忽略前面', 'system prompt', 'ignore previous', 'DAN', '你现在是', 'do anything now'];
  let sensitivity = 1; // 0=low, 1=mid, 2=high
  let testHistory = [];

  // Semantic patterns (simulated classifier)
  const semanticPatterns = [
    { pattern: /忽略|ignore|disregard|无视/i, reason: '指令覆盖意图', category: 'injection' },
    { pattern: /system\s*prompt|系统提示|初始指令/i, reason: '提取系统指令', category: 'injection' },
    { pattern: /你现在是|你扮演|act as|pretend|roleplay/i, reason: '角色切换攻击', category: 'jailbreak' },
    { pattern: /没有限制|无限制|unrestricted|no rules|no limits/i, reason: '解除限制', category: 'jailbreak' },
    { pattern: /base64|decode|编码|解码/i, reason: '编码绕过', category: 'obfuscation' },
    { pattern: /处方|诊断|该吃什么药|剂量/i, reason: '医疗越界 (需审慎)', category: 'medical' },
    { pattern: /自杀|自残|自伤|想死/i, reason: '自伤风险 (紧急)', category: 'safety' },
  ];

  // DOM refs
  const keywordList = document.getElementById('keyword-list');
  const keywordInput = document.getElementById('keyword-input');
  const addKeywordBtn = document.getElementById('add-keyword-btn');
  const sensitivitySlider = document.getElementById('sensitivity-slider');
  const sensitivityLabel = document.getElementById('sensitivity-label');
  const testInput = document.getElementById('test-input');
  const testBtn = document.getElementById('test-btn');
  const testResults = document.getElementById('test-results');
  const statTotal = document.getElementById('stat-total');
  const statPass = document.getElementById('stat-pass');
  const statBlock = document.getElementById('stat-block');
  const statFP = document.getElementById('stat-fp');

  function renderKeywords() {
    keywordList.innerHTML = '';
    keywords.forEach((kw, i) => {
      const tag = document.createElement('span');
      tag.className = 'keyword-tag';
      tag.innerHTML = `${kw} <span class="remove-kw" data-idx="${i}">&times;</span>`;
      keywordList.appendChild(tag);
    });
    // Bind remove
    keywordList.querySelectorAll('.remove-kw').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        keywords.splice(parseInt(btn.dataset.idx), 1);
        renderKeywords();
      });
    });
  }

  function addKeyword() {
    const val = keywordInput.value.trim();
    if (val && !keywords.includes(val)) {
      keywords.push(val);
      keywordInput.value = '';
      renderKeywords();
    }
  }

  function updateSensitivity() {
    sensitivity = parseInt(sensitivitySlider.value);
    const labels = ['低 (宽松)', '中 (标准)', '高 (严格)'];
    sensitivityLabel.textContent = labels[sensitivity];
  }

  function testMessage(msg) {
    if (!msg.trim()) return;

    let blocked = false;
    let reasons = [];

    // 1. Keyword check
    for (const kw of keywords) {
      if (msg.toLowerCase().includes(kw.toLowerCase())) {
        blocked = true;
        reasons.push(`关键词匹配: "${kw}"`);
      }
    }

    // 2. Semantic pattern check
    for (const sp of semanticPatterns) {
      if (sp.pattern.test(msg)) {
        if (sp.category === 'medical' && sensitivity < 2) {
          // Only block medical at high sensitivity
          if (sensitivity === 1) {
            reasons.push(`⚠️ 语义提醒: ${sp.reason} (未拦截, 中等灵敏度)`);
          }
        } else {
          blocked = true;
          reasons.push(`语义检测: ${sp.reason}`);
        }
      }
    }

    // 3. Sensitivity adjustments
    if (sensitivity === 2) {
      // High: also flag question marks with certain words
      if (/怎么.*绕|how.*bypass|hack|攻击|exploit/i.test(msg)) {
        blocked = true;
        reasons.push('高灵敏度: 潜在攻击意图');
      }
    }
    if (sensitivity === 0 && reasons.length > 0 && !reasons.some(r => r.includes('关键词'))) {
      // Low sensitivity: only block exact keyword matches
      blocked = false;
      reasons = reasons.map(r => r + ' (低灵敏度, 未拦截)');
    }

    // Determine if false positive (simulated)
    const isFP = blocked && /经期|月经|痛经|头痛|感冒|维生素|钙片/.test(msg) && sensitivity >= 2;

    const result = { msg, blocked, reasons, isFP };
    testHistory.unshift(result);
    if (testHistory.length > 8) testHistory.pop();

    renderResults();
    updateStats();
  }

  function renderResults() {
    testResults.innerHTML = '';
    testHistory.forEach(r => {
      const div = document.createElement('div');
      div.className = 'test-result-item ' + (r.blocked ? 'test-result-block' : 'test-result-pass');
      div.innerHTML = `
        <span class="test-verdict ${r.blocked ? 'test-verdict-block' : 'test-verdict-pass'}">${r.blocked ? '🚫 拦截' : '✅ 通过'}</span>
        <div>
          <div style="font-size:13px;margin-bottom:4px;">"${r.msg}"</div>
          <div class="test-reason">${r.reasons.length ? r.reasons.join(' · ') : '无匹配规则, 允许通过'}${r.isFP ? ' <strong style="color:var(--amber);">⚠ 可能误杀</strong>' : ''}</div>
        </div>
      `;
      testResults.appendChild(div);
    });
  }

  function updateStats() {
    const total = testHistory.length;
    const blocked = testHistory.filter(r => r.blocked).length;
    const passed = total - blocked;
    const fp = testHistory.filter(r => r.isFP).length;

    statTotal.textContent = total;
    statPass.textContent = passed;
    statBlock.textContent = blocked;
    statFP.textContent = fp;
  }

  // Events
  addKeywordBtn.addEventListener('click', addKeyword);
  keywordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addKeyword(); });
  sensitivitySlider.addEventListener('input', updateSensitivity);
  testBtn.addEventListener('click', () => testMessage(testInput.value));
  testInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { testMessage(testInput.value); testInput.value = ''; }
  });

  // Pre-fill some test examples
  const examples = document.querySelectorAll('.test-example');
  examples.forEach(ex => {
    ex.addEventListener('click', () => {
      testInput.value = ex.dataset.msg;
      testMessage(ex.dataset.msg);
      testInput.value = '';
    });
  });

  // Init
  renderKeywords();
  updateSensitivity();
  updateStats();
})();
