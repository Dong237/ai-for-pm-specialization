/* U3 · RAG Pipeline Visualizer */
(() => {
  'use strict';

  const ragSteps = [
    {
      title: 'Embed (向量化)',
      desc: '把文档切块, 每块转成向量数字, 存入向量数据库.',
      visual: '📄 "经期可以适度运动, 但应避免剧烈运动..."\n  ↓ Embedding Model\n📊 [0.23, -0.15, 0.87, 0.42, ...] → 存入向量数据库'
    },
    {
      title: 'Retrieve (检索)',
      desc: '用户提问 → 也变成向量 → 在数据库找最相似的文档块.',
      visual: '👤 "经期能跑步吗?"\n  ↓ 同一个 Embedding Model\n📊 [0.21, -0.18, 0.85, 0.39, ...]\n  ↓ 余弦相似度对比\n🎯 Top 3 最相关文档块被召回 (相似度 0.92, 0.87, 0.81)'
    },
    {
      title: 'Augment (增强)',
      desc: '把检索到的文档块塞进 Prompt, 作为 "参考资料".',
      visual: 'System Prompt:\n"你是健康顾问. 根据以下参考资料回答问题.\n\n<context>\n参考资料1: 经期可以适度运动...\n参考资料2: 剧烈运动可能加重...\n参考资料3: 建议选择瑜伽、散步...\n</context>\n\n用户问题: 经期能跑步吗?"'
    },
    {
      title: 'Generate (生成)',
      desc: 'LLM 基于参考资料生成回答, 并附带引用来源.',
      visual: '🤖 "经期可以适度运动, 但建议避免剧烈跑步.\n推荐散步或瑜伽 [参考资料1][参考资料3].\n如果月经量较大, 建议休息为主 [参考资料2]."\n\n✅ 有据可查 · 可溯源 · 降低幻觉风险'
    }
  ];

  let currentStep = -1;
  const steps = document.querySelectorAll('.rag-step');
  const nextBtn = document.getElementById('rag-next');
  const resetBtn = document.getElementById('rag-reset');
  const statusEl = document.getElementById('rag-status');

  function updateSteps() {
    steps.forEach((s, i) => {
      s.classList.toggle('active', i <= currentStep);
    });
    if (currentStep >= ragSteps.length - 1) {
      nextBtn.textContent = '完成 ✓';
      nextBtn.disabled = true;
      statusEl.textContent = 'RAG Pipeline 完整流程演示完毕';
    } else {
      nextBtn.textContent = '下一步 →';
      nextBtn.disabled = false;
      statusEl.textContent = `步骤 ${currentStep + 2} / ${ragSteps.length}`;
    }
  }

  nextBtn.addEventListener('click', () => {
    if (currentStep < ragSteps.length - 1) {
      currentStep++;
      updateSteps();
    }
  });

  resetBtn.addEventListener('click', () => {
    currentStep = -1;
    updateSteps();
    statusEl.textContent = '点击 "下一步" 开始';
  });

  updateSteps();
  statusEl.textContent = '点击 "下一步" 开始';
})();
