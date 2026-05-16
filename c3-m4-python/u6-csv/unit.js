/* Unit 6 — CSV Processor Widget */
(() => {
  'use strict';

  const widget = document.getElementById('csv-processor');
  if (!widget) return;

  const uploadArea = widget.querySelector('.csv-upload-area');
  const processBtn = widget.querySelector('.csv-btn');
  const statusEl = widget.querySelector('.csv-status');
  const inputTable = document.getElementById('csv-input-table');
  const outputTable = document.getElementById('csv-output-table');

  const sampleData = [
    { id: 1, question: '经期可以运动吗?', category: '运动' },
    { id: 2, question: '孕早期吃什么好?', category: '饮食' },
    { id: 3, question: '失眠怎么办?', category: '睡眠' },
    { id: 4, question: '痛经如何缓解?', category: '经期' },
    { id: 5, question: '排卵期有什么症状?', category: '周期' },
  ];

  const aiResponses = [
    '可以! 建议低强度运动如散步、瑜伽. 避免剧烈运动.',
    '建议多吃叶酸丰富的食物 (菠菜、豆类), 适量蛋白质.',
    '试试睡前 30 分钟放下手机, 做几分钟深呼吸或冥想.',
    '热敷腹部、喝红糖姜水、适当休息. 严重时咨询医生.',
    '可能出现白带增多、体温微升、小腹轻微不适等.'
  ];

  let loaded = false;

  // Simulate "upload" on click
  uploadArea.addEventListener('click', () => {
    if (loaded) return;
    loaded = true;
    uploadArea.classList.add('loaded');
    uploadArea.textContent = 'input.csv loaded (5 rows x 3 columns)';

    // Show input table
    let html = '<table class="csv-table"><thead><tr><th>id</th><th>question</th><th>category</th></tr></thead><tbody>';
    sampleData.forEach(row => {
      html += `<tr><td>${row.id}</td><td>${row.question}</td><td>${row.category}</td></tr>`;
    });
    html += '</tbody></table>';
    inputTable.innerHTML = html;
    processBtn.disabled = false;
    statusEl.textContent = 'Ready to process';
  });

  // Process button
  let processing = false;
  processBtn.addEventListener('click', () => {
    if (processing || !loaded) return;
    processing = true;
    processBtn.disabled = true;
    statusEl.textContent = 'Processing...';

    // Build output table progressively
    let html = '<table class="csv-table"><thead><tr><th>id</th><th>question</th><th>category</th><th class="col-new">ai_response</th><th class="col-new">status</th></tr></thead><tbody>';
    outputTable.innerHTML = html + '</tbody></table>';

    let i = 0;
    const interval = setInterval(() => {
      if (i >= sampleData.length) {
        clearInterval(interval);
        statusEl.textContent = `Done! ${sampleData.length}/${sampleData.length} processed. Output saved to output.csv`;
        processBtn.textContent = 'Done!';
        processing = false;
        return;
      }

      const row = sampleData[i];
      const resp = aiResponses[i];
      const tbody = outputTable.querySelector('tbody');
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.id}</td><td>${row.question}</td><td>${row.category}</td><td class="col-new">${resp}</td><td class="col-new">ok</td>`;
      tr.style.animation = 'slideIn 0.3s ease';
      tbody.appendChild(tr);

      statusEl.textContent = `Processing ${i + 1}/${sampleData.length}...`;
      i++;
    }, 800);
  });
})();
