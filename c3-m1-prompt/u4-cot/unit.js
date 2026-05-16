/* U4 · CoT Toggle — compare same prompt with/without chain-of-thought */
(() => {
  'use strict';

  const toggleBtns = document.querySelectorAll('.cot-toggle-btn');
  const panels = document.querySelectorAll('.cot-panel');

  if (!toggleBtns.length) return;

  // Scenario data
  const scenarios = [
    {
      id: 'symptom',
      question: '用户输入: "最近总是头疼, 而且很想吃甜的, 情绪也不太稳定. 我现在是什么状态?"',
      without: {
        response: '根据你的描述, 你可能处于经期. 建议多休息, 注意保暖.',
        verdict: 'fail',
        verdictText: '错误: 头疼+想吃甜+情绪不稳 → 经前期(PMS), 不是经期.',
      },
      with: {
        thinking: '让我分析用户的症状:\n1. 头疼 → 可能出现在经前期或经期\n2. 想吃甜的 → 典型的经前期(PMS)症状, 与孕酮水平变化有关\n3. 情绪不稳定 → 经前期常见, 通常在月经前 3-7 天\n综合判断: 三个症状同时出现, 最符合经前期(PMS)的特征模式.',
        response: '根据症状分析, 你很可能处于经前期(PMS). 头疼、嗜甜和情绪波动是经前 3-7 天的典型组合. 建议: 适量补充镁元素, 用坚果代替甜食, 保持规律作息.',
        verdict: 'pass',
        verdictText: '正确: 三步推理, 准确识别为经前期.',
      }
    },
    {
      id: 'priority',
      question: '产品问题: "Vitamin 要上线一个新功能, 可以选择: A. 自动记录饮食 B. 情绪日记 C. 经期预测优化. 用户反馈中哪个需求最大?"',
      without: {
        response: '建议优先做经期预测优化, 因为这是核心功能.',
        verdict: 'fail',
        verdictText: '问题: 没有分析过程, 直接下结论, 缺乏说服力.',
      },
      with: {
        thinking: '让我分析三个选项:\n1. 自动记录饮食 → 技术难度高(需要图像识别), 用户使用频率中等\n2. 情绪日记 → 技术简单, 但属于"锦上添花", 非核心\n3. 经期预测优化 → 核心功能, 用户反馈中提到最多(假设), 直接影响留存\n权衡: 核心功能优先, 经期预测优化的 ROI 最高.',
        response: '建议优先 C(经期预测优化). 理由: 1) 核心功能, 直接影响用户留存; 2) 技术可行, 优化算法即可; 3) 用户反馈中关于预测不准的提及率最高. A 可以放第二期, B 优先级最低.',
        verdict: 'pass',
        verdictText: '正确: 分析了三个维度, 结论有理有据.',
      }
    }
  ];

  let currentScenario = 0;

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      document.getElementById('cot-panel-' + mode).classList.add('active');
    });
  });

  // Scenario switcher
  const scenarioBtns = document.querySelectorAll('.cot-scenario-btn');
  scenarioBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScenario = i;
      renderScenario(i);
    });
  });

  function renderScenario(idx) {
    const s = scenarios[idx];
    if (!s) return;

    // Question
    document.querySelectorAll('.cot-question').forEach(el => {
      el.textContent = s.question;
    });

    // Without CoT
    const withoutResponse = document.getElementById('cot-without-response');
    const withoutVerdict = document.getElementById('cot-without-verdict');
    if (withoutResponse) {
      withoutResponse.textContent = s.without.response;
      withoutResponse.className = 'cot-response wrong';
    }
    if (withoutVerdict) {
      withoutVerdict.textContent = s.without.verdictText;
      withoutVerdict.className = 'cot-verdict fail';
    }

    // With CoT
    const withThinking = document.getElementById('cot-with-thinking');
    const withResponse = document.getElementById('cot-with-response');
    const withVerdict = document.getElementById('cot-with-verdict');
    if (withThinking) withThinking.textContent = s.with.thinking;
    if (withResponse) {
      withResponse.textContent = s.with.response;
      withResponse.className = 'cot-response right';
    }
    if (withVerdict) {
      withVerdict.textContent = s.with.verdictText;
      withVerdict.className = 'cot-verdict pass';
    }
  }

  renderScenario(0);
})();
