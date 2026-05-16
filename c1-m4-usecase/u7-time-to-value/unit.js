/* ===========================================
   Unit 7 · Time-to-value 估算 — Timeline Estimator Widget
   ===========================================
   - Two dropdowns: Feature × Approach → animated Gantt timeline
   - Compare mode: 3 timelines stacked
   - Reality multiplier slider
*/

(() => {
  'use strict';

  // ===== Feature × Approach Data =====
  const FEATURES = [
    {
      name: '症状关键词提取',
      type: 'Reading: Extract',
      nocode:   { phases: [{n:'设计',d:2,cls:'phase-design'},{n:'搭建',d:3,cls:'phase-build'},{n:'测试',d:2,cls:'phase-test'},{n:'上线',d:1,cls:'phase-deploy'}], total: 8, risks: ['数据准备: 中文症状表述多样, 测试数据需覆盖方言'] },
      api:      { phases: [{n:'设计',d:3,cls:'phase-design'},{n:'API对接',d:5,cls:'phase-build'},{n:'UI',d:3,cls:'phase-ui'},{n:'测试',d:3,cls:'phase-test'},{n:'部署',d:2,cls:'phase-deploy'}], total: 16, risks: ['Prompt调优: 症状提取准确率需达85%+', '合规审查: 健康类产品需法务审批'] },
      finetune: { phases: [{n:'数据收集',d:15,cls:'phase-data'},{n:'训练',d:14,cls:'phase-train'},{n:'评估',d:7,cls:'phase-eval'},{n:'部署',d:7,cls:'phase-deploy'},{n:'监控',d:5,cls:'phase-monitor'}], total: 48, risks: ['数据标注: 需要医学专业标注, 成本高', '训练数据量: 至少需要2000条标注样本'] }
    },
    {
      name: '个性化健康建议',
      type: 'Writing: Draft',
      nocode:   { phases: [{n:'设计',d:3,cls:'phase-design'},{n:'搭建',d:4,cls:'phase-build'},{n:'测试',d:3,cls:'phase-test'},{n:'上线',d:1,cls:'phase-deploy'}], total: 11, risks: ['安全边界: 建议不能有医疗诊断暗示', 'Prompt复杂度: 需根据5种身体状态定制'] },
      api:      { phases: [{n:'设计',d:3,cls:'phase-design'},{n:'API对接',d:5,cls:'phase-build'},{n:'UI',d:5,cls:'phase-ui'},{n:'测试',d:4,cls:'phase-test'},{n:'部署',d:2,cls:'phase-deploy'}], total: 19, risks: ['Prompt调优: 个性化建议需多轮迭代', '合规审查: 健康建议需严格免责声明', '质量评估: 建议准确性需人工审核'] },
      finetune: { phases: [{n:'数据收集',d:20,cls:'phase-data'},{n:'训练',d:18,cls:'phase-train'},{n:'评估',d:10,cls:'phase-eval'},{n:'部署',d:10,cls:'phase-deploy'},{n:'监控',d:7,cls:'phase-monitor'}], total: 65, risks: ['训练数据: 需要大量高质量健康建议样本', '医学审核: 每轮训练结果需医学专家审核'] }
    },
    {
      name: '多轮身体状态对话',
      type: 'Chatting: Companion',
      nocode:   { phases: [{n:'设计',d:3,cls:'phase-design'},{n:'搭建',d:5,cls:'phase-build'},{n:'测试',d:3,cls:'phase-test'},{n:'上线',d:1,cls:'phase-deploy'}], total: 12, risks: ['对话状态管理: no-code平台的记忆能力有限', '多轮一致性: 长对话易跑题'] },
      api:      { phases: [{n:'设计',d:4,cls:'phase-design'},{n:'API对接',d:7,cls:'phase-build'},{n:'UI',d:6,cls:'phase-ui'},{n:'测试',d:5,cls:'phase-test'},{n:'部署',d:3,cls:'phase-deploy'}], total: 25, risks: ['状态管理: 多轮对话需要持久化用户context', '成本控制: 长对话token消耗大', 'Edge case: 用户中途切换话题的处理'] },
      finetune: { phases: [{n:'数据收集',d:25,cls:'phase-data'},{n:'训练',d:20,cls:'phase-train'},{n:'评估',d:12,cls:'phase-eval'},{n:'部署',d:10,cls:'phase-deploy'},{n:'监控',d:8,cls:'phase-monitor'}], total: 75, risks: ['对话数据: 需要大量真实多轮对话样本', '评估难度: 对话质量难以自动化评估'] }
    },
    {
      name: '饮食拍照识别',
      type: 'Multimodal: Image→Text',
      nocode:   { phases: [{n:'设计',d:3,cls:'phase-design'},{n:'搭建',d:5,cls:'phase-build'},{n:'测试',d:4,cls:'phase-test'},{n:'上线',d:2,cls:'phase-deploy'}], total: 14, risks: ['多模态限制: 多数no-code平台不支持图像输入', '识别精度: 中式菜品复杂, 识别难度高'] },
      api:      { phases: [{n:'设计',d:4,cls:'phase-design'},{n:'API对接',d:8,cls:'phase-build'},{n:'UI',d:7,cls:'phase-ui'},{n:'测试',d:5,cls:'phase-test'},{n:'部署',d:3,cls:'phase-deploy'}], total: 27, risks: ['Vision API成本: 图像处理token消耗大', '中式菜品: 需要大量本地化测试', '拍照质量: 暗光/模糊照片处理'] },
      finetune: { phases: [{n:'数据收集',d:30,cls:'phase-data'},{n:'训练',d:25,cls:'phase-train'},{n:'评估',d:14,cls:'phase-eval'},{n:'部署',d:12,cls:'phase-deploy'},{n:'监控',d:10,cls:'phase-monitor'}], total: 91, risks: ['数据收集: 需要数万张标注的中式菜品图片', '训练资源: 视觉模型fine-tune需要更多GPU'] }
    },
    {
      name: '医学术语翻译',
      type: 'Writing: Paraphrase',
      nocode:   { phases: [{n:'设计',d:1,cls:'phase-design'},{n:'搭建',d:2,cls:'phase-build'},{n:'测试',d:2,cls:'phase-test'},{n:'上线',d:1,cls:'phase-deploy'}], total: 6, risks: ['术语覆盖: 需确保常见医学术语都能翻译正确'] },
      api:      { phases: [{n:'设计',d:2,cls:'phase-design'},{n:'API对接',d:3,cls:'phase-build'},{n:'UI',d:2,cls:'phase-ui'},{n:'测试',d:2,cls:'phase-test'},{n:'部署',d:1,cls:'phase-deploy'}], total: 10, risks: ['准确性: 医学术语翻译错误可能误导用户'] },
      finetune: { phases: [{n:'数据收集',d:10,cls:'phase-data'},{n:'训练',d:10,cls:'phase-train'},{n:'评估',d:5,cls:'phase-eval'},{n:'部署',d:5,cls:'phase-deploy'},{n:'监控',d:3,cls:'phase-monitor'}], total: 33, risks: ['数据: 医学术语-白话对照语料收集', '不值得: 这类任务API已经足够好, fine-tune性价比低'] }
    },
    {
      name: '情绪分类识别',
      type: 'Reading: Classify',
      nocode:   { phases: [{n:'设计',d:2,cls:'phase-design'},{n:'搭建',d:3,cls:'phase-build'},{n:'测试',d:2,cls:'phase-test'},{n:'上线',d:1,cls:'phase-deploy'}], total: 8, risks: ['分类体系: 需与Vitamin 5种状态对齐'] },
      api:      { phases: [{n:'设计',d:3,cls:'phase-design'},{n:'API对接',d:4,cls:'phase-build'},{n:'UI',d:3,cls:'phase-ui'},{n:'测试',d:3,cls:'phase-test'},{n:'部署',d:2,cls:'phase-deploy'}], total: 15, risks: ['情绪细粒度: 区分"焦虑"和"紧张"需要精确prompt', '文化差异: 中文情绪表达含蓄, 分类需本地化'] },
      finetune: { phases: [{n:'数据收集',d:14,cls:'phase-data'},{n:'训练',d:12,cls:'phase-train'},{n:'评估',d:7,cls:'phase-eval'},{n:'部署',d:7,cls:'phase-deploy'},{n:'监控',d:5,cls:'phase-monitor'}], total: 45, risks: ['标注一致性: 情绪标注主观性强, 标注者间一致性低', '数据量: 需要按5种状态均衡分布的标注数据'] }
    }
  ];

  const APPROACH_NAMES = { nocode: 'No-code', api: 'API + 代码', finetune: 'Fine-tune' };
  const APPROACH_COLORS = { nocode: 'var(--green)', api: 'var(--blue)', finetune: 'var(--amber)' };

  // ===== DOM Refs =====
  const featureSelect = document.getElementById('tw-feature');
  const approachSelect = document.getElementById('tw-approach');
  const ganttEl = document.getElementById('tw-gantt');
  const totalEl = document.getElementById('tw-total');
  const risksEl = document.getElementById('tw-risks');
  const compareCheckbox = document.getElementById('tw-compare');
  const compareGantt = document.getElementById('tw-compare-gantt');
  const multSlider = document.getElementById('tw-mult-slider');
  const multVal = document.getElementById('tw-mult-val');
  const multResult = document.getElementById('tw-mult-result');

  if (!featureSelect || !approachSelect || !ganttEl) return;

  // ===== Render single Gantt =====
  function renderGantt(featureIdx, approach, container) {
    const feature = FEATURES[featureIdx];
    const data = feature[approach];
    if (!data) return;

    container.innerHTML = '';
    const totalDays = data.phases.reduce((s, p) => s + p.d, 0);

    const row = document.createElement('div');
    row.className = 'gantt-row';

    const label = document.createElement('div');
    label.className = 'gantt-label';
    label.textContent = APPROACH_NAMES[approach];
    row.appendChild(label);

    const track = document.createElement('div');
    track.className = 'gantt-track';

    data.phases.forEach((phase, i) => {
      const bar = document.createElement('div');
      bar.className = 'gantt-bar ' + phase.cls;
      const pct = (phase.d / totalDays * 100).toFixed(1);
      bar.style.width = pct + '%';
      bar.textContent = phase.n + ' ' + phase.d + 'd';
      bar.style.animationDelay = (i * 0.1) + 's';

      // Add risk warning on certain phases
      if (phase.n.includes('数据') || phase.n.includes('合规') || phase.n.includes('测试')) {
        bar.classList.add('has-risk');
      }

      // Add milestone dot at end of certain phases
      if (phase.n === '测试' || phase.n === '评估') {
        const dot = document.createElement('span');
        dot.className = 'milestone';
        dot.title = phase.n === '测试' ? 'Beta ready' : 'Model evaluated';
        bar.appendChild(dot);
      }

      track.appendChild(bar);
    });

    row.appendChild(track);
    container.appendChild(row);
  }

  // ===== Render total =====
  function renderTotal(featureIdx, approach) {
    const feature = FEATURES[featureIdx];
    const data = feature[approach];
    const days = data.total;
    let timeStr;
    if (days <= 14) {
      timeStr = days + ' 天 (' + (days / 5).toFixed(1) + ' 周)';
    } else if (days <= 60) {
      timeStr = (days / 5).toFixed(1) + ' 周 (' + (days / 20).toFixed(1) + ' 个月)';
    } else {
      timeStr = (days / 20).toFixed(1) + ' 个月';
    }
    totalEl.innerHTML = '📅 <strong>' + feature.name + '</strong> × <strong>' + APPROACH_NAMES[approach] + '</strong> = 乐观估计 <strong>' + timeStr + '</strong>';
  }

  // ===== Render risks =====
  function renderRisks(featureIdx, approach) {
    const feature = FEATURES[featureIdx];
    const data = feature[approach];
    risksEl.innerHTML = '';
    data.risks.forEach(r => {
      const item = document.createElement('div');
      item.className = 'tw-risk-item';
      item.innerHTML = '<span class="tw-risk-icon">⚠️</span><span>' + r + '</span>';
      risksEl.appendChild(item);
    });
  }

  // ===== Render multiplier result =====
  function renderMultiplier() {
    const raw = parseInt(multSlider.value, 10);
    const mult = raw / 10;
    multVal.textContent = mult.toFixed(1);

    const featureIdx = parseInt(featureSelect.value, 10);
    const approach = approachSelect.value;
    const feature = FEATURES[featureIdx];
    const data = feature[approach];
    const baseDays = data.total;
    const adjusted = Math.round(baseDays * mult);

    let timeStr;
    if (adjusted <= 14) {
      timeStr = adjusted + ' 天';
    } else if (adjusted <= 60) {
      timeStr = (adjusted / 5).toFixed(1) + ' 周';
    } else {
      timeStr = (adjusted / 20).toFixed(1) + ' 个月';
    }

    multResult.innerHTML = '乐观 ' + baseDays + ' 天 × <strong>' + mult.toFixed(1) + 'x</strong> = 实际 <strong>' + timeStr + ' (' + adjusted + ' 天)</strong>';

    if (mult >= 2.0) {
      multResult.innerHTML += '<br><span style="color:var(--red);font-size:12px">⚠ 首次AI项目建议预留这么多时间</span>';
    }
  }

  // ===== Render compare =====
  function renderCompare() {
    const featureIdx = parseInt(featureSelect.value, 10);
    const feature = FEATURES[featureIdx];
    compareGantt.innerHTML = '';

    ['nocode', 'api', 'finetune'].forEach(approach => {
      const lane = document.createElement('div');
      lane.className = 'compare-lane';

      const title = document.createElement('div');
      title.className = 'compare-lane-title';
      const data = feature[approach];
      let timeStr;
      if (data.total <= 14) {
        timeStr = data.total + '天';
      } else if (data.total <= 60) {
        timeStr = (data.total / 5).toFixed(1) + '周';
      } else {
        timeStr = (data.total / 20).toFixed(1) + '个月';
      }
      title.textContent = APPROACH_NAMES[approach] + ' — ' + timeStr;
      lane.appendChild(title);

      const ganttContainer = document.createElement('div');
      renderGantt(featureIdx, approach, ganttContainer);
      lane.appendChild(ganttContainer);

      compareGantt.appendChild(lane);
    });
  }

  // ===== Full update =====
  function update() {
    const featureIdx = parseInt(featureSelect.value, 10);
    const approach = approachSelect.value;

    renderGantt(featureIdx, approach, ganttEl);
    renderTotal(featureIdx, approach);
    renderRisks(featureIdx, approach);
    renderMultiplier();

    if (compareCheckbox.checked) {
      renderCompare();
    }
  }

  // ===== Events =====
  featureSelect.addEventListener('change', update);
  approachSelect.addEventListener('change', update);
  multSlider.addEventListener('input', renderMultiplier);

  compareCheckbox.addEventListener('change', () => {
    const show = compareCheckbox.checked;
    compareGantt.style.display = show ? 'block' : 'none';
    if (show) renderCompare();
  });

  // Initial render
  update();

})();
