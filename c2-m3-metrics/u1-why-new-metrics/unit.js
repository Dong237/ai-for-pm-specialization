/* U1 · 为什么传统指标不够 — Metric Gap Finder widget */
(() => {
  'use strict';

  // Feature data: traditional metrics vs AI-specific gaps
  const features = {
    'ai-chat': {
      name: 'AI 聊天助手',
      desc: '用户和 AI 对话, 获取健康建议',
      metrics: [
        { name: 'DAU',        icon: '📊', trad: true,  verdict: '能看到多少人用, 但不知道回答质量' },
        { name: '留存率',      icon: '📊', trad: true,  verdict: '用户回来了, 但可能只是习惯, 不代表信任 AI' },
        { name: 'CTR',         icon: '📊', trad: true,  verdict: '看了推荐内容, 但不知道内容是否正确' },
        { name: 'Acceptance Rate', icon: '🔍', trad: false, verdict: '用户直接采纳 AI 建议的比例 — 传统看不到', miss: true },
        { name: 'Hallucination Rate', icon: '🔍', trad: false, verdict: 'AI 编造信息的比例 — 传统看不到', miss: true },
        { name: 'Cost per Query',  icon: '🔍', trad: false, verdict: '每次对话花多少 token 费 — 传统看不到', miss: true },
      ]
    },
    'ai-summary': {
      name: 'AI 日报摘要',
      desc: 'AI 自动总结用户今日健康数据',
      metrics: [
        { name: 'DAU',        icon: '📊', trad: true,  verdict: '多少人打开了摘要页面' },
        { name: '停留时长',    icon: '📊', trad: true,  verdict: '看了多久, 但不知道是认真读还是困惑' },
        { name: '分享率',      icon: '📊', trad: true,  verdict: '有人分享 = 有价值, 但 0 分享 ≠ 没价值' },
        { name: 'Acceptance Rate', icon: '🔍', trad: false, verdict: '用户有没有修改摘要就直接发给医生 — 看不到', miss: true },
        { name: 'Regen Rate',  icon: '🔍', trad: false, verdict: '用户点了几次 "重新生成" — 看不到', miss: true },
        { name: 'Latency P95', icon: '🔍', trad: false, verdict: '最慢的 5% 用户等了多久 — 看不到', miss: true },
      ]
    },
    'ai-recommend': {
      name: 'AI 运动推荐',
      desc: 'AI 根据用户身体状态推荐运动计划',
      metrics: [
        { name: 'CTR',         icon: '📊', trad: true,  verdict: '点了推荐, 但可能点了又关了' },
        { name: '转化率',      icon: '📊', trad: true,  verdict: '开始运动了, 但不知道推荐是否合适' },
        { name: '留存率',      icon: '📊', trad: true,  verdict: '持续用, 但可能忽略 AI 建议用自己的计划' },
        { name: 'Task Completion', icon: '🔍', trad: false, verdict: '用户是否按 AI 计划完成了整套运动 — 看不到', miss: true },
        { name: 'Refusal Rate',    icon: '🔍', trad: false, verdict: 'AI 该拒绝高风险运动但没拒绝 — 看不到', miss: true },
        { name: 'Cost per Task',   icon: '🔍', trad: false, verdict: '每次推荐要调几次 API、花多少钱 — 看不到', miss: true },
      ]
    },
    'ai-emotion': {
      name: 'AI 情绪识别',
      desc: 'AI 分析用户输入, 判断当前情绪状态',
      metrics: [
        { name: 'DAU',         icon: '📊', trad: true,  verdict: '多少人触发了情绪识别' },
        { name: '参与率',      icon: '📊', trad: true,  verdict: '用户有没有跟情绪提示互动' },
        { name: 'NPS',         icon: '📊', trad: true,  verdict: '整体满意度, 但不针对 AI 准确性' },
        { name: 'Acceptance Rate', icon: '🔍', trad: false, verdict: '用户是否认可 AI 判断的情绪标签 — 看不到', miss: true },
        { name: 'Correction Rate', icon: '🔍', trad: false, verdict: '用户手动修改情绪标签的频率 — 看不到', miss: true },
        { name: 'Latency P50',     icon: '🔍', trad: false, verdict: '情绪识别要等多久才出结果 — 看不到', miss: true },
      ]
    },
  };

  const select = document.getElementById('gap-select');
  const result = document.getElementById('gap-result');
  if (!select || !result) return;

  function render(key) {
    const f = features[key];
    if (!f) { result.innerHTML = '<p style="color:var(--ink-muted);">请选择一个功能</p>'; return; }

    let html = `<div style="margin-bottom:12px;">
      <strong style="font-size:17px;">${f.name}</strong>
      <span style="color:var(--ink-muted);font-size:14px;margin-left:8px;">${f.desc}</span>
    </div>`;

    f.metrics.forEach(m => {
      const cls = m.miss ? 'gap-verdict miss' : 'gap-verdict';
      html += `<div class="gap-metric-row">
        <span class="gap-icon">${m.icon}</span>
        <span class="gap-name">${m.name}</span>
        <span class="${cls}">${m.verdict}</span>
      </div>`;
    });

    const misses = f.metrics.filter(m => m.miss).length;
    html += `<div style="margin-top:14px;padding-top:12px;border-top:2px dashed var(--border);">
      <span style="color:var(--red);font-weight:700;font-size:18px;">${misses} 个盲区</span>
      <span style="color:var(--ink-muted);font-size:14px;"> — 传统指标完全覆盖不到的维度</span>
    </div>`;

    result.innerHTML = html;
  }

  select.addEventListener('change', () => render(select.value));
  render(select.value);

})();
