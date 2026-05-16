/* U7 · P50/P95 Latency Visualizer */
(() => {
  'use strict';

  // Simulated latency distributions (ms)
  const scenarios = {
    'chat-good': {
      name: 'AI 聊天 (优化后)',
      data: [50,80,120,200,350,500,450,300,180,100,60,30,20,12,8,5,3,2,1,1],
      labels: ['0-0.5s','','1s','','2s','','3s','','4s','','5s','','6s','','7s','','8s','','9s','10s+'],
      p50: 2.1, p95: 4.8, avg: 2.6, p99: 7.2
    },
    'chat-bad': {
      name: 'AI 聊天 (未优化)',
      data: [20,30,60,100,180,250,300,350,280,200,150,120,90,70,50,40,30,25,20,15],
      labels: ['0-0.5s','','1s','','2s','','3s','','4s','','5s','','6s','','7s','','8s','','9s','10s+'],
      p50: 3.8, p95: 8.5, avg: 4.2, p99: 12.1
    },
    'summary': {
      name: 'AI 日报生成',
      data: [100,200,350,500,400,250,150,80,40,20,10,5,3,2,1,1,0,0,0,0],
      labels: ['0-0.5s','','1s','','2s','','3s','','4s','','5s','','6s','','7s','','8s','','9s','10s+'],
      p50: 1.5, p95: 3.8, avg: 1.9, p99: 5.1
    },
  };

  const select = document.getElementById('lat-scenario');
  const histEl = document.getElementById('lat-histogram');
  const markersEl = document.getElementById('lat-markers');
  const statP50 = document.getElementById('stat-p50');
  const statP95 = document.getElementById('stat-p95');
  const statAvg = document.getElementById('stat-avg');
  const statP99 = document.getElementById('stat-p99');

  if (!select || !histEl) return;

  function render(key) {
    const s = scenarios[key];
    if (!s) return;
    const maxVal = Math.max(...s.data);

    histEl.innerHTML = '';
    s.data.forEach((v, i) => {
      const pct = (v / maxVal) * 100;
      const bar = document.createElement('div');
      bar.className = 'hist-bar';
      bar.style.height = pct + '%';
      // Color: green for fast, amber for mid, red for slow
      if (i < 6) bar.style.background = 'var(--green)';
      else if (i < 12) bar.style.background = 'var(--amber)';
      else bar.style.background = 'var(--red)';

      const tooltip = document.createElement('span');
      tooltip.className = 'hist-tooltip';
      tooltip.textContent = `${s.labels[i] || ''}: ${v} 次`;
      bar.appendChild(tooltip);
      histEl.appendChild(bar);
    });

    // Position markers
    markersEl.innerHTML = '';
    const totalBars = s.data.length;
    const addMarker = (position, label, cls) => {
      const m = document.createElement('div');
      m.className = 'hist-marker ' + cls;
      m.style.left = (position / totalBars * 100) + '%';
      const lbl = document.createElement('span');
      lbl.className = 'hist-marker-label';
      lbl.textContent = label;
      m.appendChild(lbl);
      markersEl.appendChild(m);
    };

    addMarker(s.p50 / 10 * totalBars / 1, `P50: ${s.p50}s`, 'marker-p50');
    addMarker(s.p95 / 10 * totalBars / 1, `P95: ${s.p95}s`, 'marker-p95');
    addMarker(s.avg / 10 * totalBars / 1, `Avg: ${s.avg}s`, 'marker-avg');

    statP50.textContent = s.p50 + 's';
    statP50.style.color = s.p50 <= 2 ? 'var(--green)' : s.p50 <= 4 ? 'var(--amber)' : 'var(--red)';
    statP95.textContent = s.p95 + 's';
    statP95.style.color = s.p95 <= 5 ? 'var(--green)' : s.p95 <= 8 ? 'var(--amber)' : 'var(--red)';
    statAvg.textContent = s.avg + 's';
    statAvg.style.color = 'var(--amber)';
    statP99.textContent = s.p99 + 's';
    statP99.style.color = s.p99 <= 8 ? 'var(--amber)' : 'var(--red)';
  }

  select.addEventListener('change', () => render(select.value));
  render(select.value);
})();
