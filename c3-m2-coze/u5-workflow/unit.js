/* Unit 5 · Workflow — interactive node editor */
(() => {
  'use strict';

  const nodeData = {
    start: {
      title: '开始节点',
      desc: '工作流的入口. 接收用户的输入消息.',
      input: '用户发送的消息文本',
      output: '消息内容 (string), 传给下一个节点'
    },
    intent: {
      title: '意图识别 (LLM 节点)',
      desc: '用大模型判断用户想做什么: 健康咨询? 运动建议? 饮食推荐? 闲聊?',
      input: '用户消息',
      output: '意图分类: health_query / exercise / diet / chitchat'
    },
    kb: {
      title: '知识库检索节点',
      desc: '根据用户问题, 在知识库中检索最相关的 5 段内容.',
      input: '用户问题 + 意图分类',
      output: '检索到的 Top 5 段落 (含来源标注)'
    },
    generate: {
      title: '回复生成 (LLM 节点)',
      desc: '把检索结果 + 用户问题 + Persona 综合起来, 生成最终回复.',
      input: '用户问题 + 检索段落 + Persona 指令',
      output: '生成的回复文本 (含引用来源)'
    },
    end: {
      title: '结束节点',
      desc: '工作流的出口. 把最终回复返回给用户.',
      input: '生成的回复文本',
      output: '用户看到的最终消息'
    }
  };

  const nodes = document.querySelectorAll('.wf-node');
  const detailPanel = document.getElementById('node-detail');

  if (!nodes.length || !detailPanel) return;

  let activeKey = null;

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const key = node.dataset.node;
      if (!key || !nodeData[key]) return;

      if (activeKey === key) {
        activeKey = null;
        detailPanel.classList.remove('visible');
        nodes.forEach(n => n.classList.remove('active'));
        return;
      }

      activeKey = key;
      const data = nodeData[key];

      detailPanel.querySelector('h4').textContent = data.title;
      detailPanel.querySelector('.node-desc').textContent = data.desc;
      detailPanel.querySelector('.node-input').textContent = data.input;
      detailPanel.querySelector('.node-output').textContent = data.output;

      detailPanel.classList.remove('visible');
      void detailPanel.offsetWidth;
      detailPanel.classList.add('visible');

      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
    });
  });

})();
