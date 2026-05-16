/* U3: 模糊需求 → 工程语言 — Translation Simulator Widget */
(() => {
  'use strict';

  const widget = document.getElementById('translation-sim');
  if (!widget) return;

  const scenarios = [
    {
      speaker: '用户/业务方',
      vague: '"AI 推荐不准, 推的东西我都不想看."',
      expert: '推荐模块点击率(CTR)当前2.1%, 目标提升到5%+. 优化方向: (1) 前10条曝光位的相关性得分阈值从0.3提到0.5; (2) 加入用户近7天行为特征; (3) 冷启动用户走热门兜底策略.',
      keywords: ['点击率', 'CTR', '相关性', '曝光', '冷启动']
    },
    {
      speaker: '产品经理',
      vague: '"AI 回复太慢了, 用户等不了."',
      expert: '对话响应P95延迟当前3.2s, 目标降到1s以内. 优化方向: (1) 首token延迟(TTFT)从1.5s降到0.5s, 启用streaming; (2) 检查是否可用更小模型(如GPT-4o-mini); (3) 加缓存层, 高频问题直接返回.',
      keywords: ['P95', '延迟', 'TTFT', 'streaming', '缓存']
    },
    {
      speaker: '用户',
      vague: '"AI 经常说错话, 给了不靠谱的建议."',
      expert: '有害/不准确回复率当前约5%, 目标降到0.5%以下. 优化方向: (1) 加 safety guardrail, 拦截医疗/法律类断言; (2) Prompt 加入"不确定时说不知道"的指令; (3) 建立人工审核的bad case库, 每周回顾.',
      keywords: ['有害', '准确率', 'guardrail', 'bad case', '审核']
    },
    {
      speaker: '老板',
      vague: '"AI 功能成本太高了, 能不能省点?"',
      expert: 'API月调用成本当前$2,400 (日均8万次调用 × 平均600token × $0.005/1K token). 优化方向: (1) 短对话用GPT-4o-mini, 省70%成本; (2) 高频问答做缓存, 预计减少30%调用; (3) 精简System Prompt, 从800token降到300token.',
      keywords: ['API', '成本', 'token', '调用量', '缓存']
    },
    {
      speaker: '算法同事',
      vague: '"模型效果到瓶颈了, 再优化空间不大."',
      expert: '当前情绪分类F1=0.82, 误差分析显示: 30%的错误来自"平静vs轻微开心"的混淆. 优化方向: (1) 合并相似类别, 从5类改为3类; (2) 补充边界case的标注数据500条; (3) 尝试更大的base model.',
      keywords: ['F1', '误差分析', '混淆', '标注', '类别']
    }
  ];

  let currentIdx = 0;
  let completed = new Set();

  const navContainer = document.getElementById('sim-nav');
  const scenarioEl = document.getElementById('sim-scenario');
  const speakerEl = document.getElementById('sim-speaker');
  const quoteEl = document.getElementById('sim-quote');
  const textareaEl = document.getElementById('sim-textarea');
  const compareBtn = document.getElementById('sim-compare');
  const expertEl = document.getElementById('sim-expert');
  const expertTextEl = document.getElementById('sim-expert-text');
  const scoreEl = document.getElementById('sim-score');

  function renderNav() {
    if (!navContainer) return;
    navContainer.innerHTML = '';
    scenarios.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.className = 'sim-nav-btn';
      if (i === currentIdx) btn.classList.add('active');
      if (completed.has(i)) btn.classList.add('done');
      btn.textContent = `场景 ${i + 1}`;
      btn.addEventListener('click', () => { currentIdx = i; render(); });
      navContainer.appendChild(btn);
    });
  }

  function render() {
    const s = scenarios[currentIdx];
    if (speakerEl) speakerEl.textContent = s.speaker;
    if (quoteEl) quoteEl.textContent = s.vague;
    if (textareaEl) { textareaEl.value = ''; textareaEl.disabled = false; }
    if (expertEl) { expertEl.classList.remove('show'); }
    if (scoreEl) { scoreEl.textContent = ''; scoreEl.className = 'sim-score'; }
    renderNav();
  }

  function compare() {
    const s = scenarios[currentIdx];
    const userAnswer = (textareaEl ? textareaEl.value.trim() : '');

    // Show expert answer
    if (expertTextEl) expertTextEl.textContent = s.expert;
    if (expertEl) expertEl.classList.add('show');

    // Simple keyword scoring
    let hits = 0;
    s.keywords.forEach(kw => {
      if (userAnswer.toLowerCase().includes(kw.toLowerCase())) hits++;
    });

    const ratio = userAnswer.length > 10 ? hits / s.keywords.length : 0;
    let label = '';
    let cls = '';
    if (ratio >= 0.6) { label = '很棒! 关键要素都有了'; cls = 'good'; }
    else if (ratio >= 0.3) { label = '不错, 但还缺一些关键指标'; cls = 'ok'; }
    else if (userAnswer.length > 10) { label = '需要更多具体指标和数值'; cls = 'need-work'; }
    else { label = '试着写写看, 然后对比专家翻译'; cls = 'need-work'; }

    if (scoreEl) { scoreEl.textContent = label; scoreEl.className = `sim-score ${cls}`; }

    completed.add(currentIdx);
    renderNav();
  }

  if (compareBtn) compareBtn.addEventListener('click', compare);

  render();
})();
