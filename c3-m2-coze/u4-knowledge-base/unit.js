/* Unit 4 · Knowledge Base — drag-drop uploader + chunk preview */
(() => {
  'use strict';

  const uploader = document.getElementById('kb-uploader');
  const fileList = document.getElementById('kb-file-list');
  const chunkPreview = document.getElementById('chunk-preview');
  const chunkOptions = document.querySelectorAll('.chunk-option');

  if (!uploader || !fileList) return;

  const sampleFiles = [
    { name: '女性经期健康指南.pdf', icon: '&#128196;', size: '2.3 MB' },
    { name: '睡眠与情绪管理.docx', icon: '&#128196;', size: '1.1 MB' },
    { name: '日常饮食营养表.xlsx', icon: '&#128202;', size: '0.5 MB' },
  ];

  const chunkSamples = {
    paragraph: [
      { tag: 'Chunk 1 (段落切分)', text: '经期头疼是常见现象, 主要原因是雌激素水平的波动. 在月经来潮前后, 雌激素水平急剧下降, 可能导致血管扩张和收缩的变化, 从而引发头痛.' },
      { tag: 'Chunk 2 (段落切分)', text: '缓解经期头疼的方法包括: 1) 保持充足睡眠; 2) 适量运动如瑜伽; 3) 热敷太阳穴; 4) 减少咖啡因摄入. 如果头疼严重且持续, 建议就医检查.' },
      { tag: 'Chunk 3 (段落切分)', text: '运动建议: 经期前两天建议轻柔运动 (散步、拉伸), 经期第 3-5 天可以恢复中等强度运动. 避免剧烈运动和倒立类动作.' },
    ],
    fixed: [
      { tag: 'Chunk 1 (固定 300 字)', text: '经期头疼是常见现象, 主要原因是雌激素水平的波动. 在月经来潮前后, 雌激素水平急剧下降, 可能导致血管扩张和收缩的变化, 从而引发头痛. 缓解经期头疼的方法包括: 1) 保持充足睡眠;' },
      { tag: 'Chunk 2 (固定 300 字)', text: '2) 适量运动如瑜伽; 3) 热敷太阳穴; 4) 减少咖啡因摄入. 如果头疼严重且持续, 建议就医检查. 运动建议: 经期前两天建议轻柔运动 (散步、拉伸), 经期第 3-5 天可以恢复中等强度运动.' },
      { tag: 'Chunk 3 (固定 300 字)', text: '避免剧烈运动和倒立类动作. 饮食方面, 经期建议多摄入富含铁质的食物, 如红肉、菠菜、红枣等, 有助于补充经期流失的铁元素, 减少疲劳感.' },
    ],
    semantic: [
      { tag: 'Chunk 1 (语义: 头疼原因)', text: '经期头疼是常见现象, 主要原因是雌激素水平的波动. 在月经来潮前后, 雌激素水平急剧下降, 可能导致血管扩张和收缩的变化, 从而引发头痛.' },
      { tag: 'Chunk 2 (语义: 缓解方法)', text: '缓解经期头疼的方法包括: 1) 保持充足睡眠; 2) 适量运动如瑜伽; 3) 热敷太阳穴; 4) 减少咖啡因摄入. 如果头疼严重且持续, 建议就医检查.' },
      { tag: 'Chunk 3 (语义: 运动建议)', text: '运动建议: 经期前两天建议轻柔运动 (散步、拉伸), 经期第 3-5 天可以恢复中等强度运动. 避免剧烈运动和倒立类动作.' },
    ]
  };

  let filesAdded = false;

  // Simulate file upload
  function addFiles() {
    if (filesAdded) return;
    filesAdded = true;

    uploader.style.borderColor = 'var(--green)';
    uploader.querySelector('.kb-uploader-text').textContent = '上传成功!';

    sampleFiles.forEach((file, i) => {
      setTimeout(() => {
        const li = document.createElement('li');
        li.className = 'kb-file-item';
        li.innerHTML = `
          <span class="kb-file-icon">${file.icon}</span>
          <span class="kb-file-name">${file.name}</span>
          <span class="kb-file-status processing">处理中...</span>
        `;
        fileList.appendChild(li);

        // Simulate processing
        setTimeout(() => {
          li.querySelector('.kb-file-status').className = 'kb-file-status done';
          li.querySelector('.kb-file-status').textContent = '已切片 ✓';
        }, 1500 + i * 500);
      }, i * 400);
    });
  }

  uploader.addEventListener('click', addFiles);
  uploader.addEventListener('dragover', (e) => { e.preventDefault(); uploader.classList.add('dragover'); });
  uploader.addEventListener('dragleave', () => uploader.classList.remove('dragover'));
  uploader.addEventListener('drop', (e) => { e.preventDefault(); uploader.classList.remove('dragover'); addFiles(); });

  // Chunk strategy selector
  let currentStrategy = 'paragraph';

  function updateChunkPreview() {
    if (!chunkPreview) return;
    const chunks = chunkSamples[currentStrategy] || chunkSamples.paragraph;
    chunkPreview.innerHTML = chunks.map(c =>
      `<div class="chunk-item"><div class="chunk-tag">${c.tag}</div>${c.text}</div>`
    ).join('');
  }

  chunkOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      chunkOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      currentStrategy = opt.dataset.strategy;
      updateChunkPreview();
    });
  });

  updateChunkPreview();
})();
