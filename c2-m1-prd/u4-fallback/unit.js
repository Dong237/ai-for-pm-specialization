/* U4 — Fallback Flow Builder Widget */
(() => {
  'use strict';

  const types = [
    { id: 'retry', label: '重试', icon: '&#128260;', desc: '用不同 Prompt 或参数重试一次' },
    { id: 'switch-model', label: '切模型', icon: '&#128300;', desc: '换更大/更准的备用模型' },
    { id: 'rule', label: '切规则', icon: '&#128221;', desc: '退回规则引擎/模板/缓存' },
    { id: 'human', label: '转人工', icon: '&#128100;', desc: '提交人工审核或客服介入' },
    { id: 'refuse', label: '拒答', icon: '&#128683;', desc: '展示 "暂无法回答" 兜底文案' },
  ];

  let chain = [];

  const poolEl = document.getElementById('fb-pool');
  const chainEl = document.getElementById('fb-chain');
  const resultEl = document.getElementById('fb-result');
  const resetBtn = document.getElementById('fb-reset');

  if (!poolEl || !chainEl) return;

  function render() {
    // Pool
    poolEl.innerHTML = '';
    types.forEach(t => {
      const btn = document.createElement('button');
      const inChain = chain.includes(t.id);
      btn.className = 'fb-card' + (inChain ? ' selected' : '');
      btn.dataset.type = t.id;
      btn.innerHTML = `<span class="fb-icon">${t.icon}</span> ${t.label}`;
      btn.title = t.desc;
      if (!inChain) {
        btn.addEventListener('click', () => {
          chain.push(t.id);
          render();
        });
      }
      poolEl.appendChild(btn);
    });

    // Chain
    chainEl.innerHTML = '';
    if (chain.length === 0) {
      chainEl.innerHTML = '<span class="fb-empty">点击上方卡片, 按顺序构建兜底链 &#8593;</span>';
    } else {
      // Start node
      const startSpan = document.createElement('span');
      startSpan.className = 'fb-chain-item';
      startSpan.style.borderColor = 'var(--green)';
      startSpan.style.color = 'var(--green)';
      startSpan.textContent = 'AI 回答';
      chainEl.appendChild(startSpan);

      chain.forEach((id, i) => {
        // Arrow
        const arrow = document.createElement('span');
        arrow.className = 'fb-chain-arrow';
        arrow.innerHTML = '&rarr;';
        chainEl.appendChild(arrow);

        // Item
        const t = types.find(x => x.id === id);
        const item = document.createElement('span');
        item.className = 'fb-chain-item';
        item.dataset.type = id;
        item.innerHTML = `${t.icon} ${t.label}`;
        item.title = '点击移除';
        item.addEventListener('click', () => {
          chain.splice(i, 1);
          render();
        });
        chainEl.appendChild(item);
      });
    }

    // Result
    if (resultEl) {
      if (chain.length === 0) {
        resultEl.textContent = '// 请构建兜底链...';
      } else {
        let code = '// Vitamin 兜底链配置\nfallback_chain: [\n';
        chain.forEach((id, i) => {
          const t = types.find(x => x.id === id);
          code += `  { level: ${i + 1}, action: "${t.id}", desc: "${t.desc}" },\n`;
        });
        code += ']\n// 总共 ' + chain.length + ' 级兜底';
        resultEl.textContent = code;
      }
    }
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      chain = [];
      render();
    });
  }

  render();
})();
