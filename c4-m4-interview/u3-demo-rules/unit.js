/* U3: Demo演示三分钟法则 — Demo Timer Widget */
(() => {
  'use strict';

  const timerEl = document.getElementById('demo-timer');
  if (!timerEl) return;

  const sections = [
    { name: '痛点', duration: 30, color: 'var(--red)', bg: 'var(--red-bg)', script: '说清用户痛点, 引起共鸣' },
    { name: '方案', duration: 30, color: 'var(--blue)', bg: 'var(--blue-bg)', script: '你的 AI 方案如何解决' },
    { name: '演示', duration: 60, color: 'var(--green)', bg: 'var(--green-bg)', script: '现场展示产品核心功能' },
    { name: '数据', duration: 30, color: 'var(--amber)', bg: 'var(--amber-bg)', script: '关键指标和成果数据' },
    { name: '反思', duration: 30, color: 'var(--purple)', bg: 'var(--purple-bg)', script: '学到了什么, 下一步是什么' }
  ];

  const totalDuration = sections.reduce((sum, s) => sum + s.duration, 0);
  let timerInterval = null;
  let elapsed = 0;
  let isRunning = false;

  const displayEl = document.getElementById('timer-display');
  const sectionLabelEl = document.getElementById('timer-section-label');
  const progressFillEl = document.getElementById('timer-progress-fill');
  const startBtn = document.getElementById('timer-start');
  const resetBtn = document.getElementById('timer-reset');

  function getCurrentSection() {
    let cumulative = 0;
    for (let i = 0; i < sections.length; i++) {
      cumulative += sections[i].duration;
      if (elapsed < cumulative) return { index: i, section: sections[i], sectionElapsed: elapsed - (cumulative - sections[i].duration), sectionRemaining: cumulative - elapsed };
    }
    return { index: sections.length - 1, section: sections[sections.length - 1], sectionElapsed: sections[sections.length - 1].duration, sectionRemaining: 0 };
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function update() {
    const remaining = Math.max(0, totalDuration - elapsed);
    displayEl.textContent = formatTime(remaining);

    // Color based on time left
    displayEl.className = 'timer-display';
    if (remaining <= 10) displayEl.classList.add('danger');
    else if (remaining <= 30) displayEl.classList.add('warning');

    // Progress
    const pct = (elapsed / totalDuration) * 100;
    progressFillEl.style.width = Math.min(100, pct) + '%';

    // Section label
    const current = getCurrentSection();
    sectionLabelEl.textContent = current.section.name + ' (' + current.section.duration + 's)';
    sectionLabelEl.style.background = current.section.bg;
    sectionLabelEl.style.color = current.section.color;

    // Highlight timeline segment
    document.querySelectorAll('.timeline-segment').forEach((seg, i) => {
      seg.classList.toggle('active', i === current.index);
    });

    // Bell at transitions
    if (elapsed > 0) {
      let cumulative = 0;
      for (const s of sections) {
        cumulative += s.duration;
        if (elapsed === cumulative && elapsed < totalDuration) {
          playBell();
          break;
        }
      }
    }

    if (elapsed >= totalDuration) {
      stop();
      playBell();
      displayEl.textContent = '0:00';
      sectionLabelEl.textContent = '完成!';
      sectionLabelEl.style.background = 'var(--green-bg)';
      sectionLabelEl.style.color = 'var(--green)';
    }
  }

  function playBell() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) { /* no audio context available */ }
  }

  function start() {
    if (isRunning) return;
    if (elapsed >= totalDuration) elapsed = 0;
    isRunning = true;
    startBtn.textContent = '暂停';
    timerInterval = setInterval(() => {
      elapsed++;
      update();
    }, 1000);
  }

  function pause() {
    isRunning = false;
    startBtn.textContent = '继续';
    clearInterval(timerInterval);
  }

  function stop() {
    isRunning = false;
    startBtn.textContent = '开始练习';
    clearInterval(timerInterval);
  }

  function reset() {
    stop();
    elapsed = 0;
    update();
  }

  startBtn.addEventListener('click', () => {
    if (isRunning) pause();
    else start();
  });

  resetBtn.addEventListener('click', reset);

  // Timeline segment clicks — show detail
  const detailEl = document.getElementById('timeline-detail');
  const detailScripts = [
    { title: '30s — 痛点 (Pain Point)', script: '"女性用户每天要手动记录身体状态 — 经期、情绪、饮食、运动. 调研显示, 60% 的用户觉得这个过程太麻烦, 导致 D30 留存率只有 15%."', tip: '用数据说话, 让面试官感受到问题的严重性.' },
    { title: '30s — 方案 (Solution)', script: '"我设计了 AI 智能记录功能: 用户只需说一句话, 比如\'今天有点累, 中午吃了沙拉\', AI 就能自动提取情绪、饮食、运动信息, 自动分类到我们的 5 状态体系."', tip: '一句话说清你的方案, 不要展开技术细节.' },
    { title: '60s — 演示 (Live Demo)', script: '"我来现场演示一下. [打开 App] 我输入\'昨晚没睡好, 早上跑了 3 公里, 心情还行\'. 你看, AI 自动识别了: 睡眠状态 — 欠佳; 运动 — 跑步 3km; 情绪 — 平稳. 这些都自动填入了今天的记录."', tip: '提前准备好演示环境, 确保网络通畅. 边操作边解说.' },
    { title: '30s — 数据 (Metrics)', script: '"上线 6 周后, D30 留存率从 15% 提升到 28%. 月 Token 成本控制在 $108. NPS 从 32 提升到 51. AI 功能日均使用率 73%."', tip: '4 个数据, 每个 7 秒, 简洁有力.' },
    { title: '30s — 反思 (Reflection)', script: '"回顾这个项目, 我学到最重要的一点是: 先用最小方案验证, 再逐步升级技术栈. 我们一开始用 Prompt Engineering 就能解决 80% 的问题, Fine-tune 留到真正需要时再做. 下一步计划是加入多轮对话能力."', tip: '展示自我反思能力, 面试官最看重这个.' }
  ];

  document.querySelectorAll('.timeline-segment').forEach((seg, i) => {
    seg.addEventListener('click', () => {
      if (detailEl) {
        const d = detailScripts[i];
        detailEl.innerHTML = `
          <div class="timeline-detail-title" style="color:${sections[i].color}">${d.title}</div>
          <div class="timeline-detail-script">${d.script}</div>
          <div class="timeline-detail-tip">${d.tip}</div>
        `;
      }
    });
  });

  // Initial state
  update();
  if (detailEl) {
    const d = detailScripts[0];
    detailEl.innerHTML = `
      <div class="timeline-detail-title" style="color:${sections[0].color}">${d.title}</div>
      <div class="timeline-detail-script">${d.script}</div>
      <div class="timeline-detail-tip">${d.tip}</div>
    `;
  }
})();
