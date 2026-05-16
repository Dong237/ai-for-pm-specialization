/* U5 — Confusion Matrix Builder Widget */
(function(){
  'use strict';
  var widget = document.getElementById('cm-widget');
  if(!widget) return;

  var items = [
    {text:'经期饮食指南 → 正确召回',correct:'tp'},
    {text:'排卵期运动建议 → 正确召回',correct:'tp'},
    {text:'备孕叶酸补充 → 正确召回',correct:'tp'},
    {text:'月经推迟原因 → 正确召回',correct:'tp'},
    {text:'经期头疼缓解 → 正确召回',correct:'tp'},
    {text:'痛风饮食(无关) → 错误召回',correct:'fp'},
    {text:'男性脱发(无关) → 错误召回',correct:'fp'},
    {text:'儿童发烧(无关) → 错误召回',correct:'fp'},
    {text:'哺乳期用药 → 未被召回',correct:'fn'},
    {text:'产后恢复运动 → 未被召回',correct:'fn'},
    {text:'更年期症状 → 未被召回',correct:'fn'},
    {text:'糖尿病治疗(无关) → 正确未召回',correct:'tn'},
    {text:'骨折急救(无关) → 正确未召回',correct:'tn'},
    {text:'近视手术(无关) → 正确未召回',correct:'tn'},
    {text:'宠物疫苗(无关) → 正确未召回',correct:'tn'},
  ];

  var counts = {tp:0,fp:0,fn:0,tn:0};
  var selectedItem = null;
  var assignedItems = [];

  var listEl = document.getElementById('cm-item-list');
  var selectedEl = document.getElementById('cm-selected');
  var tpCount = document.getElementById('cm-tp-count');
  var fpCount = document.getElementById('cm-fp-count');
  var fnCount = document.getElementById('cm-fn-count');
  var tnCount = document.getElementById('cm-tn-count');
  var precVal = document.getElementById('cm-prec-val');
  var recVal = document.getElementById('cm-rec-val');
  var f1Val = document.getElementById('cm-f1-val');
  var precGauge = document.getElementById('cm-prec-gauge');
  var recGauge = document.getElementById('cm-rec-gauge');
  var f1Gauge = document.getElementById('cm-f1-gauge');

  // Render items
  items.forEach(function(item, idx){
    var el = document.createElement('span');
    el.className = 'cm-item';
    el.textContent = item.text;
    el.dataset.idx = idx;
    el.addEventListener('click', function(){
      if(el.classList.contains('assigned')) return;
      document.querySelectorAll('.cm-item').forEach(function(e){e.style.outline='';});
      el.style.outline = '2px solid var(--blue)';
      selectedItem = idx;
      selectedEl.textContent = item.text;
      selectedEl.style.display = 'block';
    });
    listEl.appendChild(el);
  });

  // Assign buttons
  document.querySelectorAll('.cm-assign-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      if(selectedItem === null) return;
      var cat = btn.dataset.cat;
      var item = items[selectedItem];
      var itemEl = listEl.querySelector('[data-idx="'+selectedItem+'"]');

      counts[cat]++;
      itemEl.classList.add('assigned', cat+'-assigned');
      itemEl.style.outline = '';
      assignedItems.push({idx:selectedItem, assigned:cat, correct:item.correct});

      selectedItem = null;
      selectedEl.style.display = 'none';
      updateMetrics();
    });
  });

  function updateMetrics(){
    tpCount.textContent = counts.tp;
    fpCount.textContent = counts.fp;
    fnCount.textContent = counts.fn;
    tnCount.textContent = counts.tn;

    var p = counts.tp + counts.fp > 0 ? (counts.tp / (counts.tp + counts.fp)) : 0;
    var r = counts.tp + counts.fn > 0 ? (counts.tp / (counts.tp + counts.fn)) : 0;
    var f1 = p + r > 0 ? (2 * p * r / (p + r)) : 0;

    precVal.textContent = (p*100).toFixed(0) + '%';
    recVal.textContent = (r*100).toFixed(0) + '%';
    f1Val.textContent = (f1*100).toFixed(0) + '%';

    // Gauge colors
    setGaugeColor(precGauge, p);
    setGaugeColor(recGauge, r);
    setGaugeColor(f1Gauge, f1);
  }

  function setGaugeColor(el, val){
    if(val >= 0.7) { el.style.borderColor = 'var(--green)'; el.style.color = 'var(--green)'; }
    else if(val >= 0.4) { el.style.borderColor = 'var(--amber)'; el.style.color = 'var(--amber)'; }
    else { el.style.borderColor = 'var(--red)'; el.style.color = 'var(--red)'; }
  }

  // Reset
  var resetBtn = document.getElementById('cm-reset');
  if(resetBtn){
    resetBtn.addEventListener('click', function(){
      counts = {tp:0,fp:0,fn:0,tn:0};
      selectedItem = null;
      assignedItems = [];
      selectedEl.style.display = 'none';
      document.querySelectorAll('.cm-item').forEach(function(el){
        el.classList.remove('assigned','tp-assigned','fp-assigned','fn-assigned','tn-assigned');
        el.style.outline = '';
      });
      updateMetrics();
    });
  }
})();
