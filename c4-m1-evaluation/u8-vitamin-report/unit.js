/* U8 — Report Assembler Widget */
(function(){
  'use strict';
  var widget = document.getElementById('report-widget');
  if(!widget) return;

  // Tab switching
  var tabs = document.querySelectorAll('.report-tab');
  var panels = document.querySelectorAll('.report-panel');

  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){t.classList.remove('active')});
      panels.forEach(function(p){p.classList.remove('active')});
      tab.classList.add('active');
      var target = document.getElementById('panel-'+tab.dataset.tab);
      if(target) target.classList.add('active');
    });
  });

  // Generate report
  var genBtn = document.getElementById('report-generate');
  var preview = document.getElementById('report-preview');

  if(genBtn){
    genBtn.addEventListener('click', function(){
      genBtn.disabled = true;
      genBtn.textContent = '生成中...';

      setTimeout(function(){
        preview.classList.add('visible');
        genBtn.disabled = false;
        genBtn.textContent = '重新生成 ↻';
        preview.scrollIntoView({behavior:'smooth',block:'start'});
      }, 1200);
    });
  }
})();
