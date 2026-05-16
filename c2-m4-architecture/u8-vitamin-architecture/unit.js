/* U8 · Architecture Report Builder */
(() => {
  'use strict';

  const features = [
    { name: '5 状态情绪分类', defaultArch: 'prompt', reason: { prompt: '标准化分类任务, 给 5 个 Few-shot 示例即可, 不需要外部知识.', rag: '情绪分类不需要外部知识, RAG 是过度工程.', finetune: '可以用, 但 Prompt+Few-shot 已经够用, 不值得训练.', multiagent: '单步任务, 不需要多 Agent.' } },
    { name: '每日健康提醒文案', defaultArch: 'prompt', reason: { prompt: '文案生成是模型强项, Prompt 控制语气和格式即可.', rag: '通用健康提醒不需要检索专有知识.', finetune: 'PMF 后可以考虑, 统一品牌语调.', multiagent: '单步任务, 不需要多 Agent.' } },
    { name: '医学知识问答', defaultArch: 'rag', reason: { prompt: '医学知识会更新且需要溯源, Prompt-only 会产生危险的幻觉.', rag: '必须 RAG: 知识会更新, 需要溯源, 幻觉风险高. 连接权威医学指南.', finetune: 'Fine-tune 不能替代 RAG — 教风格不教知识.', multiagent: '如果只是问答, RAG 够了. 不需要多 Agent.' } },
    { name: '药物交互查询', defaultArch: 'rag', reason: { prompt: '药物交互数据必须准确, 不能靠模型记忆.', rag: 'RAG + 规则引擎: 从药物数据库检索, 用规则验证禁忌.', finetune: '药物数据经常更新, Fine-tune 跟不上.', multiagent: 'RAG + 规则就够, 不需要多 Agent.' } },
    { name: '品牌语调统一', defaultArch: 'finetune', reason: { prompt: 'Prompt 能控制 80% 的语调, 但极致一致性做不到.', rag: '语调不是知识问题, RAG 解决不了.', finetune: 'PMF 后, 用 1000+ 条品牌风格数据微调, 让模型 "内化" Vitamin 语调.', multiagent: '语调是模型级别的事, 不是编排问题.' } },
    { name: '身体翻译器 (完整版)', defaultArch: 'multiagent', reason: { prompt: '4 步流程, 单 Prompt 搞不定这个复杂度.', rag: '需要 RAG 做知识检索, 但还需要分析+生成+审核.', finetune: '可以给生成 Agent 做 Fine-tune, 但整体需要编排.', multiagent: '4 步 × 4 种专长: 症状分析 → 知识检索(RAG) → 建议生成 → 安全审核. 需要 Orchestrator 协调.' } }
  ];

  const selects = document.querySelectorAll('.feature-select');
  const reportEl = document.getElementById('report-output');
  const generateBtn = document.getElementById('generate-report');

  function generateReport() {
    let html = '<div class="report-title">Vitamin 架构决策报告</div>';
    const archColors = { prompt: 'green', rag: 'blue', finetune: 'amber', multiagent: 'red' };
    const archNames = { prompt: 'Prompt-only', rag: 'RAG', finetune: 'Fine-tune', multiagent: 'Multi-Agent' };

    selects.forEach((sel, i) => {
      const f = features[i];
      const arch = sel.value;
      const color = archColors[arch];
      const name = archNames[arch];
      const reason = f.reason[arch];
      const isDefault = arch === f.defaultArch;

      html += `<div class="report-item">
        <div class="report-item-feature">${f.name}</div>
        <span class="report-item-arch" style="background:var(--${color}-bg);color:var(--${color});">${name}</span>
        ${isDefault ? '<span style="font-size:12px;color:var(--green);">✓ 推荐选择</span>' : '<span style="font-size:12px;color:var(--amber);">⚠ 非推荐</span>'}
        <div class="report-item-reason">${reason}</div>
      </div>`;
    });

    // Score
    let matchCount = 0;
    selects.forEach((sel, i) => { if (sel.value === features[i].defaultArch) matchCount++; });
    html += `<div style="margin-top:16px;padding-top:14px;border-top:2px solid var(--border);text-align:center;">
      <span style="font-family:'Excalifont','LXGW WenKai Screen',system-ui,sans-serif;font-size:18px;font-weight:600;">匹配度: ${matchCount}/${features.length} 与推荐一致</span>
      <p style="font-size:13px;color:var(--ink-muted);margin-top:4px;">${matchCount === features.length ? '完美! 你的选择和推荐完全一致.' : '看看不一致的地方 — 你的理由是什么?'}</p>
    </div>`;

    reportEl.innerHTML = html;
  }

  generateBtn.addEventListener('click', generateReport);

  // Set defaults
  selects.forEach((sel, i) => {
    sel.value = features[i].defaultArch;
  });
})();
