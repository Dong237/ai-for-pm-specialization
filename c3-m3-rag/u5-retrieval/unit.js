/* Unit 5 · Retrieval Simulator — query → top-K → rerank */
(() => {
  'use strict';

  const searchBtn = document.getElementById('retrieval-search');
  const rerankerBtn = document.getElementById('retrieval-rerank');
  const resetBtn = document.getElementById('retrieval-reset');
  const queryInput = document.getElementById('retrieval-query');
  const resultsEl = document.getElementById('retrieval-results');
  const statusEl = document.getElementById('retrieval-status');

  if (!searchBtn) return;

  // Simulated knowledge base chunks with pre-computed relevance scores
  const queries = {
    '经期能吃冰吗': {
      biEncoder: [
        { title: '经期饮食指南 · Chunk #7', snippet: '经期应避免食用过于寒凉的食物，如冰淇淋、冰镇饮料...', bi: 0.91, cross: 0.95 },
        { title: '夏季饮品推荐 · Chunk #3', snippet: '夏天来一杯冰镇柠檬水，清凉解暑...', bi: 0.85, cross: 0.22 },
        { title: '中医养生 · Chunk #12', snippet: '中医认为经期食用寒凉食物会导致宫寒...', bi: 0.82, cross: 0.93 },
        { title: '冰淇淋制作方法 · Chunk #1', snippet: '准备牛奶、糖和香草精，按比例混合...', bi: 0.79, cross: 0.08 },
        { title: '经期运动建议 · Chunk #5', snippet: '经期可以进行轻度运动如散步、瑜伽...', bi: 0.76, cross: 0.61 },
        { title: '营养补铁 · Chunk #9', snippet: '经期失血较多，应补充铁质，多吃菠菜...', bi: 0.73, cross: 0.58 },
        { title: '冷链物流 · Chunk #2', snippet: '冷链运输要求温度控制在-18度以下...', bi: 0.71, cross: 0.03 },
      ],
    },
    '备孕要吃叶酸吗': {
      biEncoder: [
        { title: '备孕营养指南 · Chunk #4', snippet: '备孕期建议每日补充0.4mg叶酸，预防神经管缺陷...', bi: 0.93, cross: 0.97 },
        { title: '叶酸品牌对比 · Chunk #8', snippet: '市面上常见叶酸品牌有斯利安、爱乐维...', bi: 0.87, cross: 0.45 },
        { title: '孕期饮食 · Chunk #6', snippet: '怀孕后前三个月应继续补充叶酸...', bi: 0.84, cross: 0.88 },
        { title: '酸性食物列表 · Chunk #11', snippet: '常见酸性食物包括柠檬、醋、酸奶...', bi: 0.78, cross: 0.05 },
        { title: '备孕运动 · Chunk #3', snippet: '备孕期保持适度运动有助于提高受孕率...', bi: 0.75, cross: 0.52 },
        { title: '维生素补充 · Chunk #15', snippet: '除叶酸外，维生素D和铁也是备孕关键营养...', bi: 0.72, cross: 0.82 },
        { title: '烹饪中的叶酸 · Chunk #7', snippet: '蔬菜过度烹饪会导致叶酸流失...', bi: 0.70, cross: 0.68 },
      ],
    }
  };

  let currentResults = [];
  let phase = 0; // 0=idle, 1=bi-encoder, 2=reranked

  function getQueryData() {
    const q = queryInput.value.trim();
    // Find matching or default query
    for (const [key, data] of Object.entries(queries)) {
      if (q.includes(key.slice(0, 4)) || q.includes(key.slice(2))) return data;
    }
    return queries['经期能吃冰吗']; // default
  }

  function renderResults() {
    if (phase === 0) {
      resultsEl.innerHTML = '<div class="muted" style="padding:20px;text-align:center">点击"搜索"开始检索演示</div>';
      statusEl.textContent = '';
      rerankerBtn.disabled = true;
      return;
    }

    let html = '';

    if (phase === 1) {
      html += '<div class="retrieval-phase phase1">Phase 1: Bi-Encoder 向量检索 (Top-7)</div>';
      currentResults.forEach((r, i) => {
        html += `<div class="result-card">
          <div class="result-rank">${i + 1}</div>
          <div class="result-content">
            <div class="result-title">${r.title}</div>
            <div class="result-snippet">${r.snippet}</div>
          </div>
          <div class="result-scores">
            <span class="score-bi">向量: ${r.bi.toFixed(2)}</span>
          </div>
        </div>`;
      });
      statusEl.textContent = '向量检索完成 — 注意 #2 和 #4 其实不太相关. 点击 "Rerank" 精选.';
      rerankerBtn.disabled = false;
    }

    if (phase === 2) {
      const sorted = [...currentResults].sort((a, b) => b.cross - a.cross);
      const topN = sorted.slice(0, 3);
      const rest = sorted.slice(3);

      html += '<div class="retrieval-phase phase2">Phase 2: Cross-Encoder Reranking (精选 Top-3)</div>';
      topN.forEach((r, i) => {
        html += `<div class="result-card promoted">
          <div class="result-rank">${i + 1}</div>
          <div class="result-content">
            <div class="result-title">${r.title}</div>
            <div class="result-snippet">${r.snippet}</div>
          </div>
          <div class="result-scores">
            <span class="score-bi">向量: ${r.bi.toFixed(2)}</span>
            <span class="score-cross">精排: ${r.cross.toFixed(2)}</span>
          </div>
        </div>`;
      });
      html += '<div style="margin:8px 0;font-size:12px;color:var(--ink-muted)">--- 以下被 Reranker 过滤掉 ---</div>';
      rest.forEach((r) => {
        html += `<div class="result-card demoted">
          <div class="result-rank">-</div>
          <div class="result-content">
            <div class="result-title">${r.title}</div>
            <div class="result-snippet">${r.snippet}</div>
          </div>
          <div class="result-scores">
            <span class="score-bi">向量: ${r.bi.toFixed(2)}</span>
            <span class="score-cross">精排: ${r.cross.toFixed(2)}</span>
          </div>
        </div>`;
      });
      statusEl.textContent = 'Reranking 完成! 看: "冰淇淋制作"和"冷链物流"被正确过滤掉了.';
      rerankerBtn.disabled = true;
    }

    resultsEl.innerHTML = html;
  }

  searchBtn.addEventListener('click', () => {
    const data = getQueryData();
    currentResults = [...data.biEncoder];
    phase = 1;
    renderResults();
  });

  rerankerBtn.addEventListener('click', () => {
    phase = 2;
    renderResults();
  });

  resetBtn.addEventListener('click', () => {
    phase = 0;
    currentResults = [];
    renderResults();
  });

  renderResults();
})();
