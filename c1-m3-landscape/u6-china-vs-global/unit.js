/* =============================================
   Unit 6 · 国产 vs 国际模型决策树
   Decision Path Chooser Widget
   ============================================= */

(() => {
  'use strict';

  const pathData = {
    china: {
      title: '路径 A · 国内产品',
      cssClass: 'result-china',
      html: `
        <h3 class="result-title">🇨🇳 国内产品 — 合规优先, 国产模型为主</h3>
        <div class="result-section">
          <h4>推荐模型:</h4>
          <div class="result-models">
            <span class="pill pill-green">DeepSeek V4 Flash (主力)</span>
            <span class="pill pill-green">Qwen3.6-Max (高质量场景)</span>
            <span class="pill pill-green">Doubao-Seed-2.0 (字节生态)</span>
            <span class="pill pill-green">Kimi K2.6 (长文本/推理)</span>
          </div>
        </div>
        <div class="result-section">
          <h4>为什么选国产:</h4>
          <ul>
            <li><strong>合规无忧</strong> — 已完成大模型备案, 数据在国内, 内容审核符合标准</li>
            <li><strong>中文优势</strong> — 方言/网络用语/文化背景理解更好</li>
            <li><strong>成本更低</strong> — RMB 计价, 比同级国际模型便宜 30-50%</li>
            <li><strong>延迟更低</strong> — 服务器在国内, 响应速度更快</li>
          </ul>
        </div>
        <div class="result-compliance">
          <h4>合规 Checklist:</h4>
          <ul>
            <li>✅ 使用已备案模型 API → 不需要自己单独备案</li>
            <li>✅ 数据存储在国内云服务器 (阿里云/腾讯云/华为云)</li>
            <li>✅ 模型内置内容审核过滤</li>
            <li>⚠️ 如涉及健康/医疗数据, 需单独的隐私授权 + 免责声明</li>
            <li>⚠️ 关键词库建议 ≥ 10,000 词 (覆盖 17+ 类风险)</li>
          </ul>
        </div>
      `
    },
    global: {
      title: '路径 B · 出海产品',
      cssClass: 'result-global',
      html: `
        <h3 class="result-title">🌏 出海产品 — 全球可用, 多语言优先</h3>
        <div class="result-section">
          <h4>推荐模型:</h4>
          <div class="result-models">
            <span class="pill pill-blue">GPT-5 / GPT-5 Mini (通用)</span>
            <span class="pill pill-blue">Claude Sonnet 4.6 (写作/分析)</span>
            <span class="pill pill-blue">Gemini 2.5 Flash (低成本 + 多模态)</span>
            <span class="pill pill-blue">Llama 4 Maverick (自部署)</span>
          </div>
        </div>
        <div class="result-section">
          <h4>为什么选国际模型:</h4>
          <ul>
            <li><strong>全球 API</strong> — 数据中心遍布全球, 低延迟</li>
            <li><strong>多语言强</strong> — 英语/日语/韩语/印尼语等覆盖广</li>
            <li><strong>生态成熟</strong> — SDK/文档/社区支持更完善</li>
            <li><strong>无国内合规限制</strong> — 选择自由度更大</li>
          </ul>
        </div>
        <div class="result-compliance">
          <h4>海外合规注意:</h4>
          <ul>
            <li>⚠️ 欧洲市场需符合 GDPR (数据保护), 需数据处理协议 (DPA)</li>
            <li>⚠️ 美国各州有不同隐私法 (如 CCPA)</li>
            <li>⚠️ 健康数据在某些国家有额外监管 (如 HIPAA)</li>
            <li>✅ 选择有 SOC 2 / ISO 27001 认证的 API 提供商</li>
            <li>💡 Llama 4 开源可自部署, 数据完全自控</li>
          </ul>
        </div>
      `
    },
    hybrid: {
      title: '路径 C · 两者兼顾',
      cssClass: 'result-hybrid',
      html: `
        <h3 class="result-title">🔄 两者兼顾 — Hybrid 架构, 分区域路由</h3>
        <div class="result-section">
          <h4>推荐方案:</h4>
          <div class="result-models">
            <span class="pill pill-green">中国区: DeepSeek / Qwen</span>
            <span class="pill pill-blue">海外区: GPT / Claude / Gemini</span>
            <span class="pill pill-amber">路由层: LiteLLM / 自建</span>
          </div>
        </div>
        <div class="result-section">
          <h4>架构设计:</h4>
          <ul>
            <li><strong>统一 API 抽象层</strong> — 产品代码只调一个接口, 路由层根据用户 region 分发</li>
            <li><strong>中国区</strong> → 调 DeepSeek/Qwen API (数据存国内, 合规无忧)</li>
            <li><strong>海外区</strong> → 调 GPT/Claude API (全球 CDN, 低延迟)</li>
            <li><strong>Prompt 统一管理</strong> — 同一套 System Prompt, 不同模型微调</li>
          </ul>
        </div>
        <div class="result-section">
          <h4>实现工具:</h4>
          <ul>
            <li><strong>LiteLLM</strong> — 开源, 支持 100+ 模型的统一接口, 几行代码切换</li>
            <li><strong>OpenRouter</strong> — 一个 API Key 访问所有模型</li>
            <li><strong>自建路由</strong> — 如果业务逻辑复杂, 自己写路由层</li>
          </ul>
        </div>
        <div class="result-compliance">
          <h4>双区合规:</h4>
          <ul>
            <li>✅ 中国区数据: 存国内, 用已备案模型</li>
            <li>✅ 海外数据: 存海外, 符合当地法规</li>
            <li>⚠️ 两套隐私政策 (中文版 + 英文版)</li>
            <li>⚠️ 两套内容审核标准 (国内严格, 海外宽松)</li>
            <li>💡 建议: MVP 先做一个市场, 验证成功后再加第二个</li>
          </ul>
        </div>
      `
    }
  };

  const optBtns = document.querySelectorAll('.path-option');
  const resultEl = document.getElementById('path-result');

  if (!resultEl || optBtns.length === 0) return;

  optBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const path = btn.dataset.path;
      const data = pathData[path];
      if (!data) return;

      // Update active state
      optBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update result
      resultEl.className = 'path-result ' + data.cssClass;
      resultEl.innerHTML = data.html;

      // Animate in
      resultEl.style.opacity = '0';
      resultEl.style.transform = 'translateY(10px)';
      requestAnimationFrame(() => {
        resultEl.style.transition = 'opacity 0.4s, transform 0.4s';
        resultEl.style.opacity = '1';
        resultEl.style.transform = 'translateY(0)';
      });
    });
  });

})();
