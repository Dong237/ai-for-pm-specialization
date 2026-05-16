/* U2 — IO Schema Builder Widget */
(() => {
  'use strict';

  // ---- Field definitions ----
  const inputFields = [
    { id: 'user_query', label: 'user_query', type: 'string', required: true, desc: '用户的问题或指令' },
    { id: 'user_id', label: 'user_id', type: 'string', required: true, desc: '用户唯一标识' },
    { id: 'date', label: 'date', type: 'string', required: true, desc: '当日日期 (ISO 8601)' },
    { id: 'metrics', label: 'metrics[]', type: 'array', required: true, desc: '当日健康指标数组' },
    { id: 'history_days', label: 'history_days', type: 'number', required: false, desc: '回溯天数, 默认 7' },
    { id: 'language', label: 'language', type: 'string', required: false, desc: '输出语言, 默认 zh-CN' },
    { id: 'body_state', label: 'body_state', type: 'string', required: false, desc: '当前身体状态 (5 状态之一)' },
    { id: 'max_tokens', label: 'max_tokens', type: 'number', required: false, desc: '最大输出 token 数' },
  ];

  const outputFields = [
    { id: 'summary_text', label: 'summary_text', type: 'string', required: true, desc: '生成的总结文本' },
    { id: 'confidence', label: 'confidence', type: 'number', required: true, desc: '置信度 0-1' },
    { id: 'tags', label: 'tags[]', type: 'array', required: false, desc: '关键词标签' },
    { id: 'suggestions', label: 'suggestions[]', type: 'array', required: false, desc: '健康建议列表' },
    { id: 'risk_flag', label: 'risk_flag', type: 'boolean', required: false, desc: '是否触发风险提示' },
    { id: 'token_count', label: 'token_count', type: 'number', required: false, desc: '消耗的 token 数' },
  ];

  // ---- State ----
  const selectedInput = new Set(inputFields.filter(f => f.required).map(f => f.id));
  const selectedOutput = new Set(outputFields.filter(f => f.required).map(f => f.id));

  // ---- Render chips ----
  function renderChips(containerId, fields, selectedSet, side) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    fields.forEach(f => {
      const chip = document.createElement('button');
      chip.className = 'field-chip' + (selectedSet.has(f.id) ? ' selected' : '') + (f.required ? ' required' : '') + (side === 'input' ? ' input-chip' : '');
      chip.innerHTML = `${f.label} <span class="field-type">${f.type}</span>`;
      chip.title = f.desc + (f.required ? ' (必填)' : ' (选填)');
      chip.addEventListener('click', () => {
        if (f.required) return; // can't deselect required
        if (selectedSet.has(f.id)) {
          selectedSet.delete(f.id);
        } else {
          selectedSet.add(f.id);
        }
        renderChips(containerId, fields, selectedSet, side);
        renderPreview();
      });
      container.appendChild(chip);
    });
  }

  // ---- Render JSON preview ----
  function renderPreview() {
    const preview = document.getElementById('schema-preview');
    if (!preview) return;

    const inFields = inputFields.filter(f => selectedInput.has(f.id));
    const outFields = outputFields.filter(f => selectedOutput.has(f.id));

    let json = '{\n';
    json += '  <span class="comment">// === INPUT SCHEMA ===</span>\n';
    json += '  <span class="key">"input"</span>: {\n';
    inFields.forEach((f, i) => {
      const comma = i < inFields.length - 1 ? ',' : '';
      const typeVal = f.type === 'array' ? '[]' : f.type === 'number' ? '0' : f.type === 'boolean' ? 'false' : '""';
      json += `    <span class="key">"${f.label.replace('[]','')}"</span>: <span class="type">${typeVal}</span>${comma}  <span class="comment">// ${f.desc}${f.required ? ' *必填' : ''}</span>\n`;
    });
    json += '  },\n\n';
    json += '  <span class="comment">// === OUTPUT SCHEMA ===</span>\n';
    json += '  <span class="key">"output"</span>: {\n';
    outFields.forEach((f, i) => {
      const comma = i < outFields.length - 1 ? ',' : '';
      const typeVal = f.type === 'array' ? '[]' : f.type === 'number' ? '0' : f.type === 'boolean' ? 'false' : '""';
      json += `    <span class="key">"${f.label.replace('[]','')}"</span>: <span class="type">${typeVal}</span>${comma}  <span class="comment">// ${f.desc}${f.required ? ' *必填' : ''}</span>\n`;
    });
    json += '  }\n}';

    preview.innerHTML = json;
  }

  // ---- Init ----
  renderChips('input-fields', inputFields, selectedInput, 'input');
  renderChips('output-fields', outputFields, selectedOutput, 'output');
  renderPreview();

})();
