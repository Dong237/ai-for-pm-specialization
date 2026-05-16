/* Unit 3 · Chunk Slicer — interactive chunking demo */
(() => {
  'use strict';

  const textarea = document.getElementById('chunk-text');
  const sizeSlider = document.getElementById('chunk-size');
  const overlapSlider = document.getElementById('chunk-overlap');
  const sizeVal = document.getElementById('chunk-size-val');
  const overlapVal = document.getElementById('chunk-overlap-val');
  const outputEl = document.getElementById('chunk-output');
  const statsEl = document.getElementById('chunk-stats');

  if (!textarea || !sizeSlider) return;

  const defaultText = '经期饮食注意事项：经期是女性身体比较敏感的时期，饮食上需要特别注意。首先，应避免食用过于寒凉的食物，如冰淇淋、冰镇饮料等，因为寒凉食物可能会加重痛经症状。其次，建议多吃温热性食物，如红枣、姜茶、桂圆等，有助于暖宫活血。同时，要注意补充铁质，因为经期失血较多，可以多吃菠菜、猪肝、红瘦肉等含铁丰富的食物。此外，还应避免辛辣刺激性食物，如辣椒、花椒等，以免刺激子宫收缩加重不适。最后，保持均衡饮食，适量补充维生素B和维生素E，有助于缓解经期综合征。';

  if (!textarea.value.trim()) textarea.value = defaultText;

  function doChunk() {
    const text = textarea.value.trim();
    if (!text) {
      outputEl.innerHTML = '<div class="muted">请输入或粘贴文本</div>';
      statsEl.textContent = '';
      return;
    }

    const chunkSize = parseInt(sizeSlider.value);
    const overlap = parseInt(overlapSlider.value);
    sizeVal.textContent = chunkSize;
    overlapVal.textContent = overlap;

    const step = Math.max(1, chunkSize - overlap);
    const chunks = [];

    for (let i = 0; i < text.length; i += step) {
      const end = Math.min(i + chunkSize, text.length);
      const chunk = text.slice(i, end);
      const overlapStart = i > 0 ? overlap : 0;
      chunks.push({
        text: chunk,
        start: i,
        end: end,
        overlapChars: overlapStart
      });
      if (end >= text.length) break;
    }

    statsEl.textContent = `${chunks.length} 个 chunks · 原文 ${text.length} 字 · 步长 ${step} 字`;

    outputEl.innerHTML = chunks.map((c, i) => {
      const overlapText = c.overlapChars > 0 ? c.text.slice(0, c.overlapChars) : '';
      const contentText = c.overlapChars > 0 ? c.text.slice(c.overlapChars) : c.text;
      return `<div class="chunk-item">
        <span class="chunk-item-num">Chunk ${i + 1} · ${c.text.length} 字</span>
        ${overlapText ? `<span class="overlap-zone" title="重叠区域">${escHtml(overlapText)}</span>` : ''}
        <span class="content-zone">${escHtml(contentText)}</span>
      </div>`;
    }).join('');
  }

  function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  sizeSlider.addEventListener('input', doChunk);
  overlapSlider.addEventListener('input', doChunk);
  textarea.addEventListener('input', doChunk);

  doChunk();
})();
