/* ===========================================
   Unit 3 · Writing 类用例
   Interactive widgets
   =========================================== */

(() => {
  'use strict';

  // -----------------------------------------------
  // 1. Writing Studio tabs
  // -----------------------------------------------
  const studio = document.getElementById('writing-studio');
  if (!studio) return;

  const wsTabs = studio.querySelectorAll('.ws-tab');
  const wsPanels = studio.querySelectorAll('.ws-panel');

  wsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      wsTabs.forEach(t => t.classList.toggle('active', t === tab));
      wsPanels.forEach(p => p.classList.toggle('active', p.dataset.mode === mode));
    });
  });

  // -----------------------------------------------
  // 2. Generate buttons
  // -----------------------------------------------
  const generateButtons = studio.querySelectorAll('.ws-generate');
  generateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      generateOutput(mode);
    });
  });

  // -----------------------------------------------
  // 3. Content database for generation
  // -----------------------------------------------
  const draftTemplates = {
    '经期第2天': {
      '疲惫': {
        '没吃早餐': {
          pro: '早上好. 经期第二天, 注意补充铁质和水分. 未进早餐, 建议尽早进食易消化食物, 如粥类或面包, 以维持血糖稳定.',
          warm: '早上好呀 ~~ 经期第二天, 昨晚没睡好吧? 还没吃早餐的话, 先喝杯温水, 等一会儿吃点好消化的东西. 今天对自己温柔一点就好.',
          lively: '嘿! 经期第二天还空腹出门? 你的肚子正在向你发出抗议! 先来杯红糖姜茶暖暖, 再配个松软的小面包, 今天的使命: 做一个被照顾的小公主!'
        },
        '刚运动完': {
          pro: '运动后注意补水和拉伸. 经期第二天建议以轻度运动为主, 如散步或瑜伽. 注意监测身体反应, 如有不适请停止.',
          warm: '运动完了? 经期第二天还能动起来, 你真棒! 记得好好拉伸, 喝点温水, 今天已经很努力了, 好好休息一下.',
          lively: '经期第二天居然还去运动了?! 给你的毅力打满分! 现在赶紧喝水 + 拉伸, 然后奖励自己一杯热奶茶 (不加冰哦)!'
        },
        '工作很忙': {
          pro: '经期期间工作繁忙, 建议合理安排任务优先级. 每工作 50 分钟休息 10 分钟, 注意补充水分.',
          warm: '工作很忙呀, 辛苦了. 经期第二天, 身体和精力都在低谷期, 别太硬扛. 每隔一小时站起来走走, 喝口热水.',
          lively: '打工人 + 经期 = 双重 debuff! 但你是那种开了 debuff 还能输出的选手. 记得摸鱼的时候喝点热饮, 身体第一!'
        },
        '周末休息': {
          pro: '周末休息日, 经期第二天建议充分休息. 适量活动如散步有助于改善不适感. 饮食注意温热易消化.',
          warm: '周末好呀~ 经期第二天, 正好好好休息. 不想动就窝在沙发上看个剧, 想动就出门散散步, 今天没有 KPI!',
          lively: '周末 + 经期 = 合法赖床日! 今天的任务清单: 1. 睡到自然醒 2. 吃好吃的 3. 继续睡. 完成一项就算满分!'
        }
      },
      '焦虑': {
        '没吃早餐': {
          pro: '经期伴随焦虑情绪属正常生理反应. 空腹状态可能加重不适, 建议进食后情绪会有所改善.',
          warm: '经期第二天, 有点焦虑? 这很正常, 激素波动会影响情绪. 先吃点东西, 空腹会让焦虑感加重的. 一步步来, 不着急.',
          lively: '焦虑小怪兽来了? 经期第二天的激素在搞事情! 第一步: 填饱肚子 (空腹焦虑 x2). 第二步: 深呼吸. 第三步: 告诉自己 "这不是我的错, 是荷尔蒙的错"!'
        }
      },
      '开心': {
        '没吃早餐': {
          pro: '经期第二天保持好心情有利于身体恢复. 建议按时进食, 补充营养.',
          warm: '心情不错呀! 经期第二天还这么开心, 真好~ 别忘了吃早餐, 好心情配好食物, 今天会是美好的一天!',
          lively: '开心 buff 已加载! 经期第二天也挡不住你的好心情! 快去吃个美美的早餐, 让今天成为 "虽然经期但超开心" 纪念日!'
        }
      },
      '平静': {
        '没吃早餐': {
          pro: '经期第二天, 身体状态平稳. 建议按时进食, 维持能量供给.',
          warm: '早上好, 今天感觉平静挺好的. 经期第二天, 慢慢来, 先吃点东西开始新的一天.',
          lively: '佛系经期第二天, 心如止水! 但肚子可不佛系 -- 它想吃东西了. 去觅食吧, 一碗热粥就是今天的小确幸!'
        }
      }
    },
    '备孕中': {
      '疲惫': {
        '没吃早餐': {
          pro: '备孕期间营养摄入很重要. 建议按时进食, 保证叶酸和铁质的补充. 注意休息, 规律作息有助于受孕.',
          warm: '备孕路上, 辛苦了. 今天有点累? 没关系, 先吃点东西补充能量. 记得吃叶酸哦, 这是每天的小任务.',
          lively: '备孕打卡第 N 天! 虽然有点累, 但你的身体正在为一个新生命做准备, 超级酷的! 先填饱肚子, 给未来宝宝的 "酒店" 装修好!'
        }
      }
    },
    '孕期16周': {
      '疲惫': {
        '没吃早餐': {
          pro: '孕 16 周, 胎儿发育需要稳定的营养供给. 请尽快进食, 优先选择富含蛋白质和维生素的食物. 如有持续不适请联系医生.',
          warm: '孕 16 周了, 宝宝在快速长大呢. 今天累了? 先吃点东西, 你们俩都需要能量. 一切慢慢来, 不着急.',
          lively: '你肚子里的小房客已经 16 周了! Ta 正在疯狂长指甲和头发呢! 快给 Ta 送点营养过去 -- 先吃早餐!'
        }
      }
    },
    '产后第3周': {
      '疲惫': {
        '没吃早餐': {
          pro: '产后第 3 周, 身体仍在恢复中. 充足的营养对哺乳和体力恢复至关重要. 建议少量多餐, 注意蛋白质摄入.',
          warm: '产后第三周, 这段时间真的好辛苦. 没吃早餐? 先简单吃点, 哪怕一杯热牛奶也好. 你已经做得很棒了, 记得照顾自己.',
          lively: '新手妈妈第三周! 已经是照顾宝宝的老手了! 但是不能只顾宝宝不顾自己呀 -- 快吃早餐, 你也是需要被照顾的人!'
        }
      }
    }
  };

  const paraphraseTemplates = {
    pro: '围绝经期综合征, 指的是女性在45-55岁左右, 因为体内性激素 (主要是雌激素) 水平逐渐下降, 引起的一系列身体和心理变化. 这属于正常的生理过渡阶段.',
    warm: '简单说就是: 女性大概在 45-55 岁的时候, 身体里的雌激素开始慢慢变少. 这个过程中, 你可能会遇到潮热、失眠、情绪波动这些状况. 听起来有点吓人? 其实这是每个女性都会经历的自然变化, 不是病.',
    lively: '想象一下: 你的身体就像一个运转了几十年的精密工厂, 到了 45-55 岁, 开始进入 "退休过渡期". 雌激素这个 "总监" 要慢慢交班了, 交接过程中可能会有些混乱 -- 潮热、失眠、心情过山车. 但别怕, 这是正常的 "交接期", 不是 "出故障"!'
  };

  const expandTemplates = {
    pro: '保暖方面: 建议室内温度保持在 20-24 摄氏度. 外出时注意腹部和腰部保暖, 可使用暖宫贴. 饮食方面: 避免冷饮、冰淇淋、生冷水果 (如西瓜). 优先选择温热食物, 如热粥、温水、姜茶. 经期期间, 子宫肌肉收缩频繁, 寒冷刺激可能加重痛经.',
    warm: '保暖这件事, 听起来简单, 但经期真的很重要. 肚子和腰这两个地方最怕冷 -- 贴个暖宫贴, 或者围一条围巾在腰上, 会舒服很多. 吃的方面, 冰的东西先忍忍, 冰奶茶、冰西瓜这些暂时放一放. 换成热的 -- 一碗热汤、一杯姜枣茶, 暖进去的那一刻, 你会感谢自己的.',
    lively: '保暖大作战开始! 你的子宫现在就像一个需要被温柔对待的小火炉 -- 请给它加温! 暖宫贴贴上, 围巾围上, 热水喝起来! 至于冰奶茶? 对不起, 它被临时列入黑名单了 (经期结束后再约它). 用一杯红糖姜茶代替, 暖到心里去!'
  };

  // -----------------------------------------------
  // 4. Generate output function
  // -----------------------------------------------
  function generateOutput(mode) {
    let proText, warmText, livelyText, verdictText;

    if (mode === 'draft') {
      const outputDiv = document.getElementById('ws-draft-output');
      const state = document.getElementById('ws-draft-state').value;
      const mood = document.getElementById('ws-draft-mood').value;
      const context = document.getElementById('ws-draft-context').value;

      // Look up templates with fallbacks
      const stateData = draftTemplates[state] || draftTemplates['经期第2天'];
      const moodData = stateData[mood] || stateData['疲惫'];
      const contextData = moodData[context] || moodData['没吃早餐'];

      proText = contextData.pro;
      warmText = contextData.warm;
      livelyText = contextData.lively;
      verdictText = `<strong>Vitamin 推荐:</strong> 对于 ${state} + ${mood} 的用户, 推荐 <span class="pill pill-green">T=0.7 温暖</span> 风格. 情感支持类内容需要人味, 但不能太跳脱.`;

      outputDiv.innerHTML = buildResultHTML(proText, warmText, livelyText, verdictText);
      outputDiv.style.display = 'block';
      outputDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    else if (mode === 'paraphrase') {
      const outputDiv = document.getElementById('ws-para-output');
      const input = document.getElementById('ws-para-input').value.trim();

      if (!input) return;

      // Use template or generate a simple paraphrase
      proText = paraphraseTemplates.pro;
      warmText = paraphraseTemplates.warm;
      livelyText = paraphraseTemplates.lively;

      if (input !== document.getElementById('ws-para-input').defaultValue) {
        // User edited the text, show a simulated response
        const shortened = input.length > 30 ? input.substring(0, 30) + '...' : input;
        proText = `[专业改写] ${shortened} -- 以上内容用更简洁的专业语言重新表述, 保留核心医学信息.`;
        warmText = `[温暖改写] 简单来说: ${shortened} -- 用日常能理解的话重新说一遍, 让你更容易明白.`;
        livelyText = `[活泼改写] 换个说法! ${shortened} -- 用更生动有趣的方式告诉你同一件事.`;
      }

      verdictText = `<strong>Vitamin 推荐:</strong> 医学知识改写, 推荐 <span class="pill pill-green">T=0.7 温暖</span> 或 <span class="pill pill-blue">T=0.3 专业</span>. 取决于场景: 知识库用专业, 用户对话用温暖.`;

      outputDiv.innerHTML = buildResultHTML(proText, warmText, livelyText, verdictText);
      outputDiv.style.display = 'block';
      outputDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    else if (mode === 'expand') {
      const outputDiv = document.getElementById('ws-exp-output');
      const input = document.getElementById('ws-exp-input').value.trim();

      if (!input) return;

      proText = expandTemplates.pro;
      warmText = expandTemplates.warm;
      livelyText = expandTemplates.lively;

      if (input !== document.getElementById('ws-exp-input').defaultValue) {
        proText = `[专业展开] "${input}" -- 从医学/健康角度详细说明, 包括具体数值、注意事项和科学依据.`;
        warmText = `[温暖展开] "${input}" -- 用关心的语气展开说明, 加上具体的操作建议和温馨提示.`;
        livelyText = `[活泼展开] "${input}" -- 用生动有趣的比喻展开, 让建议变得更容易记住和执行.`;
      }

      verdictText = `<strong>Vitamin 推荐:</strong> 健康建议展开, 推荐 <span class="pill pill-green">T=0.7 温暖</span>. 让建议听起来像朋友在说, 而不是教科书.`;

      outputDiv.innerHTML = buildResultHTML(proText, warmText, livelyText, verdictText);
      outputDiv.style.display = 'block';
      outputDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function buildResultHTML(pro, warm, lively, verdict) {
    return `
      <div class="ws-result-cards">
        <div class="ws-result-card ws-pro">
          <div class="ws-result-tag"><span class="pill pill-blue">T = 0.3 专业</span></div>
          <p class="ws-result-text">${pro}</p>
        </div>
        <div class="ws-result-card ws-warm">
          <div class="ws-result-tag"><span class="pill pill-green">T = 0.7 温暖</span></div>
          <p class="ws-result-text">${warm}</p>
        </div>
        <div class="ws-result-card ws-lively">
          <div class="ws-result-tag"><span class="pill pill-amber">T = 1.0 活泼</span></div>
          <p class="ws-result-text">${lively}</p>
        </div>
      </div>
      <div class="ws-vitamin-verdict">${verdict}</div>
    `;
  }

})();
