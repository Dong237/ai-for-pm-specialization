/* ============================================
   U4 · Chatting 类用例 — Chat Pattern Visualizer
   ============================================ */
(() => {
  'use strict';

  // ---- Scenario data ----
  const scenarios = [
    {
      id: 'qa',
      label: 'Q&A',
      tagClass: 'scenario-tag-qa',
      pattern: 'Q&A (问答)',
      memory: '短期 (单轮)',
      memoryPct: 20,
      memoryColor: 'var(--blue)',
      tone: '专业、客观、有引用',
      context: '~800 tokens (问题 + RAG 检索结果)',
      contextPct: 25,
      contextColor: 'var(--blue)',
      fallback: '承认不知道 + 推荐人工 / 权威来源',
      risk: '低 (有来源兜底)',
      riskColor: 'var(--green)',
      messages: [
        { role: 'user', text: '经期能不能跑步?' },
        { role: 'ai', text: '可以适度运动. 研究表明, 经期进行中低强度运动 (如慢跑、瑜伽) 可以缓解痛经和情绪波动.', source: '来源: 《妇产科学》第9版, 人卫出版社' },
        { role: 'user', text: '那高强度的呢? 比如跑10公里?' },
        { role: 'ai', text: '不建议. 经期前 1-2 天子宫内膜脱落期, 高强度运动可能加重出血. 建议这两天以散步、拉伸为主, 第 3 天后可逐步恢复跑量.', source: '来源: ACOG (美国妇产科医师学会) 运动指南' },
        { role: 'user', text: '好的, 谢谢!' },
        { role: 'ai', text: '不客气! 如果运动时出现异常疼痛或大量出血, 请及时就医. 有其他问题随时问我.' }
      ]
    },
    {
      id: 'support',
      label: 'Support',
      tagClass: 'scenario-tag-support',
      pattern: 'Support (引导式支持)',
      memory: '中期 (本次会话)',
      memoryPct: 55,
      memoryColor: 'var(--amber)',
      tone: '关切、有条理、逐步引导',
      context: '~2000 tokens (症状描述 + 决策树 + 历史)',
      contextPct: 55,
      contextColor: 'var(--amber)',
      fallback: '无法判断时, 明确建议线下就医',
      risk: '中 (涉及健康判断)',
      riskColor: 'var(--amber)',
      messages: [
        { role: 'user', text: '我这两天肚子痛, 怎么办?' },
        { role: 'ai', text: '先别急, 让我帮你排查一下. 疼痛的位置在哪里? 是小腹正中, 还是偏左/偏右?' },
        { role: 'user', text: '小腹正中, 有点像来月经的感觉' },
        { role: 'ai', text: '了解. 你现在处于月经周期的哪个阶段? 根据你的记录, 你的预计经期是明天, 这个疼痛很可能是经前痉挛.' },
        { role: 'user', text: '对, 应该快来了' },
        { role: 'ai', text: '那大概率是经前痉挛. 建议: 1) 热敷小腹 15-20 分钟  2) 适当休息, 避免剧烈运动  3) 如果疼痛加重或持续 48 小时以上, 建议去妇科检查. 需要我帮你设个提醒吗?' }
      ]
    },
    {
      id: 'companion',
      label: 'Companion',
      tagClass: 'scenario-tag-companion',
      pattern: 'Companion (情感陪伴)',
      memory: '长期 (跨会话)',
      memoryPct: 90,
      memoryColor: 'var(--purple)',
      tone: '温暖、共情、像朋友',
      context: '~3000 tokens (人设 + 长期记忆 + 情绪历史)',
      contextPct: 80,
      contextColor: 'var(--purple)',
      fallback: '不急于给答案, 继续倾听 + 适时建议专业帮助',
      risk: '高 (情感依赖 + 边界模糊)',
      riskColor: 'var(--red)',
      messages: [
        { role: 'user', text: '今天心情不太好, 想聊聊' },
        { role: 'ai', text: '来, 跟我说说, 发生什么了? 还是就是莫名其妙地不开心?' },
        { role: 'user', text: '工作上被领导说了, 觉得自己什么都做不好' },
        { role: 'ai', text: '被批评的感觉真的很不舒服, 尤其是你明明已经很努力了. 上次你跟我说过加班到 11 点改那个方案, 我记得你当时也很累.' },
        { role: 'user', text: '你居然还记得... 是的, 那次就很崩溃' },
        { role: 'ai', text: '当然记得. 你不是"什么都做不好"的人 —— 你是那个会为了一个方案反复打磨到深夜的人. 今天可以对自己好一点, 你最近说想试试那家新开的甜品店, 今晚去犒劳一下自己?' }
      ]
    },
    {
      id: 'hybrid',
      label: 'Q&A + Reading',
      tagClass: 'scenario-tag-hybrid',
      pattern: 'Hybrid (Q&A + Reading)',
      memory: '中期 (需读取用户数据)',
      memoryPct: 45,
      memoryColor: 'var(--green)',
      tone: '简洁、数据驱动、有洞察',
      context: '~2500 tokens (用户本周数据 + 总结指令)',
      contextPct: 65,
      contextColor: 'var(--green)',
      fallback: '数据不足时, 提示用户补充记录',
      risk: '低-中 (数据准确性)',
      riskColor: 'var(--amber)',
      messages: [
        { role: 'user', text: '帮我总结一下这周的身体状态' },
        { role: 'ai', text: '好的, 我来看看你这周的记录...' },
        { role: 'ai', text: '这周总结:\n- 睡眠: 平均 6.8 小时, 比上周少了 0.5 小时\n- 情绪: 周一到周三偏低, 周四开始回升\n- 运动: 3 次瑜伽, 总计 2.5 小时\n- 经期: 第 24 天, 预计 3 天后来' },
        { role: 'user', text: '为什么周一到周三情绪低?' },
        { role: 'ai', text: '从记录看, 周一到周三你的睡眠都不到 6 小时, 而且你周一标记了"工作压力大". 睡眠不足 + 压力可能是主要原因. 你上周同期情绪也有类似波动, 可能跟经前期有关.' },
        { role: 'user', text: '有什么建议吗?' },
        { role: 'ai', text: '下周试试这个:\n1. 经前 5 天有意识地 11 点前入睡\n2. 减少咖啡摄入 (你周一到周三都喝了 3 杯)\n3. 周三做一次放松瑜伽, 提前缓冲情绪低谷\n\n要不要我帮你设这 3 个提醒?' }
      ]
    }
  ];

  // ---- DOM references ----
  const scenarioBtns = document.querySelectorAll('.scenario-btn');
  const convPanel = document.getElementById('chat-conv');
  const metaPanel = document.getElementById('chat-meta');

  if (!scenarioBtns.length || !convPanel || !metaPanel) return;

  let activeScenario = null;
  let messageTimer = null;

  // ---- Render conversation ----
  function renderConversation(scenario) {
    // Clear previous
    if (messageTimer) clearTimeout(messageTimer);
    convPanel.innerHTML = '';
    renderMeta(scenario);

    // Show messages one by one
    let delay = 0;
    scenario.messages.forEach((msg, i) => {
      delay += i === 0 ? 200 : 500;
      messageTimer = setTimeout(() => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${msg.role}`;

        const avatar = document.createElement('div');
        avatar.className = 'chat-avatar';
        avatar.textContent = msg.role === 'user' ? '你' : 'AI';

        const msgEl = document.createElement('div');
        msgEl.className = 'chat-msg';
        // Handle newlines
        msgEl.innerHTML = msg.text.replace(/\n/g, '<br/>');
        if (msg.source) {
          const src = document.createElement('div');
          src.className = 'chat-source';
          src.textContent = msg.source;
          msgEl.appendChild(src);
        }

        bubble.appendChild(avatar);
        bubble.appendChild(msgEl);
        convPanel.appendChild(bubble);
        convPanel.scrollTop = convPanel.scrollHeight;
      }, delay);
    });
  }

  // ---- Render metadata ----
  function renderMeta(s) {
    metaPanel.innerHTML = `
      <div class="meta-label">对话模式</div>
      <div class="meta-value"><span class="pill pill-green">${s.pattern}</span></div>

      <div class="meta-label">记忆需求</div>
      <div class="meta-value">${s.memory}</div>
      <div class="meta-bar"><div class="meta-bar-fill" style="width:${s.memoryPct}%;background:${s.memoryColor}"></div></div>

      <div class="meta-label">语气设定</div>
      <div class="meta-value">${s.tone}</div>

      <div class="meta-label">Context 占用</div>
      <div class="meta-value" style="font-size:12px;">${s.context}</div>
      <div class="meta-bar"><div class="meta-bar-fill" style="width:${s.contextPct}%;background:${s.contextColor}"></div></div>

      <div class="meta-label">Fallback 策略</div>
      <div class="meta-value" style="font-size:12px;">${s.fallback}</div>

      <div class="meta-label">风险等级</div>
      <div class="meta-value"><span style="color:${s.riskColor};font-weight:700;">${s.risk}</span></div>
    `;
  }

  // ---- Click handlers ----
  scenarioBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeScenario = scenarios[i];
      renderConversation(activeScenario);
    });
  });

})();
