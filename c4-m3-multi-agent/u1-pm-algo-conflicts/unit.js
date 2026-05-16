/* U1: PM-算法协作 5大冲突 — Conflict Resolver Widget */
(() => {
  'use strict';

  const widget = document.getElementById('conflict-resolver');
  if (!widget) return;

  const scenarios = [
    {
      id: 1,
      title: '"效果不好"',
      pmSays: '这个推荐效果不好, 用户都不点.',
      algoSays: '模型 AUC 已经 0.85 了, 离线指标很好啊.',
      root: '本质: PM 看的是"点击率", 算法看的是"模型准确率". 两个指标不是一回事.',
      options: [
        { text: 'A. 让算法把 AUC 提到 0.95', best: false },
        { text: 'B. 对齐指标: 把线上点击率作为模型优化目标之一', best: true },
        { text: 'C. 换一个算法团队', best: false }
      ],
      feedback: '对齐指标是关键. AUC 是离线指标, 点击率是线上指标. PM 要做的是和算法一起定义"什么叫效果好" — 把业务指标翻译成模型可以优化的目标.'
    },
    {
      id: 2,
      title: '"模型迭代慢"',
      pmSays: '竞品都上了新功能, 我们模型迭代怎么这么慢?',
      algoSays: '标注数据还没到位, 训练一轮要 3 天, 你让我怎么快.',
      root: '本质: 产品节奏(周级) vs 模型训练节奏(月级). 两个时钟不同步.',
      options: [
        { text: 'A. 催算法加班赶进度', best: false },
        { text: 'B. 把需求拆成"规则先上 + 模型后优化"两阶段', best: true },
        { text: 'C. 用 prompt 工程暂时替代, 等模型慢慢迭代', best: false }
      ],
      feedback: '拆分两阶段是最佳策略. 先用规则或简单 prompt 快速上线验证需求, 同时算法团队并行准备数据和训练. C 也有道理但不够完整 — prompt 工程可以是第一阶段的手段之一.'
    },
    {
      id: 3,
      title: '"数据要不到"',
      pmSays: '我需要用户历史聊天数据来训练模型.',
      algoSays: '这些数据涉及用户隐私, 合规部门不批.',
      root: '本质: 数据可用性 ≠ 数据可拿性. 隐私/合规是硬约束, 不是谈判筹码.',
      options: [
        { text: 'A. 找老板出面和合规部门谈', best: false },
        { text: 'B. 设计脱敏方案: 匿名化 + 差分隐私 + 用户授权', best: true },
        { text: 'C. 用公开数据集替代', best: false }
      ],
      feedback: '设计脱敏方案是正确做法. PM 要理解数据合规不是"障碍", 而是"约束条件". 好的 PM 会和算法+法务一起设计合规的数据使用方案.'
    },
    {
      id: 4,
      title: '"这个需求没法做"',
      pmSays: '我要 AI 能诊断用户的健康问题.',
      algoSays: '这是医疗诊断, 模型做不了, 法律风险太大.',
      root: '本质: PM 的需求超出了 AI 的能力边界 + 法律边界. 不是"不想做", 是"不能做".',
      options: [
        { text: 'A. 降级需求: 从"诊断"改为"健康风险提示 + 建议就医"', best: true },
        { text: 'B. 找更强的模型来做', best: false },
        { text: 'C. 加免责声明就行了', best: false }
      ],
      feedback: '降级需求是 AI PM 最重要的能力之一. 把"诊断"降级为"提示", 既满足用户需求, 又避开法律风险. 这是产品智慧, 不是妥协.'
    },
    {
      id: 5,
      title: '"上线后效果变差了"',
      pmSays: '模型上线第一周效果挺好, 第三周就变差了.',
      algoSays: '数据分布变了, 用户行为跟训练数据不一样了.',
      root: '本质: 数据漂移(Data Drift). 线上真实数据和训练数据的分布随时间偏移.',
      options: [
        { text: 'A. 建立持续监控 + 定期重训机制', best: true },
        { text: 'B. 回滚到旧版本', best: false },
        { text: 'C. 收集更多训练数据一次性解决', best: false }
      ],
      feedback: '持续监控 + 定期重训是标准做法. 数据漂移是常态, 不是 bug. PM 要在产品规划中预留"模型维护"的资源和排期, 而不是把上线当终点.'
    }
  ];

  let score = 0;
  let answered = 0;

  const scoreEl = document.getElementById('conflict-score');
  const totalEl = document.getElementById('conflict-total');
  const resetBtn = document.getElementById('conflict-reset');

  function render() {
    const container = document.getElementById('conflict-cards');
    if (!container) return;
    container.innerHTML = '';

    scenarios.forEach((s, idx) => {
      const card = document.createElement('div');
      card.className = 'conflict-card';
      card.dataset.idx = idx;
      card.innerHTML = `
        <div>
          <span class="conflict-num">${s.id}</span>
          <span class="conflict-title">${s.title}</span>
        </div>
        <div class="conflict-scene">
          <p class="pm-says">${s.pmSays}</p>
          <p class="algo-says">${s.algoSays}</p>
        </div>
        <p class="conflict-root">${s.root}</p>
        <div class="resolution-options" data-scenario="${idx}">
          ${s.options.map((o, oi) => `
            <button class="resolution-btn" data-scenario="${idx}" data-option="${oi}">${o.text}</button>
          `).join('')}
        </div>
        <div class="resolution-feedback" id="feedback-${idx}">${s.feedback}</div>
      `;
      container.appendChild(card);
    });

    // Bind option clicks
    container.querySelectorAll('.resolution-btn').forEach(btn => {
      btn.addEventListener('click', handleChoice);
    });

    updateScore();
  }

  function handleChoice(e) {
    const btn = e.currentTarget;
    const sIdx = parseInt(btn.dataset.scenario);
    const oIdx = parseInt(btn.dataset.option);
    const scenario = scenarios[sIdx];
    const card = btn.closest('.conflict-card');

    // Already answered?
    if (card.classList.contains('resolved')) return;

    const options = card.querySelectorAll('.resolution-btn');
    const isCorrect = scenario.options[oIdx].best;

    options.forEach((ob, i) => {
      ob.disabled = true;
      if (scenario.options[i].best) {
        ob.classList.add('correct');
      } else if (i === oIdx) {
        ob.classList.add('wrong');
      }
    });

    // Show feedback
    const fb = document.getElementById(`feedback-${sIdx}`);
    if (fb) fb.classList.add('show');

    card.classList.add('resolved');
    if (isCorrect) score++;
    answered++;
    updateScore();
  }

  function updateScore() {
    if (scoreEl) scoreEl.textContent = score;
    if (totalEl) totalEl.textContent = answered;
  }

  function reset() {
    score = 0;
    answered = 0;
    render();
  }

  if (resetBtn) resetBtn.addEventListener('click', reset);
  render();

})();
