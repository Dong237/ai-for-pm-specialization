/* U3 · Acceptance Rate Simulator */
(() => {
  'use strict';

  const outputs = [
    { text: '建议今天多喝温水, 避免生冷食物. 可以适当做一些轻柔的拉伸运动来缓解不适.', quality: 'good' },
    { text: '根据你的记录, 这周睡眠质量有所下降. 建议睡前减少屏幕使用, 试试深呼吸放松.', quality: 'good' },
    { text: '你的月经周期已经延迟了 47 天, 建议立即去医院做全面妇科检查.', quality: 'aggressive' },
    { text: '今天适合吃一些富含铁质的食物, 如菠菜、红枣和牛肉, 帮助补充经期流失的铁元素.', quality: 'good' },
    { text: '检测到你今天情绪波动较大, 这可能与雌激素水平变化有关. 建议多休息, 不要熬夜.', quality: 'good' },
    { text: '你可以尝试服用益母草颗粒来调理月经, 每天两次, 每次一包.', quality: 'risky' },
    { text: '今天步数 3,200 步, 低于你的日均 6,000 步. 出门散步 20 分钟怎么样?', quality: 'good' },
    { text: '根据你的 BMI 计算, 你目前体重偏重, 建议控制饮食并增加运动量.', quality: 'sensitive' },
    { text: '今天天气晴朗, 紫外线强度中等. 外出记得防晒, 涂 SPF30+ 的防晒霜.', quality: 'good' },
    { text: '你记录的早餐热量约 450 大卡, 营养搭配均衡, 很棒! 继续保持.', quality: 'good' },
  ];

  let idx = 0;
  let accepted = 0, edited = 0, rejected = 0;

  const outputBox = document.getElementById('ar-output');
  const btnAccept = document.getElementById('ar-accept');
  const btnEdit = document.getElementById('ar-edit');
  const btnReject = document.getElementById('ar-reject');
  const statTotal = document.getElementById('ar-total');
  const statAccept = document.getElementById('ar-accepted');
  const statRate = document.getElementById('ar-rate');
  const statLevel = document.getElementById('ar-level');
  const history = document.getElementById('ar-history');
  const resetBtn = document.getElementById('ar-sim-reset');

  if (!outputBox) return;

  function showOutput() {
    if (idx >= outputs.length) {
      outputBox.innerHTML = '<p style="color:var(--green);font-weight:600;">所有输出已评估完毕! 看看你的 Acceptance Rate 吧.</p>';
      btnAccept.disabled = true;
      btnEdit.disabled = true;
      btnReject.disabled = true;
      return;
    }
    outputBox.innerHTML = `<div class="ar-output-label">AI 输出 #${idx + 1}</div><p>${outputs[idx].text}</p>`;
  }

  function updateStats() {
    const total = accepted + edited + rejected;
    statTotal.textContent = total;
    statAccept.textContent = accepted;
    const rate = total > 0 ? Math.round((accepted / total) * 100) : 0;
    statRate.textContent = rate + '%';

    if (rate >= 60) { statRate.className = 'ar-stat-num green'; statLevel.textContent = '优秀'; statLevel.style.color = 'var(--green)'; }
    else if (rate >= 40) { statRate.className = 'ar-stat-num amber'; statLevel.textContent = '合格'; statLevel.style.color = 'var(--amber)'; }
    else { statRate.className = 'ar-stat-num red'; statLevel.textContent = '需优化'; statLevel.style.color = 'var(--red)'; }
  }

  function recordAction(action) {
    if (idx >= outputs.length) return;
    const item = document.createElement('div');
    item.className = 'ar-history-item';
    const icons = { accept: '✅ 直接采纳', edit: '✏️ 修改后用', reject: '❌ 拒绝' };
    item.textContent = `#${idx + 1}: ${icons[action]}`;
    history.prepend(item);

    if (action === 'accept') accepted++;
    else if (action === 'edit') edited++;
    else rejected++;

    idx++;
    updateStats();
    showOutput();
  }

  btnAccept?.addEventListener('click', () => recordAction('accept'));
  btnEdit?.addEventListener('click', () => recordAction('edit'));
  btnReject?.addEventListener('click', () => recordAction('reject'));
  resetBtn?.addEventListener('click', () => {
    idx = 0; accepted = 0; edited = 0; rejected = 0;
    history.innerHTML = '';
    btnAccept.disabled = false; btnEdit.disabled = false; btnReject.disabled = false;
    updateStats();
    showOutput();
  });

  updateStats();
  showOutput();
})();
