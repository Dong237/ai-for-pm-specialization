/* U6 · Architecture Decision Tree Widget */
(() => {
  'use strict';

  // Decision tree structure
  // Each node: { question, hint, yes: next_index_or_result, no: next_index_or_result }
  // Results: { result: true, arch, icon, color, reason }
  const nodes = [
    { question: '模型自带的知识够用吗?', hint: '(用户问的问题, 模型训练时见过吗?)', yes: 1, no: { result: true, arch: 'RAG', icon: '🔍', color: 'blue', reason: '需要外部知识 → 用 RAG 连接知识库, 让模型 "开卷考试".' } },
    { question: '需要溯源 (引用来源) 吗?', hint: '(用户需要知道 "这个答案出自哪份文档" 吗?)', yes: { result: true, arch: 'RAG', icon: '🔍', color: 'blue', reason: '需要溯源 → RAG 可以附带引用来源, Prompt-only 做不到.' }, no: 2 },
    { question: 'Prompt + Few-shot 效果满意吗?', hint: '(试过精心设计 Prompt + 3-5 个示例了吗?)', yes: { result: true, arch: 'Prompt-only', icon: '📝', color: 'green', reason: 'Prompt-only 效果够好 → 不要过度工程. 最简单的方案就是最好的方案.' }, no: 3 },
    { question: '问题是 "风格/语调" 不对吗?', hint: '(内容对但说话方式不对? 还是内容就错了?)', yes: 4, no: 5 },
    { question: '有 500+ 条标注数据 + 已 PMF?', hint: '(有足够的 input→output 对, 且产品需求稳定?)', yes: { result: true, arch: 'Fine-tune', icon: '🎯', color: 'amber', reason: '风格问题 + 有数据 + 已 PMF → Fine-tune 是正解.' }, no: { result: true, arch: 'Prompt-only (暂时)', icon: '📝', color: 'green', reason: '风格问题但数据不够或还没 PMF → 先用 Prompt + Few-shot 凑合, 积累数据后再 Fine-tune.' } },
    { question: '任务有 3+ 步, 且各步需要不同专长?', hint: '(比如: 分析→检索→生成→审核)', yes: { result: true, arch: 'Multi-Agent', icon: '🤖', color: 'red', reason: '多步骤 + 多专长 → Multi-Agent 编排. 用 Orchestrator 协调各专家 Agent.' }, no: { result: true, arch: 'RAG + 工具调用', icon: '🔍', color: 'blue', reason: '可能只需要 RAG + 一些工具调用, 不需要完整的 Multi-Agent 架构.' } }
  ];

  let currentNode = 0;
  let path = [];

  const qText = document.getElementById('dt-q-text');
  const qNum = document.getElementById('dt-q-num');
  const qHint = document.getElementById('dt-q-hint');
  const btnContainer = document.getElementById('dt-btn-container');
  const pathContainer = document.getElementById('dt-path');
  const resultPanel = document.getElementById('dt-result');
  const resultIcon = document.getElementById('dt-result-icon');
  const resultArch = document.getElementById('dt-result-arch');
  const resultReason = document.getElementById('dt-result-reason');
  const resetBtn = document.getElementById('dt-reset-btn');

  function renderNode() {
    const node = nodes[currentNode];
    qText.textContent = node.question;
    qNum.textContent = `问题 ${path.length + 1} / 6`;
    qHint.textContent = node.hint;
    btnContainer.style.display = 'flex';
    resultPanel.classList.remove('visible');
    renderPath();
  }

  function renderPath() {
    pathContainer.innerHTML = path.map(p =>
      `<span class="dt-path-item ${p.answer ? 'dt-path-yes' : 'dt-path-no'}">${p.q} → ${p.answer ? 'Yes' : 'No'}</span>`
    ).join('');
  }

  function answer(isYes) {
    const node = nodes[currentNode];
    path.push({ q: `Q${path.length + 1}`, answer: isYes });

    const next = isYes ? node.yes : node.no;
    if (typeof next === 'object' && next.result) {
      showResult(next);
    } else {
      currentNode = next;
      renderNode();
    }
  }

  function showResult(r) {
    btnContainer.style.display = 'none';
    renderPath();
    resultIcon.textContent = r.icon;
    resultArch.textContent = `推荐: ${r.arch}`;
    resultArch.style.color = `var(--${r.color})`;
    resultReason.textContent = r.reason;
    resultPanel.style.background = `var(--${r.color}-bg-soft)`;
    resultPanel.style.border = `3px solid var(--${r.color})`;
    resultPanel.classList.add('visible');
    qText.textContent = '决策完成!';
    qNum.textContent = `经过 ${path.length} 个问题`;
    qHint.textContent = '';
  }

  function reset() {
    currentNode = 0;
    path = [];
    renderNode();
  }

  document.getElementById('dt-yes').addEventListener('click', () => answer(true));
  document.getElementById('dt-no').addEventListener('click', () => answer(false));
  resetBtn.addEventListener('click', reset);

  renderNode();
})();
