/* Unit 1 · RAG Pipeline Animator */
(() => {
  'use strict';

  // Pipeline data for each stage
  const stages = [
    {
      label: '用户提问',
      data: '用户: "经期可以吃冰的吗?"',
      explain: '用户输入一个问题. 在传统 LLM 中, 这个问题直接发给模型. 在 RAG 中, 我们先去搜知识库.'
    },
    {
      label: 'Embed (向量化)',
      data: '问题 → [0.23, -0.41, 0.87, 0.12, ...] (768维向量)',
      explain: '把用户问题转成一个数字向量 (Embedding). 这个向量能捕捉"经期 + 饮食 + 冰冷"的语义.'
    },
    {
      label: 'Retrieve (检索)',
      data: '匹配到 3 个相关文档片段:\n[1] 经期饮食指南.pdf → chunk #7\n[2] 中医养生.docx → chunk #12\n[3] 妇科常见问答.md → chunk #3',
      explain: '用向量相似度在知识库里搜索, 找到最相关的几个文档片段 (chunks). 这一步叫 "Retrieval".'
    },
    {
      label: 'Augment (增强)',
      data: 'Prompt = 系统指令 + 检索到的 3 个片段 + 用户原始问题\n\n"根据以下资料回答用户问题:\n[资料1] 经期应避免过冷食物...\n[资料2] 中医认为寒凉伤脾...\n[资料3] 适量常温饮品可以...\n\n用户问: 经期可以吃冰的吗?"',
      explain: '把检索到的片段塞进 prompt, 和用户问题一起发给 LLM. LLM 就有了"参考资料".'
    },
    {
      label: 'Generate (生成)',
      data: 'LLM 回答: "经期建议避免过冷食物. 中医认为寒凉可能影响血液循环. 不过偶尔少量常温饮品是可以的. 建议根据个人体质判断."\n\n📎 来源: 经期饮食指南.pdf, 中医养生.docx',
      explain: 'LLM 基于检索到的资料生成回答, 并标注来源. 这就是 RAG 的完整流程!'
    }
  ];

  const stageEls = document.querySelectorAll('.pipe-stage');
  const dataFlow = document.getElementById('pipe-data');
  const dataLabel = document.getElementById('pipe-data-label');
  const dataContent = document.getElementById('pipe-data-content');
  const dataExplain = document.getElementById('pipe-data-explain');
  const stepBtn = document.getElementById('pipe-step');
  const resetBtn = document.getElementById('pipe-reset');
  const statusEl = document.getElementById('pipe-status');

  if (!stepBtn) return;

  let currentStage = -1;

  function updateView() {
    // Update stage highlights
    stageEls.forEach((el, i) => {
      el.classList.remove('active', 'done');
      if (i < currentStage) el.classList.add('done');
      if (i === currentStage) el.classList.add('active');
    });

    if (currentStage < 0) {
      dataLabel.textContent = '等待开始...';
      dataContent.textContent = '点击 "下一步" 开始 RAG 流程演示';
      dataExplain.textContent = '';
      statusEl.textContent = '步骤 0 / 5';
      stepBtn.textContent = '开始 →';
      stepBtn.disabled = false;
    } else if (currentStage < stages.length) {
      const s = stages[currentStage];
      dataLabel.textContent = s.label;
      dataContent.textContent = s.data;
      dataExplain.textContent = s.explain;
      statusEl.textContent = `步骤 ${currentStage + 1} / ${stages.length}`;
      stepBtn.textContent = currentStage === stages.length - 1 ? '完成!' : '下一步 →';
      stepBtn.disabled = currentStage >= stages.length - 1;
    }
  }

  stepBtn.addEventListener('click', () => {
    if (currentStage < stages.length - 1) {
      currentStage++;
      updateView();
    }
  });

  resetBtn.addEventListener('click', () => {
    currentStage = -1;
    updateView();
  });

  updateView();
})();
