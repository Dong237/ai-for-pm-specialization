/* U7: Router Designer Widget */
(() => {
  'use strict';
  const widget = document.getElementById('router-designer');
  if (!widget) return;

  const intents = [
    { id: 'nutrition', label: '"我今天吃什么好?"', correct: 'nutrition-agent' },
    { id: 'cycle', label: '"我的经期什么时候来?"', correct: 'cycle-agent' },
    { id: 'mood', label: '"我心情不太好..."', correct: 'mood-agent' },
    { id: 'diet-cycle', label: '"经期期间该怎么吃?"', correct: 'nutrition-agent' },
    { id: 'mood-food', label: '"心情不好吃什么能开心点?"', correct: 'mood-agent' },
    { id: 'reminder', label: '"提醒我明天吃维生素"', correct: 'nutrition-agent' }
  ];

  const agents = [
    { id: 'nutrition-agent', label: '营养 Agent', color: 'green' },
    { id: 'cycle-agent', label: '周期 Agent', color: 'blue' },
    { id: 'mood-agent', label: '情绪 Agent', color: 'amber' }
  ];

  const testQueries = [
    { text: '"帮我看看今天的饮食够不够均衡"', correct: 'nutrition-agent' },
    { text: '"下次经期大概几号?"', correct: 'cycle-agent' },
    { text: '"我最近压力好大"', correct: 'mood-agent' },
    { text: '"经期能喝冰的吗?"', correct: 'nutrition-agent' },
    { text: '"我觉得很焦虑, 有什么办法?"', correct: 'mood-agent' },
    { text: '"周期不太规律怎么办?"', correct: 'cycle-agent' }
  ];

  let connections = {}; // intent_id -> agent_id
  let selectedIntent = null;

  const intentListEl = document.getElementById('intent-list');
  const agentListEl = document.getElementById('agent-list');
  const connectionsEl = document.getElementById('connections-display');
  const testBtn = document.getElementById('router-test');
  const testResultsEl = document.getElementById('test-results');
  const resetBtn = document.getElementById('router-reset');

  function renderIntents() {
    if (!intentListEl) return;
    intentListEl.innerHTML = '';
    intents.forEach(intent => {
      const el = document.createElement('div');
      el.className = 'intent-item' + (selectedIntent === intent.id ? ' selected' : '') + (connections[intent.id] ? ' linked' : '');
      el.innerHTML = intent.label + (connections[intent.id] ? `<span class="link-badge">→ ${agents.find(a => a.id === connections[intent.id])?.label || ''}</span>` : '');
      el.addEventListener('click', () => { selectedIntent = intent.id; renderIntents(); renderAgents(); });
      intentListEl.appendChild(el);
    });
  }

  function renderAgents() {
    if (!agentListEl) return;
    agentListEl.innerHTML = '';
    agents.forEach(agent => {
      const el = document.createElement('div');
      el.className = 'agent-item' + (selectedIntent && connections[selectedIntent] === agent.id ? ' selected' : '');
      el.textContent = agent.label;
      el.addEventListener('click', () => {
        if (selectedIntent) {
          connections[selectedIntent] = agent.id;
          selectedIntent = null;
          renderIntents();
          renderAgents();
          renderConnections();
        }
      });
      agentListEl.appendChild(el);
    });
  }

  function renderConnections() {
    if (!connectionsEl) return;
    const entries = Object.entries(connections);
    if (entries.length === 0) {
      connectionsEl.innerHTML = '<span style="color:var(--ink-muted);font-style:italic;">点击左边的意图, 再点右边的 Agent 来建立连接</span>';
      return;
    }
    connectionsEl.innerHTML = entries.map(([iid, aid]) => {
      const intent = intents.find(i => i.id === iid);
      const agent = agents.find(a => a.id === aid);
      return `<div class="connection-line"><span class="connection-intent">${intent?.label || iid}</span><span class="connection-arrow">→</span><span class="connection-agent">${agent?.label || aid}</span></div>`;
    }).join('');
  }

  function runTest() {
    if (!testResultsEl) return;
    let score = 0;
    let html = '';
    testQueries.forEach(q => {
      // Find which agent this would route to based on user's connections
      // Simple: find best matching intent
      let routed = null;
      for (const [iid, aid] of Object.entries(connections)) {
        const intent = intents.find(i => i.id === iid);
        if (intent && intent.correct === q.correct && aid === q.correct) {
          routed = aid;
          break;
        }
      }
      // Fallback: check if any connection maps to the correct agent
      if (!routed) {
        for (const [iid, aid] of Object.entries(connections)) {
          if (aid === q.correct) { routed = aid; break; }
        }
      }
      const isCorrect = routed === q.correct;
      if (isCorrect) score++;
      const agent = agents.find(a => a.id === q.correct);
      html += `<div class="test-query"><span class="test-query-text">${q.text}</span><span class="test-expected ${isCorrect ? 'correct' : 'wrong'}">${isCorrect ? '✓ ' + agent?.label : '✗ 应该 → ' + agent?.label}</span></div>`;
    });
    html += `<div class="test-score" style="color:${score >= 5 ? 'var(--green)' : score >= 3 ? 'var(--amber)' : 'var(--red)'};">${score} / ${testQueries.length} 正确</div>`;
    testResultsEl.innerHTML = html;
    testResultsEl.classList.add('show');
  }

  function reset() {
    connections = {};
    selectedIntent = null;
    if (testResultsEl) { testResultsEl.classList.remove('show'); testResultsEl.innerHTML = ''; }
    renderIntents();
    renderAgents();
    renderConnections();
  }

  if (testBtn) testBtn.addEventListener('click', runTest);
  if (resetBtn) resetBtn.addEventListener('click', reset);

  renderIntents();
  renderAgents();
  renderConnections();
})();
