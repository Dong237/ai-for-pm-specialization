/* ===========================================
   Unit 1 · Augmentation vs Automation
   Interactive widgets
   =========================================== */

(() => {
  'use strict';

  // -----------------------------------------------
  // 1. Stat counter animation (Step 5)
  // -----------------------------------------------
  const statEl = document.getElementById('stat-counter');
  if (statEl) {
    const target = parseFloat(statEl.dataset.target) || 78.7;
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !animated) {
          animated = true;
          animateCounter(statEl, 0, target, 1500);
          observer.unobserve(statEl);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statEl);

    function animateCounter(el, from, to, duration) {
      const start = performance.now();
      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = from + (to - from) * eased;
        el.textContent = current.toFixed(1);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }

  // -----------------------------------------------
  // 2. Stat bars animation (Step 5)
  // -----------------------------------------------
  const statBars = document.querySelectorAll('.sbar-fill');
  if (statBars.length) {
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const bar = e.target;
          const v = parseFloat(bar.dataset.value || '0');
          bar.style.width = v + '%';
          barObs.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });
    statBars.forEach(b => barObs.observe(b));
  }

  // -----------------------------------------------
  // 3. Level showcase tabs (Step 7)
  // -----------------------------------------------
  const showcase = document.getElementById('level-showcase');
  if (showcase) {
    const tabs = showcase.querySelectorAll('.ls-tab');
    const panels = showcase.querySelectorAll('.ls-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const lv = tab.dataset.lv;
        tabs.forEach(t => t.classList.toggle('active', t === tab));
        panels.forEach(p => {
          const isMatch = p.dataset.lv === lv;
          p.classList.toggle('active', isMatch);
        });
      });
    });
  }

  // -----------------------------------------------
  // 4. Spectrum drag-and-drop widget (Step 8)
  // -----------------------------------------------
  const widget = document.getElementById('spectrum-widget');
  if (!widget) return;

  const cards = widget.querySelectorAll('.sw-card');
  const zones = widget.querySelectorAll('.sw-zone');
  const checkBtn = document.getElementById('sw-check');
  const resetBtn = document.getElementById('sw-reset');
  const counterEl = document.getElementById('sw-counter');
  const resultsEl = document.getElementById('sw-results');
  const resultsGrid = document.getElementById('sw-results-grid');
  const scoreEl = document.getElementById('sw-score');

  // State
  let selectedCard = null;
  let placements = {}; // cardId -> level
  const totalCards = cards.length;

  // Answer key with explanations
  const answerKey = {
    'bmi': {
      level: 1,
      reason: 'BMI 是纯数学计算 (体重/身高^2), 无风险, 完全可逆, 规则确定. 没有理由让用户参与计算过程.'
    },
    'emotion': {
      level: 3,
      reason: '情绪识别有主观性, AI 分类可能不准 (你觉得自己焦虑, AI 说你平静). 给出几个选项让用户确认/修正更好.'
    },
    'health-advice': {
      level: 4,
      reason: '健康建议涉及用户行为改变, 有一定风险. AI 给参考, 用户主导采纳与否. 最好加 "仅供参考" 提示.'
    },
    'emergency': {
      level: 5,
      reason: '紧急症状判断是高风险 + 不可逆 (延误就医). AI 绝不能替用户判断 "要不要去医院". 只能展示信息 + 建议就医.'
    },
    'diet-summary': {
      level: 2,
      reason: '饮食总结是低风险信息汇总. AI 自动生成, 用户扫一眼确认即可. 如果漏了什么, 用户可以补充.'
    },
    'period-predict': {
      level: 1,
      reason: '经期预测是基于历史数据的算法计算, 不需要 LLM. 低风险, 高可逆 (预测错了就修正), 规则明确.'
    },
    'chat-comfort': {
      level: 3,
      reason: '心理安慰需要 AI 主动回应, 但对话方向由用户引导. AI 提供情感支持选项, 用户选择接受或换方向.'
    },
    'med-reminder': {
      level: 1,
      reason: '用药提醒是纯规则调度: 用户设好时间, 到点推送. 不需要 AI 判断, 不需要用户审批.'
    }
  };

  // Card click handler
  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('placed')) return;

      // Deselect previous
      if (selectedCard) selectedCard.classList.remove('selected');

      // Toggle selection
      if (selectedCard === card) {
        selectedCard = null;
      } else {
        selectedCard = card;
        card.classList.add('selected');
        // Highlight zones
        zones.forEach(z => z.classList.add('highlight'));
      }
    });
  });

  // Zone click handler
  zones.forEach(zone => {
    zone.addEventListener('click', () => {
      if (!selectedCard) return;

      const cardId = selectedCard.dataset.id;
      const level = parseInt(zone.dataset.level);

      // Place the card
      placements[cardId] = level;
      selectedCard.classList.remove('selected');
      selectedCard.classList.add('placed');

      // Add chip to zone
      const chip = document.createElement('span');
      chip.className = 'sw-placed-chip';
      chip.textContent = selectedCard.querySelector('.sw-card-name').textContent;
      chip.dataset.cardId = cardId;
      zone.querySelector('.sw-zone-slots').appendChild(chip);

      selectedCard = null;
      zones.forEach(z => z.classList.remove('highlight'));

      updateCounter();
    });
  });

  function updateCounter() {
    const placed = Object.keys(placements).length;
    counterEl.textContent = `已放置: ${placed} / ${totalCards}`;
    checkBtn.disabled = placed < totalCards;
    if (placed >= totalCards) {
      checkBtn.textContent = '查看结果 ✓';
    }
  }

  // Check results
  checkBtn.addEventListener('click', () => {
    if (Object.keys(placements).length < totalCards) return;

    let correct = 0;
    let close = 0;
    let html = '';

    cards.forEach(card => {
      const id = card.dataset.id;
      const userLevel = placements[id];
      const answer = answerKey[id];
      const diff = Math.abs(userLevel - answer.level);

      let status, icon, statusClass;
      if (diff === 0) {
        status = '完全正确';
        icon = '&#10004;';
        statusClass = 'correct';
        correct++;
      } else if (diff === 1) {
        status = '差一级';
        icon = '&#9679;';
        statusClass = 'close';
        close++;
      } else {
        status = '偏差较大';
        icon = '&#10008;';
        statusClass = 'wrong';
      }

      html += `
        <div class="sw-result-row ${statusClass}">
          <span class="sw-result-icon">${card.querySelector('.sw-card-icon').textContent}</span>
          <span class="sw-result-name">${card.querySelector('.sw-card-name').textContent}</span>
          <span class="sw-result-yours">你: L${userLevel}</span>
          <span class="sw-result-answer">参考: L${answer.level}</span>
        </div>
        <div style="padding:8px 14px 12px;font-size:13px;color:var(--ink-soft);background:var(--bg-card);border-radius:0 0 8px 8px;margin-top:-6px;margin-bottom:8px;border-left:4px solid var(--border);">
          ${answer.reason}
        </div>
      `;
    });

    resultsGrid.innerHTML = html;

    const total = totalCards;
    const pct = Math.round((correct / total) * 100);
    let msg;
    if (pct >= 80) {
      msg = `&#127881; ${correct}/${total} 完全正确 (${close} 个差一级). 你对产品分级的直觉很准!`;
    } else if (pct >= 50) {
      msg = `&#128170; ${correct}/${total} 完全正确. 回头看看 Step 6 的三因子, 会更清晰.`;
    } else {
      msg = `&#128218; ${correct}/${total} 完全正确. 别担心, 这道题本来就需要练习. 重做一次看看.`;
    }
    scoreEl.innerHTML = msg;

    resultsEl.style.display = 'block';
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Reset
  resetBtn.addEventListener('click', () => {
    placements = {};
    selectedCard = null;

    cards.forEach(card => {
      card.classList.remove('selected', 'placed');
    });

    zones.forEach(zone => {
      zone.querySelector('.sw-zone-slots').innerHTML = '';
      zone.classList.remove('highlight');
    });

    resultsEl.style.display = 'none';
    resultsGrid.innerHTML = '';
    scoreEl.innerHTML = '';
    checkBtn.textContent = '查看结果 (先放完 8 张卡)';
    updateCounter();
  });

  updateCounter();

})();
