/* U5 — Prompt Version Manager Widget */
(() => {
  'use strict';

  const versions = [
    { ver: 'v1.0', date: '2025-01-15', change: '初版上线', prompt: '你是 Vitamin 健康助手.\n请根据用户的健康数据生成今日总结.\n要求: 简洁、友好、100字以内.', metrics: '准确率 78%, 接受率 65%' },
    { ver: 'v1.1', date: '2025-02-03', change: '增加身体状态上下文', prompt: '你是 Vitamin 健康助手.\n用户当前身体状态: {{body_state}}.\n请根据用户的健康数据生成今日总结.\n要求: 简洁、友好、针对当前状态给建议、100字以内.', metrics: '准确率 84%, 接受率 72%', diff: '+ 用户当前身体状态: {{body_state}}\n+ 针对当前状态给建议' },
    { ver: 'v1.2', date: '2025-03-10', change: '优化语气, 增加趋势对比', prompt: '你是 Vitamin 健康助手, 说话温暖但专业.\n用户当前身体状态: {{body_state}}.\n过去7天趋势: {{trend_summary}}.\n请根据以上信息生成今日健康总结.\n要求:\n- 先说今天的核心数据\n- 再对比近7天趋势\n- 最后给1-2条实操建议\n- 总长度100-200字\n- 语气像关心你的好朋友', metrics: '准确率 91%, 接受率 86%', diff: '+ 说话温暖但专业\n+ 过去7天趋势: {{trend_summary}}\n+ 先说核心 → 对比趋势 → 给建议\n+ 语气像关心你的好朋友' },
    { ver: 'v2.0', date: '2025-04-22', change: 'A/B 测试冠军版, 增加安全限制', prompt: '你是 Vitamin 健康助手, 说话温暖但专业.\n\n## 输入\n用户身体状态: {{body_state}}\n今日数据: {{today_metrics}}\n7天趋势: {{trend_summary}}\n\n## 输出要求\n1. 先用1句话概括今天的整体状态\n2. 对比近7天, 指出改善和退步的地方\n3. 给2条具体可操作的建议\n4. 总长度100-200字\n\n## 安全限制\n- 不得给出医疗诊断\n- 不得推荐具体药物\n- 涉及异常指标时, 建议用户咨询医生\n- 不编造数据', metrics: '准确率 93%, 接受率 89%', diff: '+ 结构化 Markdown 格式\n+ 安全限制 4 条\n+ A/B 测试中胜出' },
  ];

  let activeIdx = versions.length - 1;

  const listEl = document.getElementById('vt-list');
  const detailEl = document.getElementById('vt-detail');

  if (!listEl || !detailEl) return;

  function render() {
    // Timeline list
    listEl.innerHTML = '';
    versions.forEach((v, i) => {
      const li = document.createElement('li');
      li.className = 'vt-item' + (i === activeIdx ? ' active' : '');
      li.innerHTML = `<span class="vt-version">${v.ver}</span><span class="vt-date">${v.date}</span><div class="vt-change">${v.change}</div>`;
      li.addEventListener('click', () => { activeIdx = i; render(); });
      listEl.appendChild(li);
    });

    // Detail panel
    const v = versions[activeIdx];
    let html = `<div class="vt-detail-title">${v.ver} — ${v.change}</div>`;
    html += `<div class="vt-prompt-text">${v.prompt}</div>`;
    if (v.diff) {
      html += `<div style="margin-top:10px;font-size:13px;"><strong style="color:var(--green);">v${activeIdx > 0 ? versions[activeIdx-1].ver : '?'} → ${v.ver} 变更:</strong></div>`;
      html += `<div class="vt-prompt-text" style="border-left-color:var(--green);">${v.diff}</div>`;
    }
    html += `<div style="margin-top:10px;font-size:13px;color:var(--ink-muted);"><strong>效果:</strong> ${v.metrics}</div>`;
    detailEl.innerHTML = html;
  }

  render();
})();
