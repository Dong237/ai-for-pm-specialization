/* U1 — 评测三层架构 · Evaluation Pyramid Widget */
(function(){
  'use strict';

  /* ── Pyramid click-to-expand ── */
  const layers = document.querySelectorAll('.pyramid-layer');
  const details = document.querySelectorAll('.pyramid-detail');

  if (layers.length) {
    layers.forEach(function(layer) {
      layer.addEventListener('click', function() {
        var target = layer.dataset.layer;
        var detail = document.getElementById('detail-' + target);
        if (!detail) return;

        // Toggle
        var wasVisible = detail.classList.contains('visible');
        details.forEach(function(d) { d.classList.remove('visible'); });
        layers.forEach(function(l) { l.classList.remove('active'); });

        if (!wasVisible) {
          detail.classList.add('visible');
          layer.classList.add('active');
        }
      });
    });
  }

  /* ── Drag-and-drop metric sorting ── */
  var dragZone = document.getElementById('drag-zone');
  if (!dragZone) return;

  // Correct mapping: metric → layer (1=主观, 2=客观, 3=业务)
  var correctMapping = {
    'LLM Judge 评分': '1',
    '人工抽检打分': '1',
    '内容安全审核分': '1',
    'P95 延迟': '2',
    '单次调用成本': '2',
    '格式合规率': '2',
    '建议接受率': '3',
    '7 日留存率': '3',
    '转人工率': '3'
  };

  var items = document.querySelectorAll('.drag-item');
  var dropTargets = document.querySelectorAll('.drop-target');
  var scoreEl = document.getElementById('drag-score-num');
  var placed = 0;
  var correct = 0;
  var total = items.length;
  var draggedItem = null;

  // Drag events for items
  items.forEach(function(item) {
    item.setAttribute('draggable', 'true');

    item.addEventListener('dragstart', function(e) {
      if (item.classList.contains('placed')) {
        e.preventDefault();
        return;
      }
      draggedItem = item;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.dataset.metric);
      setTimeout(function() { item.style.opacity = '0.5'; }, 0);
    });

    item.addEventListener('dragend', function() {
      item.style.opacity = '';
      draggedItem = null;
    });

    // Touch support
    var touchClone = null;
    var touchOffsetX = 0;
    var touchOffsetY = 0;

    item.addEventListener('touchstart', function(e) {
      if (item.classList.contains('placed')) return;
      draggedItem = item;
      var touch = e.touches[0];
      var rect = item.getBoundingClientRect();
      touchOffsetX = touch.clientX - rect.left;
      touchOffsetY = touch.clientY - rect.top;

      touchClone = item.cloneNode(true);
      touchClone.style.position = 'fixed';
      touchClone.style.zIndex = '9999';
      touchClone.style.pointerEvents = 'none';
      touchClone.style.opacity = '0.8';
      touchClone.style.transform = 'scale(1.1) rotate(-3deg)';
      touchClone.style.width = rect.width + 'px';
      document.body.appendChild(touchClone);
      moveTouchClone(touch);
      item.style.opacity = '0.3';
    }, { passive: true });

    item.addEventListener('touchmove', function(e) {
      if (!touchClone) return;
      e.preventDefault();
      moveTouchClone(e.touches[0]);
    }, { passive: false });

    item.addEventListener('touchend', function(e) {
      if (!touchClone) return;
      var touch = e.changedTouches[0];
      touchClone.remove();
      touchClone = null;
      item.style.opacity = '';

      // Find drop target under touch point
      var elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      var dropTarget = elemBelow ? elemBelow.closest('.drop-target') : null;
      if (dropTarget && draggedItem) {
        handleDrop(dropTarget, draggedItem);
      }
      draggedItem = null;
    });

    function moveTouchClone(touch) {
      if (!touchClone) return;
      touchClone.style.left = (touch.clientX - touchOffsetX) + 'px';
      touchClone.style.top = (touch.clientY - touchOffsetY) + 'px';
    }
  });

  // Drop target events
  dropTargets.forEach(function(target) {
    target.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      target.classList.add('drag-over');
    });
    target.addEventListener('dragleave', function() {
      target.classList.remove('drag-over');
    });
    target.addEventListener('drop', function(e) {
      e.preventDefault();
      target.classList.remove('drag-over');
      if (draggedItem) {
        handleDrop(target, draggedItem);
      }
    });
  });

  function handleDrop(target, item) {
    var metric = item.dataset.metric;
    var targetLayer = target.dataset.layer;
    var correctLayer = correctMapping[metric];

    // Create placed chip
    var chip = document.createElement('span');
    chip.className = 'drag-item';
    chip.textContent = metric;

    if (targetLayer === correctLayer) {
      chip.classList.add('correct');
      correct++;
    } else {
      chip.classList.add('wrong');
      chip.title = '应该放在第 ' + correctLayer + ' 层';
    }

    target.appendChild(chip);
    item.classList.add('placed');
    placed++;

    updateScore();
  }

  function updateScore() {
    if (scoreEl) {
      scoreEl.textContent = correct + ' / ' + total;
    }
    if (placed === total) {
      var msg = document.getElementById('drag-complete-msg');
      if (msg) {
        if (correct === total) {
          msg.textContent = '完美! 9/9 全部正确!';
          msg.style.color = 'var(--green)';
        } else {
          msg.textContent = '完成! 错误的指标会标红, 悬停查看正确位置.';
          msg.style.color = 'var(--amber)';
        }
        msg.style.display = 'block';
      }
    }
  }

  // Reset button
  var resetBtn = document.getElementById('pyramid-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      placed = 0;
      correct = 0;
      items.forEach(function(item) {
        item.classList.remove('placed');
      });
      dropTargets.forEach(function(target) {
        // Remove placed chips
        var chips = target.querySelectorAll('.drag-item');
        chips.forEach(function(c) { c.remove(); });
      });
      if (scoreEl) scoreEl.textContent = '0 / ' + total;
      var msg = document.getElementById('drag-complete-msg');
      if (msg) msg.style.display = 'none';
    });
  }

})();
