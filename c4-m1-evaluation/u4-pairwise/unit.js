/* U4 — Comparison Arena Widget */
(function(){
  'use strict';
  var widget = document.getElementById('arena-widget');
  if(!widget) return;

  var rounds = [
    {q:'月经期能吃辣吗?', a:'月经期吃辣因人而异。中医认为辛辣食物可能加重痛经,但现代医学没有绝对禁忌。建议你观察自己的反应。', b:'月经期可以适量吃辣。如果你没有痛经或消化问题,少量辣椒是可以的。不过如果你容易痛经,建议避免过辣的食物,选择温和的饮食。'},
    {q:'排卵期怎么算?', a:'排卵一般在下次月经前14天。如果你月经周期是28天,排卵大概在第14天。可以结合基础体温和排卵试纸更准确判断。', b:'排卵期计算：下次月经第一天往前推14天就是排卵日。排卵日前5天和后4天加起来就是排卵期。不过每个人周期不同,建议用排卵试纸辅助判断。'},
    {q:'备孕要补什么?', a:'备孕建议补充叶酸(每天400-800微克),最好提前3个月开始。同时注意均衡饮食,适量运动,保持好心情。', b:'备孕期营养建议：1.叶酸400μg/天,提前3个月开始；2.铁和锌适量补充；3.维生素D每天10μg；4.减少咖啡因摄入。建议去医院做个孕前检查。'},
    {q:'经期头疼怎么缓解?', a:'经期头疼可能与激素变化有关。可以试试：热敷太阳穴、适当休息、避免强光刺激。如果严重建议就医。', b:'经期头疼常见原因是雌激素下降。缓解方法：1.充足睡眠 2.适量喝水 3.热敷或冷敷(看哪种舒服) 4.避免咖啡和酒精 5.严重时可在医生指导下用止痛药。'},
    {q:'为什么月经推迟?', a:'月经推迟原因很多：压力大、作息不规律、体重变化、甲状腺问题等。偶尔推迟1-2周不用太紧张,但如果经常不规律建议看医生。', b:'月经推迟7天内属于正常波动。常见原因包括：精神压力、过度运动、饮食变化、体重急剧变化。如果排除怀孕后仍持续推迟超过2周,建议去妇科检查。'},
  ];

  var currentRound = 0;
  var pairResults = [];
  var pointResults = [];
  var qEl = document.getElementById('arena-q');
  var outA = document.getElementById('arena-out-a');
  var outB = document.getElementById('arena-out-b');
  var sliderA = document.getElementById('arena-score-a');
  var sliderB = document.getElementById('arena-score-b');
  var valA = document.getElementById('arena-val-a');
  var valB = document.getElementById('arena-val-b');
  var nextBtn = document.getElementById('arena-next');
  var roundInfo = document.getElementById('arena-round-info');
  var resultsEl = document.getElementById('arena-results');

  function loadRound() {
    if(currentRound >= rounds.length) { showResults(); return; }
    var r = rounds[currentRound];
    qEl.textContent = '问: ' + r.q;
    outA.querySelector('.arena-text').textContent = r.a;
    outB.querySelector('.arena-text').textContent = r.b;
    outA.classList.remove('selected','winner','loser');
    outB.classList.remove('selected','winner','loser');
    sliderA.value = 3; sliderB.value = 3;
    valA.textContent = '3'; valB.textContent = '3';
    roundInfo.textContent = '第 ' + (currentRound+1) + ' / ' + rounds.length + ' 轮';
    nextBtn.textContent = currentRound < rounds.length-1 ? '下一轮 →' : '查看结果 →';
  }

  // Pairwise selection
  outA.addEventListener('click', function(){ outA.classList.add('selected'); outB.classList.remove('selected'); });
  outB.addEventListener('click', function(){ outB.classList.add('selected'); outA.classList.remove('selected'); });
  sliderA.addEventListener('input', function(){ valA.textContent = sliderA.value; });
  sliderB.addEventListener('input', function(){ valB.textContent = sliderB.value; });

  nextBtn.addEventListener('click', function(){
    // Record pairwise
    var pw = outA.classList.contains('selected') ? 'A' : outB.classList.contains('selected') ? 'B' : 'tie';
    pairResults.push(pw);
    // Record pointwise
    pointResults.push({ a: parseInt(sliderA.value), b: parseInt(sliderB.value) });
    // Highlight
    if(pw === 'A'){ outA.classList.add('winner'); outB.classList.add('loser'); }
    else if(pw === 'B'){ outB.classList.add('winner'); outA.classList.add('loser'); }

    currentRound++;
    setTimeout(loadRound, 400);
  });

  function showResults() {
    // Hide arena, show results
    document.getElementById('arena-active').style.display = 'none';
    resultsEl.style.display = 'block';

    var aWins = pairResults.filter(function(r){return r==='A'}).length;
    var bWins = pairResults.filter(function(r){return r==='B'}).length;
    var ties = pairResults.filter(function(r){return r==='tie'}).length;
    var total = pairResults.length;

    // Pairwise bars
    document.getElementById('res-a-fill').style.width = (aWins/total*100)+'%';
    document.getElementById('res-a-fill').textContent = aWins+' wins';
    document.getElementById('res-b-fill').style.width = (bWins/total*100)+'%';
    document.getElementById('res-b-fill').textContent = bWins+' wins';

    // Pointwise variance
    var scoresA = pointResults.map(function(r){return r.a});
    var scoresB = pointResults.map(function(r){return r.b});
    var avgA = (scoresA.reduce(function(a,b){return a+b},0)/scoresA.length).toFixed(1);
    var avgB = (scoresB.reduce(function(a,b){return a+b},0)/scoresB.length).toFixed(1);
    document.getElementById('res-avg-a').textContent = avgA;
    document.getElementById('res-avg-b').textContent = avgB;

    // Stability dots
    var dotsEl = document.getElementById('stability-dots');
    pairResults.forEach(function(r){
      var dot = document.createElement('span');
      dot.className = 'stability-dot ' + (r==='A'?'dot-a':r==='B'?'dot-b':'dot-tie');
      dot.textContent = r==='tie'?'=':r;
      dotsEl.appendChild(dot);
    });

    // Reset btn
    document.getElementById('arena-reset').addEventListener('click', function(){
      currentRound = 0; pairResults = []; pointResults = [];
      document.getElementById('arena-active').style.display = 'block';
      resultsEl.style.display = 'none';
      dotsEl.innerHTML = '';
      loadRound();
    });
  }

  loadRound();
})();
