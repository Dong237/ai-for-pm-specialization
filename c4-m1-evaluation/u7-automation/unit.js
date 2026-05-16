/* U7 — Pipeline Builder Widget */
(function(){
  'use strict';
  var widget = document.getElementById('pipe-widget');
  if(!widget) return;

  var stages = [
    {title:'加载 Golden Set',desc:'从 CSV 读取 50 条测试用例',result:'已加载 50 条 (35 真实 + 10 边缘 + 5 攻击)'},
    {title:'运行推理',desc:'逐条调用 LLM API 获取输出',result:'50 条推理完成. 平均延迟 1.8s, 总 token: 42,350'},
    {title:'LLM Judge 评分',desc:'Claude Judge 三维打分',result:'准确性均分 4.1/5 · 安全性 4.6/5 · 友好度 4.3/5'},
    {title:'计算指标',desc:'汇总 P/R/F1, 与上次对比',result:'Precision 72% · Recall 84% · F1 77.5% · vs 上次 +3.2%'},
    {title:'生成报告',desc:'输出 Markdown 评测报告',result:'报告已生成: vitamin_eval_report_v2.3.md'}
  ];

  var stageEls = document.querySelectorAll('.pipe-stage');
  var runBtn = document.getElementById('pipe-run');
  var resetBtn = document.getElementById('pipe-reset');
  var reportEl = document.getElementById('pipe-report');
  var currentStage = -1;
  var running = false;

  runBtn.addEventListener('click', function(){
    if(running) return;
    running = true;
    runBtn.disabled = true;
    runBtn.textContent = 'Pipeline 运行中...';
    currentStage = 0;
    runStage();
  });

  function runStage(){
    if(currentStage >= stages.length){
      // Show report
      reportEl.classList.add('visible');
      running = false;
      runBtn.disabled = false;
      runBtn.textContent = '重新运行 ↻';
      return;
    }

    // Mark current as running
    stageEls[currentStage].classList.add('running');
    stageEls[currentStage].classList.remove('done');

    // After delay, mark done
    var delay = 800 + Math.random() * 600;
    setTimeout(function(){
      if(!running || currentStage >= stages.length) return;
      stageEls[currentStage].classList.remove('running');
      stageEls[currentStage].classList.add('done');
      // Show result
      var resultEl = stageEls[currentStage].querySelector('.pipe-stage-result');
      if(resultEl){
        resultEl.textContent = stages[currentStage].result;
      }
      // Mark connector
      var connectors = document.querySelectorAll('.pipe-connector');
      if(currentStage < connectors.length){
        connectors[currentStage].classList.add('done');
      }
      currentStage++;
      runStage();
    }, delay);
  }

  if(resetBtn){
    resetBtn.addEventListener('click', function(){
      currentStage = -1;
      running = false;
      runBtn.disabled = false;
      runBtn.textContent = 'Run Pipeline →';
      stageEls.forEach(function(el){
        el.classList.remove('running','done','active');
        var r = el.querySelector('.pipe-stage-result');
        if(r) r.textContent = '';
      });
      document.querySelectorAll('.pipe-connector').forEach(function(c){
        c.classList.remove('done');
      });
      reportEl.classList.remove('visible');
    });
  }
})();
