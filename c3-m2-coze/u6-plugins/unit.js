/* Unit 6 · Plugins — interactive plugin gallery */
(() => {
  'use strict';

  const plugins = {
    weather: { name: '天气查询', icon: '&#9925;&#65039;', desc: '获取指定城市的实时天气数据', detail: '调用天气 API, 返回温度、湿度、天气状况. Vitamin 场景: 回答"今天适合户外运动吗"需要知道当地天气.', type: '官方插件' },
    search: { name: '网页搜索', icon: '&#128269;', desc: '搜索互联网获取最新信息', detail: '调用搜索引擎 API, 返回 Top 5 搜索结果. Vitamin 场景: 补充最新的健康资讯、回答知识库中没有的问题.', type: '官方插件' },
    image: { name: '图片生成', icon: '&#127912;', desc: '根据文字描述生成图片', detail: '调用图片生成模型. Vitamin 场景: 生成健康饮食搭配的示意图, 让建议更直观.', type: '官方插件' },
    calculator: { name: '计算器', icon: '&#129518;', desc: '精确数学计算', detail: 'LLM 算数不靠谱, 计算器插件做精确计算. Vitamin 场景: 计算 BMI、热量摄入等需要精确数字的场景.', type: '官方插件' },
    calendar: { name: '日历管理', icon: '&#128197;', desc: '创建和管理日历事件', detail: '调用日历 API, 创建提醒事件. Vitamin 场景: 帮用户设置经期提醒、服药提醒.', type: '官方插件' },
    custom: { name: '自定义 API', icon: '&#128268;', desc: '连接你自己的后端 API', detail: '把任何 REST API 封装成插件. Vitamin 场景: 连接 Vitamin 后端的用户数据接口, 获取用户历史健康记录.', type: '自定义' },
  };

  const cards = document.querySelectorAll('.plugin-card');
  const detailPanel = document.getElementById('plugin-detail');

  if (!cards.length || !detailPanel) return;

  let activeKey = null;
  const installedPlugins = new Set();

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.plugin;
      if (!key || !plugins[key]) return;

      // Toggle install state
      if (!installedPlugins.has(key)) {
        installedPlugins.add(key);
        card.classList.add('installed');
        const badge = card.querySelector('.plugin-card-badge');
        if (badge) badge.style.display = 'inline-block';
      }

      // Show detail
      if (activeKey === key) {
        activeKey = null;
        detailPanel.classList.remove('visible');
        return;
      }

      activeKey = key;
      const p = plugins[key];
      detailPanel.querySelector('h4').textContent = p.name;
      detailPanel.querySelector('.pd-desc').textContent = p.detail;
      detailPanel.querySelector('.pd-type').textContent = p.type;

      detailPanel.classList.remove('visible');
      void detailPanel.offsetWidth;
      detailPanel.classList.add('visible');
    });
  });

})();
