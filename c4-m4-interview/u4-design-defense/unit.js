/* U4: Design Defense — Decision Defense Cards Widget */
(() => {
  'use strict';

  const grid = document.getElementById('defense-grid');
  if (!grid) return;

  const decisions = [
    {
      title: '选模型',
      question: '"你为什么选 GPT-4o-mini 而不是 GPT-4o?"',
      why: [
        { num: '1', label: '备选方案', text: '我对比了 3 个: GPT-4o ($2.5/1M token), GPT-4o-mini ($0.15/1M token), DeepSeek-V3 (开源自部署).' },
        { num: '2', label: '评估标准', text: '3 个维度: 准确率 (F1 > 0.85)、延迟 (< 2s)、成本 (月 < $200).' },
        { num: '3', label: '决策理由', text: 'GPT-4o-mini 在我们的 100 条评测集上 F1 = 0.87, 延迟 0.8s, 月成本 $108. 完全满足 3 个标准, 且比 GPT-4o 便宜 15 倍.' }
      ],
      vitamin: 'Vitamin 的核心任务是文本分类 + 信息提取, 不需要强推理能力. GPT-4o-mini 的性价比最优.'
    },
    {
      title: '选架构',
      question: '"你为什么选 RAG 而不是 Fine-tune?"',
      why: [
        { num: '1', label: '备选方案', text: '3 种: 纯 Prompt Engineering、RAG (检索增强)、Fine-tune (微调).' },
        { num: '2', label: '评估标准', text: '3 个维度: 知识可更新性、数据量要求、部署复杂度.' },
        { num: '3', label: '决策理由', text: 'RAG: 健康知识需要频繁更新 (每月有新指南), Fine-tune 每次更新要重新训练. 我们的标注数据只有 200 条, 不够 Fine-tune (推荐 1000+).' }
      ],
      vitamin: 'Vitamin 的健康知识库每月更新. RAG 可以实时替换文档, 不用重训模型. 未来如果需要统一输出风格, 再加 Fine-tune.'
    },
    {
      title: '选指标',
      question: '"你为什么用 F1 而不是 Accuracy?"',
      why: [
        { num: '1', label: '备选方案', text: '常用指标: Accuracy (准确率)、Precision (精确率)、Recall (召回率)、F1 (精确率和召回率的调和平均).' },
        { num: '2', label: '评估标准', text: '核心问题: 数据是否均衡? 如果 90% 是"正常"状态, Accuracy 会虚高.' },
        { num: '3', label: '决策理由', text: 'Vitamin 的 5 个状态分布不均 (经期只占 15%), 用 Accuracy 会被多数类拉高. F1 兼顾了少数类的识别, 更公平.' }
      ],
      vitamin: '对健康产品来说, 漏识别一个异常状态 (如经期标记为正常) 比误报更危险. 所以 Recall 很重要, F1 兼顾了 Precision 和 Recall.'
    },
    {
      title: '选 Prompt 策略',
      question: '"你的 Prompt 怎么写的? 怎么管理?"',
      why: [
        { num: '1', label: '备选方案', text: '3 种: Zero-shot (不给例子)、Few-shot (给 3-5 个例子)、Chain-of-Thought (让模型一步步推理).' },
        { num: '2', label: '评估标准', text: '准确率、Token 消耗 (Few-shot 会增加 token)、维护成本.' },
        { num: '3', label: '决策理由', text: '选了 Few-shot: 给 3 个例子, F1 从 0.72 (Zero-shot) 提升到 0.87. Token 增加 200/次, 月成本只多 $18, 划算.' }
      ],
      vitamin: 'Prompt 像代码一样版本管理: 每次修改跑 100 条回归测试, 效果下降就回滚. 当前 Vitamin 用的是 v12 版 Prompt.'
    }
  ];

  // Practice mode state
  let practiceIdx = 0;
  let answerRevealed = false;

  function renderCards() {
    grid.innerHTML = '';
    decisions.forEach((d, i) => {
      const card = document.createElement('div');
      card.className = 'defense-card';
      card.innerHTML = `
        <div class="defense-card-title">${d.title}</div>
        <div class="defense-card-question">${d.question}</div>
        <span class="toggle-hint">点击展开答案 →</span>
        <div class="defense-answer">
          <ul class="why-framework">
            ${d.why.map(w => `<li class="why-step" data-num="${w.num}"><strong>${w.label}:</strong> ${w.text}</li>`).join('')}
          </ul>
          <div class="vitamin-answer"><strong>Vitamin 实例:</strong> ${d.vitamin}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        card.classList.toggle('revealed');
      });

      grid.appendChild(card);
    });
  }

  // Practice mode
  const practiceEl = document.getElementById('practice-mode');
  if (practiceEl) {
    const questionEl = document.getElementById('practice-question');
    const answerEl = document.getElementById('practice-answer');
    const revealBtn = document.getElementById('practice-reveal');
    const nextBtn = document.getElementById('practice-next');

    function showPracticeQuestion() {
      const d = decisions[practiceIdx % decisions.length];
      questionEl.textContent = d.question;
      answerEl.innerHTML = '<span style="color:var(--ink-faint);font-style:italic;">先自己想 30 秒, 再点"看答案"...</span>';
      answerRevealed = false;
      revealBtn.textContent = '看答案';
    }

    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        if (answerRevealed) return;
        const d = decisions[practiceIdx % decisions.length];
        answerEl.innerHTML = `
          <ul class="why-framework">
            ${d.why.map(w => `<li class="why-step" data-num="${w.num}"><strong>${w.label}:</strong> ${w.text}</li>`).join('')}
          </ul>
          <div class="vitamin-answer" style="margin-top:12px;"><strong>Vitamin:</strong> ${d.vitamin}</div>
        `;
        answerRevealed = true;
        revealBtn.textContent = '已展开';
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        practiceIdx++;
        showPracticeQuestion();
      });
    }

    showPracticeQuestion();
  }

  renderCards();
})();
