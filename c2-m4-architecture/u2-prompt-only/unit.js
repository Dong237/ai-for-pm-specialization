/* U2 · Prompt-only Demo Widget */
(() => {
  'use strict';

  const scenarios = [
    {
      name: '情绪分类',
      prompt: 'System: 你是一个情绪分类器. 将用户输入分为5类: 开心/焦虑/疲惫/平静/烦躁.\n只输出分类结果, 不要解释.\n\nUser: "最近睡不好, 白天也没精神, 感觉什么都提不起劲."',
      result: '→ 疲惫',
      verdict: 'yes',
      verdictText: 'Prompt-only 完全够用',
      reason: '分类任务标准化, 不需要外部知识, 模型自带的语义理解就能搞定.'
    },
    {
      name: '文案改写',
      prompt: 'System: 你是 Vitamin 的文案助手. 将用户提供的健康建议改写成温暖、关怀的语气, 使用"你"而不是"您", 控制在 50 字以内.\n\nUser: "建议每天摄入 1000mg 钙质以维持骨密度."',
      result: '→ "你的骨骼需要钙的守护哦~ 每天 1000mg, 一杯牛奶 + 一把坚果就差不多啦 🥛"',
      verdict: 'yes',
      verdictText: 'Prompt-only 完全够用',
      reason: '改写是模型最擅长的模式任务, 风格通过 Prompt 就能控制.'
    },
    {
      name: '医学问答',
      prompt: 'System: 你是一个女性健康顾问.\n\nUser: "经期第3天可以吃布洛芬吗? 我有轻度胃溃疡病史."',
      result: '→ LLM 可能会给出看似合理但不考虑胃溃疡禁忌的回答, 或者编造引用来源.',
      verdict: 'no',
      verdictText: '需要升级到 RAG',
      reason: '涉及专业医学知识 + 药物禁忌 + 需要溯源. 模型训练数据可能过时, 必须检索最新医学指南.'
    },
    {
      name: '今日数据报告',
      prompt: 'System: 你是数据分析师.\n\nUser: "帮我总结 Vitamin 今天的用户活跃数据."',
      result: '→ LLM 无法访问你的数据库, 会拒绝回答或编造数据.',
      verdict: 'no',
      verdictText: '需要 Agent + 工具调用',
      reason: '需要访问实时数据库, Prompt-only 做不到. 需要 Agent 架构来调用数据 API.'
    },
    {
      name: '摘要生成',
      prompt: 'System: 将以下文章总结为3个要点, 每个要点一句话, 使用中文.\n\nUser: [一篇 2000 字的产品评测文章]',
      result: '→ 要点1: ... 要点2: ... 要点3: ...',
      verdict: 'yes',
      verdictText: 'Prompt-only 完全够用',
      reason: '摘要是 LLM 的强项, 输入就在 Prompt 里, 不需要外部知识.'
    }
  ];

  const btns = document.querySelectorAll('.scenario-btn');
  const promptText = document.getElementById('prompt-text');
  const resultText = document.getElementById('result-text');
  const verdictIcon = document.getElementById('verdict-icon');
  const verdictText = document.getElementById('verdict-text');
  const verdictReason = document.getElementById('verdict-reason');
  const resultPanel = document.getElementById('prompt-result');

  function showScenario(idx) {
    const s = scenarios[idx];
    btns.forEach((b, i) => b.classList.toggle('active', i === idx));
    promptText.textContent = s.prompt;
    resultText.textContent = s.result;
    verdictIcon.textContent = s.verdict === 'yes' ? '✅' : '⚠️';
    verdictText.textContent = s.verdictText;
    verdictText.style.color = s.verdict === 'yes' ? 'var(--green)' : 'var(--amber)';
    verdictReason.textContent = s.reason;
    resultPanel.style.borderColor = s.verdict === 'yes' ? 'var(--green)' : 'var(--amber)';
    resultPanel.style.background = s.verdict === 'yes' ? 'var(--green-bg-soft)' : 'var(--amber-bg-soft)';
  }

  btns.forEach((btn, i) => {
    btn.addEventListener('click', () => showScenario(i));
  });

  showScenario(0);
})();
