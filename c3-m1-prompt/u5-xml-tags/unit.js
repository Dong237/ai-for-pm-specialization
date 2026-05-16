/* U5 · XML Tag Editor — wrap sections with XML tags, see structured vs unstructured */
(() => {
  'use strict';

  const textarea = document.getElementById('xml-input');
  const preview = document.getElementById('xml-preview');
  const modeBtns = document.querySelectorAll('.xml-mode-btn');
  const tagBtns = document.querySelectorAll('.xml-tag-btn');

  if (!textarea || !preview) return;

  const unstructuredPrompt = `你是一位女性健康顾问,有10年经验。根据用户描述的身体状态给出健康建议。用户当前处于经期第3天,感觉腹部不适和疲劳,她平时有跑步习惯。请先分析症状,然后给出建议。输出JSON格式,包含greeting、tips数组和warning字段。不要给医疗诊断。不要回答无关话题。

示例:输入"头疼想吃甜的" → {"greeting":"...","tips":["..."],"warning":"..."}`;

  const structuredPrompt = `<role>
你是一位女性健康顾问,有10年临床经验。
说话风格: 温暖、不说教、像闺蜜。
</role>

<task>
根据用户描述的身体状态,给出个性化健康建议。
请先在 <thinking> 中分析,再在 <answer> 中给出最终回复。
</task>

<context>
用户当前状态: 经期第3天
用户描述: 腹部不适,感觉疲劳
用户习惯: 平时有跑步习惯
</context>

<rules>
- 不要给出医疗诊断或用药建议
- 不要回答与健康无关的话题
- 如果症状严重,建议就医
</rules>

<examples>
<example>
<input>头疼想吃甜的</input>
<output>{"greeting":"...","tips":["..."],"warning":"..."}</output>
</example>
</examples>

<format>
JSON: {"greeting": "string", "tips": ["string"], "warning": "string"}
</format>`;

  let currentMode = 'unstructured';

  function renderPreview(text) {
    // Highlight XML tags
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const highlighted = escaped.replace(
      /&lt;(\/?[a-zA-Z_-]+)&gt;/g,
      '<span class="xt">&lt;$1&gt;</span>'
    );

    preview.innerHTML = highlighted;
  }

  function setMode(mode) {
    currentMode = mode;
    modeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));

    if (mode === 'unstructured') {
      textarea.value = unstructuredPrompt;
    } else {
      textarea.value = structuredPrompt;
    }
    renderPreview(textarea.value);
  }

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });

  textarea.addEventListener('input', () => {
    renderPreview(textarea.value);
  });

  // Tag insertion buttons
  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end);
      const insertion = `<${tag}>\n${selected || '...'}\n</${tag}>`;
      textarea.value = textarea.value.substring(0, start) + insertion + textarea.value.substring(end);
      renderPreview(textarea.value);
      textarea.focus();
      textarea.setSelectionRange(start + tag.length + 3, start + tag.length + 3 + (selected || '...').length);
    });
  });

  // Initialize
  setMode('unstructured');
})();
