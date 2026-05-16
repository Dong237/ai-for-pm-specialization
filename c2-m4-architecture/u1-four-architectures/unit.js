/* U1 · 四种 AI 架构概览 — Interactive Architecture Spectrum Widget */
(() => {
  'use strict';

  // Architecture data
  const architectures = [
    {
      level: 1,
      name: 'Prompt-only',
      brief: '一个 API + 一段 Prompt',
      icon: '📝',
      color: 'green',
      details: {
        howItWorks: '直接调用 LLM API, 把需求写在 System Prompt 里. 不需要额外数据库或训练.',
        cost: '最低 — 只付 API 调用费',
        buildTime: '几小时到 1 天',
        maintenance: '改 Prompt 即可, 几乎零维护',
        bestFor: '标准化任务, 知识不变, 规模小',
        example: '客服 FAQ 回复、文案改写、情绪分类',
        limitation: '模型不知道你的专有知识, 长 Prompt 容易失控'
      }
    },
    {
      level: 2,
      name: 'RAG',
      brief: '检索 + 增强生成',
      icon: '🔍',
      color: 'blue',
      details: {
        howItWorks: '用户提问 → 从知识库检索相关文档 → 塞进 Prompt → LLM 生成回答. 知识随时可更新.',
        cost: '中等 — API 费 + 向量数据库 + Embedding 费',
        buildTime: '1-2 周',
        maintenance: '定期更新知识库, 调优检索策略',
        bestFor: '知识动态更新, 需要溯源, 医疗/法律/客服',
        example: '企业知识库问答、医学指南查询、法律条款检索',
        limitation: '检索质量决定上限, 需要高质量文档'
      }
    },
    {
      level: 3,
      name: 'Fine-tune',
      brief: '微调模型权重',
      icon: '🎯',
      color: 'amber',
      details: {
        howItWorks: '用你的数据重新训练模型的部分参数. 模型"学会"你的风格/术语/判断模式.',
        cost: '高 — 训练费 + 推理费上涨 + 数据标注成本',
        buildTime: '2-8 周 (含数据准备)',
        maintenance: '数据变了需要重新训练, 成本高',
        bestFor: '品牌语调、术语密度大、Prompt 太长了',
        example: '金融报告生成、医学影像描述、品牌文案风格',
        limitation: '需要高质量标注数据, 过拟合风险, PMF 后才值得'
      }
    },
    {
      level: 4,
      name: 'Multi-Agent',
      brief: '多个 Agent 分工协作',
      icon: '🤖',
      color: 'red',
      details: {
        howItWorks: '多个专门化的 AI Agent 各司其职, 由 Orchestrator 协调. 每个 Agent 可以有自己的工具和知识.',
        cost: '最高 — 多次 API 调用 + 编排复杂度',
        buildTime: '1-3 个月',
        maintenance: '每个 Agent 独立迭代, 协调逻辑需持续调优',
        bestFor: '多步骤任务, 不同步骤需要不同专长',
        example: '研究→写作→审核、用户输入→分析→建议→监控',
        limitation: '调试困难, 成本最高, 延迟叠加'
      }
    }
  ];

  // Widget: Architecture Spectrum
  const cards = document.querySelectorAll('.arch-card');
  const detailPanel = document.getElementById('arch-detail-panel');

  function showDetail(level) {
    const arch = architectures.find(a => a.level === level);
    if (!arch) return;

    // Update active state
    cards.forEach(c => c.classList.toggle('active', parseInt(c.dataset.level) === level));

    // Build detail HTML
    const colorVar = `var(--${arch.color})`;
    const colorBgVar = `var(--${arch.color}-bg)`;

    detailPanel.innerHTML = `
      <div class="arch-detail-header">
        <div class="arch-detail-icon" style="background:${colorBgVar};border:2px solid ${colorVar};">
          ${arch.icon}
        </div>
        <div>
          <div class="arch-detail-title" style="color:${colorVar}">Level ${arch.level}: ${arch.name}</div>
        </div>
      </div>
      <p style="margin:0 0 14px;font-size:15px;">${arch.details.howItWorks}</p>
      <div class="arch-detail-grid">
        <div class="arch-detail-item" style="border-left-color:${colorVar}">
          <div class="arch-detail-label">成本</div>
          <div class="arch-detail-value">${arch.details.cost}</div>
        </div>
        <div class="arch-detail-item" style="border-left-color:${colorVar}">
          <div class="arch-detail-label">搭建时间</div>
          <div class="arch-detail-value">${arch.details.buildTime}</div>
        </div>
        <div class="arch-detail-item" style="border-left-color:${colorVar}">
          <div class="arch-detail-label">最适合</div>
          <div class="arch-detail-value">${arch.details.bestFor}</div>
        </div>
        <div class="arch-detail-item" style="border-left-color:${colorVar}">
          <div class="arch-detail-label">局限</div>
          <div class="arch-detail-value">${arch.details.limitation}</div>
        </div>
      </div>
    `;
    detailPanel.style.borderColor = colorVar;
    detailPanel.classList.add('visible');
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      showDetail(parseInt(card.dataset.level));
    });
  });

  // Show first by default
  showDetail(1);

  // Complexity meter animation
  const meters = document.querySelectorAll('.complexity-fill');
  const meterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target;
        fill.style.width = fill.dataset.value + '%';
        meterObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });
  meters.forEach(m => meterObserver.observe(m));

})();
