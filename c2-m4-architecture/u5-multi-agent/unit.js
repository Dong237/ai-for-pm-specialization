/* U5 · Agent Flow Designer */
(() => {
  'use strict';

  const pipelines = {
    vitamin: {
      name: 'Vitamin 身体翻译器',
      agents: [
        { icon: '🎯', name: '指挥官', role: 'orchestrator', desc: '接收用户输入, 决定调用哪些 Agent, 协调整个流程.' },
        { icon: '🔍', name: '症状分析', role: 'researcher', desc: '分析用户描述的身体状态, 提取关键症状词, 分类到 5 状态之一.' },
        { icon: '📚', name: '知识检索', role: 'analyzer', desc: '从医学知识库 (RAG) 中检索相关健康指南和建议.' },
        { icon: '✍️', name: '建议生成', role: 'writer', desc: '基于分析结果和检索到的知识, 生成个性化健康建议.' },
        { icon: '🛡️', name: '安全审核', role: 'reviewer', desc: '检查建议是否涉及医疗诊断/用药建议, 过滤风险内容.' }
      ]
    },
    research: {
      name: '研究报告生成',
      agents: [
        { icon: '🎯', name: '指挥官', role: 'orchestrator', desc: '接收研究主题, 分配任务给各 Agent.' },
        { icon: '🔍', name: '信息搜集', role: 'researcher', desc: '搜索网络和数据库, 收集相关资料和数据.' },
        { icon: '📊', name: '数据分析', role: 'analyzer', desc: '分析收集到的数据, 提取关键洞察和趋势.' },
        { icon: '✍️', name: '报告撰写', role: 'writer', desc: '将分析结果组织成结构化报告, 配图表.' },
        { icon: '🛡️', name: '事实核查', role: 'reviewer', desc: '验证报告中的数据和引用是否准确.' }
      ]
    },
    support: {
      name: '智能客服系统',
      agents: [
        { icon: '🎯', name: '路由器', role: 'orchestrator', desc: '判断用户意图, 分配到对应的专家 Agent.' },
        { icon: '🔍', name: '知识查询', role: 'researcher', desc: '在产品 FAQ 和文档中检索答案.' },
        { icon: '📊', name: '工单分析', role: 'analyzer', desc: '分析问题严重程度, 决定是否需要人工介入.' },
        { icon: '✍️', name: '回复生成', role: 'writer', desc: '生成最终回复, 匹配品牌语气和格式.' },
        { icon: '🛡️', name: '满意度检测', role: 'reviewer', desc: '判断用户是否满意, 未满意则升级处理.' }
      ]
    }
  };

  const paletteBtns = document.querySelectorAll('.palette-btn');
  const agentCanvas = document.getElementById('agent-canvas');
  const agentInfo = document.getElementById('agent-info');

  let currentPipeline = 'vitamin';

  function renderPipeline(key) {
    const pipeline = pipelines[key];
    if (!pipeline) return;
    currentPipeline = key;

    paletteBtns.forEach(b => b.classList.toggle('active', b.dataset.pipeline === key));

    let html = '';
    pipeline.agents.forEach((agent, i) => {
      html += `<div class="agent-node" data-role="${agent.role}" data-idx="${i}">
        <div class="agent-node-icon">${agent.icon}</div>
        <div class="agent-node-name">${agent.name}</div>
        <div class="agent-node-role">${agent.role}</div>
      </div>`;
      if (i < pipeline.agents.length - 1) {
        html += `<div class="agent-connector">&rarr;</div>`;
      }
    });
    agentCanvas.innerHTML = html;

    // Add click handlers
    agentCanvas.querySelectorAll('.agent-node').forEach(node => {
      node.addEventListener('click', () => {
        const idx = parseInt(node.dataset.idx);
        const agent = pipeline.agents[idx];
        agentCanvas.querySelectorAll('.agent-node').forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        agentInfo.innerHTML = `<div class="agent-info-title" style="color:var(--${getColor(agent.role)})">${agent.icon} ${agent.name} (${agent.role})</div>
          <div class="agent-info-desc">${agent.desc}</div>`;
      });
    });

    // Show first agent info by default
    const first = pipeline.agents[0];
    agentInfo.innerHTML = `<div class="agent-info-title" style="color:var(--purple)">${first.icon} ${first.name}</div>
      <div class="agent-info-desc">${first.desc}</div>
      <div style="margin-top:8px;font-size:13px;color:var(--ink-muted);">点击任意 Agent 查看详情</div>`;
  }

  function getColor(role) {
    const map = { orchestrator: 'purple', researcher: 'blue', analyzer: 'green', writer: 'amber', reviewer: 'red' };
    return map[role] || 'blue';
  }

  paletteBtns.forEach(btn => {
    btn.addEventListener('click', () => renderPipeline(btn.dataset.pipeline));
  });

  renderPipeline('vitamin');
})();
