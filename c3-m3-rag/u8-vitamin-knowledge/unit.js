/* Unit 8 · Knowledge Organizer — 5-tab document organizer */
(() => {
  'use strict';

  const categories = {
    gynecology: {
      label: '妇科医学',
      icon: '🏥',
      docs: [
        { title: '经期饮食指南', format: 'PDF', pages: 45, chunks: 120, update: '每季度', desc: '经期营养、禁忌、推荐食谱' },
        { title: '排卵与受孕指南', format: 'PDF', pages: 38, chunks: 95, update: '每半年', desc: '排卵周期、受孕时机、注意事项' },
        { title: '孕期保健手册', format: 'PDF', pages: 120, chunks: 340, update: '每年', desc: '孕早中晚期保健、检查项目' },
        { title: '更年期健康管理', format: 'DOCX', pages: 28, chunks: 70, update: '每年', desc: '更年期症状、调理方案' },
        { title: '常见妇科问题 FAQ', format: 'MD', pages: null, chunks: 85, update: '每月', desc: '200+ 常见问题和标准回答' },
      ]
    },
    nutrition: {
      label: '营养学',
      icon: '🥗',
      docs: [
        { title: '食物营养成分表', format: 'CSV', pages: null, chunks: 500, update: '每年', desc: '2000+ 食物的营养数据' },
        { title: '女性营养指南', format: 'PDF', pages: 56, chunks: 150, update: '每半年', desc: '不同生理期的营养需求' },
        { title: '维生素与矿物质手册', format: 'PDF', pages: 32, chunks: 80, update: '每年', desc: '各类维生素的作用和推荐摄入量' },
        { title: '食物相克与禁忌', format: 'MD', pages: null, chunks: 60, update: '每季度', desc: '食物搭配禁忌的科学依据' },
      ]
    },
    tcm: {
      label: '中医养生',
      icon: '🌿',
      docs: [
        { title: '体质辨识指南', format: 'PDF', pages: 24, chunks: 60, update: '每年', desc: '9 种体质的特征和调理方法' },
        { title: '经期食疗方案', format: 'DOCX', pages: 18, chunks: 45, update: '每半年', desc: '不同体质的经期食疗建议' },
        { title: '中药常用方剂', format: 'PDF', pages: 40, chunks: 100, update: '每年', desc: '常见妇科中药方剂和功效' },
        { title: '穴位按摩指南', format: 'PDF', pages: 22, chunks: 55, update: '每年', desc: '缓解经期不适的穴位' },
      ]
    },
    product: {
      label: '产品文档',
      icon: '📱',
      docs: [
        { title: 'Vitamin 用户手册', format: 'MD', pages: null, chunks: 40, update: '每版本', desc: '功能说明、操作指南' },
        { title: '会员政策', format: 'MD', pages: null, chunks: 15, update: '每季度', desc: '定价、退款、升级规则' },
        { title: '隐私政策', format: 'PDF', pages: 8, chunks: 20, update: '每年', desc: '数据使用和保护政策' },
        { title: '常见问题 FAQ', format: 'MD', pages: null, chunks: 50, update: '每月', desc: '客服常见问题标准回答' },
      ]
    },
    research: {
      label: '研究文献',
      icon: '📄',
      docs: [
        { title: '最新经期研究综述', format: 'PDF', pages: 30, chunks: 75, update: '每季度', desc: '学术论文精选和摘要' },
        { title: '女性健康数据报告', format: 'PDF', pages: 45, chunks: 110, update: '每半年', desc: '行业数据和趋势分析' },
        { title: 'WHO 女性健康指南', format: 'PDF', pages: 60, chunks: 160, update: '每年', desc: '世界卫生组织发布的标准指南' },
      ]
    }
  };

  const tabsEl = document.getElementById('kb-tabs');
  const panelsEl = document.getElementById('kb-panels');
  const summaryEl = document.getElementById('kb-summary');

  if (!tabsEl) return;

  // Build tabs
  const catKeys = Object.keys(categories);
  catKeys.forEach((key, i) => {
    const cat = categories[key];
    const tab = document.createElement('button');
    tab.className = 'kb-tab' + (i === 0 ? ' active' : '');
    tab.textContent = `${cat.icon} ${cat.label}`;
    tab.dataset.cat = key;
    tabsEl.appendChild(tab);
  });

  // Build panels
  catKeys.forEach((key, i) => {
    const cat = categories[key];
    const panel = document.createElement('div');
    panel.className = 'kb-panel' + (i === 0 ? ' active' : '');
    panel.dataset.cat = key;

    panel.innerHTML = `<div class="kb-doc-list">
      ${cat.docs.map(doc => `
        <div class="kb-doc">
          <div class="kb-doc-icon">${cat.icon}</div>
          <div class="kb-doc-info">
            <div class="kb-doc-title">${doc.title}</div>
            <div class="kb-doc-meta">${doc.format}${doc.pages ? ' · ' + doc.pages + '页' : ''}</div>
            <div class="kb-doc-meta">${doc.desc}</div>
            <div class="kb-doc-tags">
              <span class="kb-tag chunk">${doc.chunks} chunks</span>
              <span class="kb-tag update">${doc.update}更新</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;
    panelsEl.appendChild(panel);
  });

  // Calculate totals
  function updateSummary(catKey) {
    const cat = categories[catKey];
    const totalDocs = cat.docs.length;
    const totalChunks = cat.docs.reduce((sum, d) => sum + d.chunks, 0);
    const totalPages = cat.docs.reduce((sum, d) => sum + (d.pages || 0), 0);

    summaryEl.innerHTML = `
      <div class="kb-summary-row"><span class="kb-summary-label">分类</span><span class="kb-summary-value">${cat.label}</span></div>
      <div class="kb-summary-row"><span class="kb-summary-label">文档数</span><span class="kb-summary-value">${totalDocs} 篇</span></div>
      <div class="kb-summary-row"><span class="kb-summary-label">总 Chunks</span><span class="kb-summary-value">${totalChunks} 个</span></div>
      <div class="kb-summary-row"><span class="kb-summary-label">总页数</span><span class="kb-summary-value">${totalPages > 0 ? totalPages + ' 页' : 'N/A'}</span></div>
      <div class="kb-summary-row"><span class="kb-summary-label">Embedding 模型</span><span class="kb-summary-value">bge-large-zh-v1.5</span></div>
      <div class="kb-summary-row"><span class="kb-summary-label">Chunk Strategy</span><span class="kb-summary-value">${catKey === 'product' ? 'No chunking (FAQ)' : 'Recursive 512 + 15%'}</span></div>
    `;
  }

  // Tab switching
  tabsEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.kb-tab');
    if (!tab) return;
    const catKey = tab.dataset.cat;

    document.querySelectorAll('.kb-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.kb-panel').forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    document.querySelector(`.kb-panel[data-cat="${catKey}"]`).classList.add('active');
    updateSummary(catKey);
  });

  // Initial summary
  updateSummary('gynecology');

  // Grand total
  const grandTotal = Object.values(categories).reduce((sum, cat) =>
    sum + cat.docs.reduce((s, d) => s + d.chunks, 0), 0);
  const totalDocsCount = Object.values(categories).reduce((sum, cat) => sum + cat.docs.length, 0);

  const grandEl = document.getElementById('kb-grand-total');
  if (grandEl) {
    grandEl.textContent = `${totalDocsCount} 篇文档 · ${grandTotal} chunks · 5 个分类`;
  }
})();
