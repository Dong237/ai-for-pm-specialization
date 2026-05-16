/* Unit 1 · Platform Overview — interactive platform map */
(() => {
  'use strict';

  // Quadrant detail data
  const quadData = {
    bot: {
      title: 'Bot (智能体)',
      items: [
        'Bot 是 Coze 的核心产物 -- 一个能对话的 AI 助手',
        '每个 Bot 可以配置独立的 Persona (人设 + 提示词)',
        '支持单 Agent 模式和多 Agent 协作模式',
        '可发布到飞书、微信、抖音、Web 等多个渠道',
        'Vitamin 场景: 身体翻译器 Bot = 1 个对话入口'
      ]
    },
    workflow: {
      title: '工作流 (Workflow)',
      items: [
        '工作流 = 把任务拆成多个步骤, 用有向无环图 (DAG) 连起来',
        '节点类型: 大模型 / 代码 / 知识库检索 / 条件判断 / 循环',
        '可视化拖拽编排, 每个节点独立调试',
        '支持嵌套: 一个工作流可以调用另一个工作流',
        'Vitamin 场景: 意图识别 -> 知识库检索 -> 回复生成'
      ]
    },
    knowledge: {
      title: '知识库 (Knowledge Base)',
      items: [
        '知识库 = 给 Bot 喂私有数据的 RAG 模块',
        '支持上传: 文档 (PDF/Word/TXT)、URL 网页、表格数据',
        '自动切片 + 向量化 + 语义检索',
        '三种检索策略: 混合检索 / 语义检索 / 全文检索',
        'Vitamin 场景: 上传 5 状态的医学科普资料, 让 Bot 引用回答'
      ]
    },
    plugin: {
      title: '插件 (Plugin)',
      items: [
        '插件 = 给 Bot 接上外部工具, 让它能"做事"',
        '官方插件商店: 60+ 预制插件 (搜索/天气/图片/计算等)',
        '自定义插件: 把任何 API 封装成插件供 Bot 调用',
        '每个插件 = 一组 API Tools, 定义输入输出参数',
        'Vitamin 场景: 接天气 API 回答"今天适合运动吗"'
      ]
    }
  };

  // Platform map interaction
  const cards = document.querySelectorAll('.quad-card');
  const detailPanel = document.getElementById('quad-detail-panel');

  if (!cards.length || !detailPanel) return;

  let activeKey = null;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.quad;
      if (!key || !quadData[key]) return;

      // Toggle
      if (activeKey === key) {
        activeKey = null;
        detailPanel.classList.remove('visible');
        cards.forEach(c => c.classList.remove('active'));
        return;
      }

      activeKey = key;
      const data = quadData[key];

      // Update detail panel
      detailPanel.querySelector('.quad-detail-title').textContent = data.title;
      const ul = detailPanel.querySelector('ul');
      ul.innerHTML = data.items.map(item => `<li>${item}</li>`).join('');

      // Show panel
      detailPanel.classList.remove('visible');
      void detailPanel.offsetWidth; // force reflow
      detailPanel.classList.add('visible');

      // Highlight active card
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Scroll into view
      detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

})();
