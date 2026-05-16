/* Unit 4 · Split Comparator — fixed vs semantic splitting */
(() => {
  'use strict';

  const btn = document.getElementById('split-run');
  if (!btn) return;

  const fixedCol = document.getElementById('split-fixed');
  const semanticCol = document.getElementById('split-semantic');
  const verdictEl = document.getElementById('split-verdict');

  // Sample text (medical document about menstrual health)
  const sampleText = `经期饮食注意事项

经期是女性身体比较敏感的时期，饮食上需要特别注意。

第一，应避免食用过于寒凉的食物，如冰淇淋、冰镇饮料等，因为寒凉食物可能会加重痛经症状。中医认为，经期食用寒凉食物会导致宫寒，影响血液循环。

第二，建议多吃温热性食物。红枣、姜茶、桂圆等食物有助于暖宫活血，缓解经期不适。特别是生姜红糖水，是很多女性经期的首选饮品。

第三，要注意补充铁质。经期失血较多，容易导致缺铁性贫血。可以多吃菠菜、猪肝、红瘦肉等含铁丰富的食物，搭配维生素C促进铁的吸收。

第四，运动方面的建议。经期可以进行轻度运动如散步、瑜伽等，但应避免剧烈运动。适当运动有助于缓解痛经和改善情绪。`;

  // Fixed splitting: every N characters
  function fixedSplit(text, size) {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }
    return chunks;
  }

  // Simulated semantic splitting: split at paragraph breaks / topic shifts
  function semanticSplit(text) {
    // Split at double newlines (paragraph boundaries) — simulates semantic boundary detection
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    // Group very short paragraphs with the previous one
    const chunks = [];
    let buffer = '';
    for (const p of paragraphs) {
      if (buffer && (buffer.length + p.length > 200 || p.startsWith('第'))) {
        chunks.push(buffer.trim());
        buffer = p;
      } else {
        buffer += (buffer ? '\n\n' : '') + p;
      }
    }
    if (buffer.trim()) chunks.push(buffer.trim());
    return chunks;
  }

  function renderChunks(container, chunks, className) {
    container.innerHTML = chunks.map((c, i) =>
      `<div class="split-chunk">
        <span class="split-chunk-label">${className === 'fixed' ? '固定' : '语义'} #${i + 1} · ${c.length}字</span>
        <div>${escHtml(c)}</div>
      </div>`
    ).join('');
  }

  function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
  }

  function runComparison() {
    const fixedChunks = fixedSplit(sampleText, 120);
    const semanticChunks = semanticSplit(sampleText);

    renderChunks(fixedCol, fixedChunks, 'fixed');
    renderChunks(semanticCol, semanticChunks, 'semantic');

    verdictEl.innerHTML = `
      <strong>对比结果:</strong>
      <div class="split-score">
        <div class="split-score-item">
          <div class="split-score-num" style="color:var(--blue)">${fixedChunks.length}</div>
          <div class="split-score-label">固定切分 chunks</div>
        </div>
        <div class="split-score-item">
          <div class="split-score-num" style="color:var(--green)">${semanticChunks.length}</div>
          <div class="split-score-label">语义切分 chunks</div>
        </div>
      </div>
      <p style="margin-top:10px;font-size:13px">
        <strong>固定切分</strong>按 120 字一刀切 — 注意有些 chunk 在句子中间断开了.<br/>
        <strong>语义切分</strong>在话题转折处切 — 每个 chunk 是一个完整的话题. 检索时更容易匹配到正确的 chunk.
      </p>
    `;
  }

  btn.addEventListener('click', runComparison);
  // Auto-run on load
  runComparison();
})();
