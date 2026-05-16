/* U5 Compliance Checklist Widget */
(() => {
  'use strict';

  const widget = document.getElementById('compliance-checklist');
  if (!widget) return;

  const clauses = [
    { title: '算法备案', status: 'partial', law: '第17条: 具有舆论属性或社会动员能力的生成式AI服务, 应开展安全评估并履行算法备案手续.', vitamin: 'Vitamin 作为健康AI服务, 需要完成算法备案. 当前状态: 需确认是否属于"具有舆论属性"的服务范围.' },
    { title: '训练数据合规', status: 'partial', law: '第7条: 应采取有效措施增强训练数据的真实性、准确性、客观性、多样性.', vitamin: 'Vitamin 使用的健康知识库需要确保来源可靠 (权威医学文献), 避免偏见和歧视性数据.' },
    { title: '内容安全', status: 'compliant', law: '第4条: 不得生成煽动颠覆国家政权、危害国家安全等法律禁止的内容.', vitamin: 'Vitamin 已通过输入过滤和输出审核实现内容安全控制. ✅' },
    { title: '反歧视', status: 'compliant', law: '第4条: 采取有效措施防止产生民族、性别、年龄、健康等歧视.', vitamin: 'Vitamin 的健康建议不因用户性别/年龄/地域而歧视. 需定期审计输出内容. ✅' },
    { title: '用户知情同意', status: 'noncompliant', law: '相关条款: 用户应知晓正在与AI交互, 并了解数据如何被使用.', vitamin: 'Vitamin 需要在用户首次使用时明确告知: 1) 正在使用AI 2) 数据用途 3) 可随时撤回同意. ❌ 当前缺失.' },
    { title: '个人信息保护', status: 'partial', law: '第4条+《个人信息保护法》: 不得侵害他人隐私权和个人信息权益.', vitamin: 'Vitamin 收集经期数据、健康记录等敏感信息. 需要: 最小化收集 + 加密存储 + 明确用途. 当前部分达标.' },
    { title: '数据保留期限', status: 'noncompliant', law: '相关规范: 对话日志和用户数据应有明确的保留期限, 过期应删除.', vitamin: 'Vitamin 需要制定数据保留策略: 对话日志保留90天, 健康数据保留用户要求的时间. ❌ 当前无明确策略.' },
    { title: '投诉举报机制', status: 'noncompliant', law: '相关条款: 应建立健全投诉举报机制, 设置便捷入口, 及时受理并反馈.', vitamin: 'Vitamin 需要在产品内添加: 举报按钮 + 反馈渠道 + 处理时限承诺. ❌ 当前缺失.' },
    { title: '未成年人保护', status: 'partial', law: '相关条款+《未成年人保护法》: 对未成年人使用应有特别保护措施.', vitamin: 'Vitamin 用户可能包含未成年女性. 需要: 年龄验证 + 未成年内容保护 + 家长知情.' },
    { title: '可解释性', status: 'partial', law: '行业最佳实践: AI决策应具备一定的可解释性, 用户有权了解AI回答的依据.', vitamin: 'Vitamin 的健康建议应能追溯到知识来源, 让用户知道"这个建议是基于什么". 当前部分实现.' },
  ];

  const clauseList = document.getElementById('clause-list');
  const progressPct = document.getElementById('progress-pct');
  const progressFillBar = document.getElementById('progress-fill-bar');

  function calcCompliance() {
    const scores = { compliant: 1, partial: 0.5, noncompliant: 0 };
    const total = clauses.reduce((sum, c) => sum + scores[c.status], 0);
    return Math.round((total / clauses.length) * 100);
  }

  function render() {
    clauseList.innerHTML = '';
    clauses.forEach((c, i) => {
      const statusIcon = c.status === 'compliant' ? '✅' : c.status === 'partial' ? '⚠️' : '❌';
      const statusClass = c.status === 'compliant' ? 'status-compliant' : c.status === 'partial' ? 'status-partial' : 'status-noncompliant';

      const div = document.createElement('div');
      div.className = 'clause-item';
      div.innerHTML = `
        <div class="clause-header">
          <span class="clause-status ${statusClass}">${statusIcon}</span>
          <span class="clause-title">${i + 1}. ${c.title}</span>
          <span class="clause-expand">▼</span>
        </div>
        <div class="clause-detail">
          <div class="clause-detail-inner">
            <div class="clause-regulation"><strong>法规要求:</strong> ${c.law}</div>
            <div class="clause-vitamin"><strong>Vitamin 状态:</strong> ${c.vitamin}</div>
          </div>
        </div>
      `;
      div.addEventListener('click', () => {
        const wasExpanded = div.classList.contains('expanded');
        clauseList.querySelectorAll('.clause-item').forEach(el => el.classList.remove('expanded'));
        if (!wasExpanded) div.classList.add('expanded');
      });
      clauseList.appendChild(div);
    });

    const pct = calcCompliance();
    progressPct.textContent = pct + '%';
    progressFillBar.style.width = pct + '%';
  }

  render();
})();
