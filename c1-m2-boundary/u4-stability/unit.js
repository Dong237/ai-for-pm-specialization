/* ===== Unit 4 · Stability Tester Widget ===== */
(() => {
  'use strict';

  // ----- Data: simulated AI responses at different temperatures -----
  // Each temperature level has 5 response variants for "经期可以跑步吗?"
  // Differences increase with temperature.

  const responseSets = {
    0: [
      { text: '经期可以进行<b>适度</b>的跑步运动。建议选择<b>慢跑</b>，控制在<b>20-30分钟</b>以内，注意倾听身体信号。如果出现不适，请立即停止。', diffs: [] },
      { text: '经期可以进行<b>适度</b>的跑步运动。建议选择<b>慢跑</b>，控制在<b>20-30分钟</b>以内，注意倾听身体信号。如果出现不适，请立即停止。', diffs: [] },
      { text: '经期可以进行<b>适度</b>的跑步运动。建议选择<b>慢跑</b>，控制在<b>20-30分钟</b>以内，注意倾听身体信号。如果出现不适，请立即停止。', diffs: [] },
      { text: '经期可以进行<b>适度</b>的跑步运动。建议选择<b>慢跑</b>，控制在<b>20-30分钟</b>以内，注意倾听身体信号。如果出现不适，请立即停止。', diffs: [] },
      { text: '经期可以进行<b>适度</b>的跑步运动。建议选择<b>慢跑</b>，控制在<b>20-30分钟</b>以内，注意倾听身体信号。如果出现不适，请立即停止。', diffs: [] },
    ],
    0.3: [
      { text: '经期可以进行<b>适度</b>的跑步运动。建议选择<b>慢跑</b>，控制在<b>20-30分钟</b>以内，注意倾听身体信号。如果出现不适，请立即停止。', diffs: [] },
      { text: '经期可以进行<b>适度</b>的跑步。建议选择<b>慢跑</b>，时间控制在<b>20-30分钟</b>，注意身体反馈。<span class="diff">不适时应停止运动</span>。', diffs: ['运动→跑步', '倾听身体信号→身体反馈'] },
      { text: '经期可以进行<b>适度</b>的跑步运动。建议选择<b>慢跑</b>，控制在<b>20-30分钟</b>以内，注意倾听身体信号。如果出现不适，请立即停止。', diffs: [] },
      { text: '经期<span class="diff">适合</span>进行<b>适度</b>的跑步。建议<b>慢跑</b>，控制在<b>20-30分钟</b>以内，<span class="diff">留意</span>身体信号。不适时请停止。', diffs: ['可以→适合', '注意倾听→留意'] },
      { text: '经期可以进行<b>适度</b>的跑步运动。建议选择<b>慢跑</b>，控制在<b>20-30分钟</b>以内，注意倾听身体信号。如果出现不适，请立即停止。', diffs: [] },
    ],
    0.7: [
      { text: '经期可以进行<b>适度</b>的跑步运动。建议选择<b>慢跑</b>，控制在<b>20-30分钟</b>以内，注意倾听身体信号。如果出现不适，请立即停止。', diffs: [] },
      { text: '经期<span class="diff">是可以跑步的</span>! 不过建议<b>慢跑</b>为主，<span class="diff">时长别超过半小时</span>。运动前<span class="diff">做好热身</span>，感到不舒服就停下来。', diffs: ['语气更口语化', '加了热身建议'] },
      { text: '<span class="diff">一般来说</span>，经期可以<b>适度</b>跑步。选择<b>慢跑</b>或<span class="diff">快走</span>，<b>20-30分钟</b>即可。<span class="diff">注意保暖</span>，不适时停止。', diffs: ['加了快走选项', '加了保暖建议'] },
      { text: '经期跑步<span class="diff">没问题</span>，但要<b>适度</b>。建议<b>慢跑</b> <b>20分钟</b>左右，<span class="diff">避免剧烈运动</span>。出现<span class="diff">痛经加重</span>的情况请停止。', diffs: ['时间变成20分钟', '加了避免剧烈运动'] },
      { text: '经期<span class="diff">完全可以</span>跑步! <b>适度</b>运动还能<span class="diff">缓解经期不适</span>。建议<b>慢跑</b> <b>30分钟</b>以内，<span class="diff">听从身体感受</span>。', diffs: ['语气很肯定', '加了缓解不适说法'] },
    ],
    1.0: [
      { text: '经期跑步<span class="diff">因人而异</span>。如果你平时有跑步习惯，<span class="diff">经期前两天建议休息</span>，第3天开始可以<b>慢跑</b>。', diffs: ['加了分天建议'] },
      { text: '<span class="diff">可以的!</span> 经期运动有助于<span class="diff">释放内啡肽</span>，减轻痛感。推荐<b>慢跑</b>或<span class="diff">瑜伽</span>，<span class="diff">40分钟</span>以内为宜。', diffs: ['提到内啡肽', '时间变40分钟', '加了瑜伽'] },
      { text: '经期<span class="diff">建议避免跑步</span>，可以选择<span class="diff">散步或轻度瑜伽</span>代替。跑步可能<span class="diff">加重子宫下坠感</span>。', diffs: ['建议不跑步!', '矛盾答案'] },
      { text: '经期跑步<span class="diff">完全OK</span>! 适度运动<span class="diff">有益经期健康</span>。<b>慢跑</b> <b>20-30分钟</b>最佳，<span class="diff">记得补水</span>，不舒服就停。', diffs: ['很肯定的语气', '加了补水'] },
      { text: '<span class="diff">视个人体质而定</span>。经期前两天<span class="diff">不建议剧烈运动</span>，后几天可以<b>慢跑</b>。<span class="diff">注意经期卫生</span>，<span class="diff">穿运动型卫生用品</span>。', diffs: ['加了卫生用品建议', '分阶段建议'] },
    ],
    1.5: [
      { text: '经期跑步? <span class="diff">当然可以啦!</span> 跑步是<span class="diff">最棒的经期伴侣</span>! 推荐<span class="diff">晨跑</span>，<span class="diff">最好在草地上</span>，<b>30分钟</b>。<span class="diff">加油!</span>', diffs: ['极度口语化', '加了草地建议??'] },
      { text: '<span class="diff">经期运动需谨慎。</span>建议<span class="diff">前三天卧床休息</span>，第4天开始<span class="diff">散步</span>。跑步<span class="diff">可能导致经血量增加</span>，<span class="diff">建议咨询医生</span>。', diffs: ['建议卧床??', '过度保守'] },
      { text: '经期可以跑步，<span class="diff">但要注意月球周期对身体的影响</span>。<span class="diff">新月期间</span>适合慢跑，<span class="diff">满月期间</span>适合<span class="diff">冥想</span>。', diffs: ['月球周期...??', '完全跑偏'] },
      { text: '<span class="diff">必须跑!</span> 经期运动<span class="diff">是女性力量的体现</span>。推荐<span class="diff">间歇跑</span>，<span class="diff">5组×400米</span>。<span class="diff">配合蛋白粉</span>效果更佳!', diffs: ['建议间歇跑?!', '蛋白粉??', '危险建议'] },
      { text: '经期<span class="diff">不建议任何运动</span>。<span class="diff">中医认为</span>经期应<span class="diff">静养</span>，运动会<span class="diff">导致气血不足</span>。建议<span class="diff">喝红糖水</span>，<span class="diff">卧床休息</span>。', diffs: ['完全否定运动', '未经验证的中医说法'] },
    ]
  };

  const consistencyScores = {
    0: 100,
    0.3: 88,
    0.7: 62,
    1.0: 35,
    1.5: 12
  };

  const consistencyNotes = {
    0: 'T=0: 5 次输出完全相同. 医疗/健康产品的理想状态.',
    0.3: 'T=0.3: 措辞微调, 核心建议一致. 可以接受.',
    0.7: 'T=0.7 (默认): 语气/内容开始分化. 有的加了"热身"、有的加了"保暖". 不同但不矛盾.',
    1.0: 'T=1.0: 出现矛盾! 有的说"完全OK", 有的说"建议避免". 健康产品绝对不能接受.',
    1.5: 'T=1.5: 完全失控. 月球周期? 间歇跑? 卧床休息? 每次都是不同的"专家"在答.'
  };

  // ----- DOM setup -----
  const tempSlider = document.getElementById('stab-temp-slider');
  const tempVal = document.getElementById('stab-temp-val');
  const runsContainer = document.getElementById('stab-runs');
  const gaugeArc = document.getElementById('gauge-arc');
  const gaugeText = document.getElementById('gauge-text');
  const gaugeNote = document.getElementById('gauge-note');
  const runBtn = document.getElementById('stab-run-btn');
  const resetBtn = document.getElementById('stab-reset-btn');

  if (!tempSlider || !runsContainer) return;

  const tempStops = [0, 0.3, 0.7, 1.0, 1.5];

  function getTemp() {
    const idx = parseInt(tempSlider.value, 10);
    return tempStops[idx];
  }

  function updateTempDisplay() {
    const t = getTemp();
    tempVal.textContent = t.toFixed(1);
  }

  // Gauge arc math: semicircle from left to right
  // Arc path: center (70,65), radius 50, from 180° to 0°
  const arcLen = Math.PI * 50; // half circumference

  function renderGauge(score) {
    const offset = arcLen * (1 - score / 100);
    gaugeArc.style.strokeDasharray = arcLen;
    gaugeArc.style.strokeDashoffset = offset;

    // Color based on score
    let color;
    if (score >= 80) color = 'var(--green)';
    else if (score >= 50) color = 'var(--amber)';
    else color = 'var(--red)';
    gaugeArc.style.stroke = color;

    gaugeText.textContent = score + '%';
  }

  function renderRuns() {
    const t = getTemp();
    const runs = responseSets[t];
    const score = consistencyScores[t];
    const note = consistencyNotes[t];

    runsContainer.innerHTML = '';
    runs.forEach((run, i) => {
      const card = document.createElement('div');
      card.className = 'run-card';
      card.style.animationDelay = (i * 0.08) + 's';
      card.innerHTML = `
        <span class="run-tag">Run ${i + 1}</span>
        <div>${run.text}</div>
      `;
      runsContainer.appendChild(card);
    });

    renderGauge(score);
    gaugeNote.textContent = note;
  }

  // Animate runs appearing
  function animateRuns() {
    const cards = runsContainer.querySelectorAll('.run-card');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 120);
    });
  }

  tempSlider.addEventListener('input', () => {
    updateTempDisplay();
  });

  runBtn.addEventListener('click', () => {
    renderRuns();
    animateRuns();
  });

  resetBtn.addEventListener('click', () => {
    tempSlider.value = 2; // T=0.7
    updateTempDisplay();
    renderRuns();
    animateRuns();
  });

  // Initial render
  updateTempDisplay();
  renderRuns();
  setTimeout(animateRuns, 200);

})();
