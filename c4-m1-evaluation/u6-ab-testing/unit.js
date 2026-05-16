/* U6 — A/B Test Runner Widget */
(function(){
  'use strict';
  var widget = document.getElementById('ab-widget');
  if(!widget) return;

  var runBtn = document.getElementById('ab-run');
  var resetBtn = document.getElementById('ab-reset');
  var v1Fill = document.getElementById('ab-v1-fill');
  var v2Fill = document.getElementById('ab-v2-fill');
  var tieFill = document.getElementById('ab-tie-fill');
  var pvalueEl = document.getElementById('ab-pvalue');
  var verdictEl = document.getElementById('ab-verdict');
  var detailGrid = document.getElementById('ab-detail-grid');
  var progressEl = document.getElementById('ab-progress-text');
  var progressFill = document.getElementById('ab-progress-fill');
  var resultsEl = document.getElementById('ab-results');

  // Simulated results: v2 is slightly better (60% win rate)
  var totalRounds = 50;
  var results = [];
  var running = false;

  function generateResults(){
    results = [];
    for(var i = 0; i < totalRounds; i++){
      var r = Math.random();
      if(r < 0.30) results.push('v1');
      else if(r < 0.88) results.push('v2');
      else results.push('tie');
    }
  }

  runBtn.addEventListener('click', function(){
    if(running) return;
    running = true;
    runBtn.disabled = true;
    runBtn.textContent = '运行中...';
    generateResults();
    detailGrid.innerHTML = '';
    resultsEl.style.display = 'block';

    var idx = 0;
    var v1Wins = 0, v2Wins = 0, ties = 0;

    function step(){
      if(!running) return;
      if(idx >= totalRounds){
        showFinalResult(v1Wins, v2Wins, ties);
        running = false;
        runBtn.disabled = false;
        runBtn.textContent = '重新运行 ↻';
        return;
      }
      var r = results[idx];
      if(r === 'v1') v1Wins++;
      else if(r === 'v2') v2Wins++;
      else ties++;

      // Update bars
      var done = idx + 1;
      v1Fill.style.width = (v1Wins/done*100) + '%';
      v1Fill.textContent = v1Wins;
      v2Fill.style.width = (v2Wins/done*100) + '%';
      v2Fill.textContent = v2Wins;
      tieFill.style.width = (ties/done*100) + '%';
      tieFill.textContent = ties;

      // Add detail cell
      var cell = document.createElement('span');
      cell.className = 'ab-detail-cell ' + (r==='v1'?'ab-cell-v1':r==='v2'?'ab-cell-v2':'ab-cell-tie');
      cell.textContent = '#'+(idx+1)+' '+(r==='tie'?'=':r.toUpperCase());
      detailGrid.appendChild(cell);

      // Progress
      var pct = (done/totalRounds*100).toFixed(0);
      progressEl.textContent = done + ' / ' + totalRounds + ' 完成';
      progressFill.style.width = pct + '%';

      idx++;
      setTimeout(step, 60);
    }
    step();
  });

  function showFinalResult(v1, v2, tie){
    // Simple binomial test approximation
    var total = v1 + v2; // exclude ties
    if(total === 0){ pvalueEl.textContent = '无有效数据'; return; }
    var p2 = v2 / total;
    // Z-test for proportions
    var z = (p2 - 0.5) / Math.sqrt(0.25 / total);
    var pval = 1 - normalCDF(Math.abs(z));

    var pText = pval < 0.001 ? '< 0.001' : pval.toFixed(3);
    pvalueEl.querySelector('.pval').textContent = 'p = ' + pText;

    if(pval < 0.05){
      pvalueEl.className = 'ab-pvalue significant';
      if(v2 > v1){
        verdictEl.textContent = 'v2 显著更好! 可以上线.';
        verdictEl.style.color = 'var(--green)';
      } else {
        verdictEl.textContent = 'v1 显著更好! 保持原版.';
        verdictEl.style.color = 'var(--blue)';
      }
    } else {
      pvalueEl.className = 'ab-pvalue not-significant';
      verdictEl.textContent = '差异不显著. 需要更多数据, 或差异真的很小.';
      verdictEl.style.color = 'var(--amber)';
    }
  }

  function normalCDF(x){
    var t = 1/(1+0.2316419*Math.abs(x));
    var d = 0.3989422804 * Math.exp(-x*x/2);
    var p = d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));
    return x > 0 ? 1-p : p;
  }

  if(resetBtn){
    resetBtn.addEventListener('click', function(){
      running = false;
      results = [];
      detailGrid.innerHTML = '';
      v1Fill.style.width = '0%'; v1Fill.textContent = '';
      v2Fill.style.width = '0%'; v2Fill.textContent = '';
      tieFill.style.width = '0%'; tieFill.textContent = '';
      pvalueEl.querySelector('.pval').textContent = '-';
      verdictEl.textContent = '';
      pvalueEl.className = 'ab-pvalue';
      progressEl.textContent = '0 / '+totalRounds;
      progressFill.style.width = '0%';
      resultsEl.style.display = 'none';
      runBtn.textContent = 'Run Test →';
    });
  }
})();
