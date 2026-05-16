// QA Test: Module 4.2 Unit Page (parameterized)
// Usage: node test-m42-unit.js <unit-slug>
// e.g.: node test-m42-unit.js u1-prompt-injection

const { chromium } = require('playwright');
const path = require('path');

const UNIT = process.argv[2];
if (!UNIT) { console.error('Usage: node test-m42-unit.js <unit-slug>'); process.exit(1); }

const SCREENSHOT_DIR = '/Users/bytedance/Desktop/Personal/job_pms/ai_for_pm_specialization/qa-screenshots/m4.2';
const URL = `http://127.0.0.1:5566/c4-m2-safety/${UNIT}/index.html`;

(async () => {
  const browser = await chromium.launch();
  const results = {
    unit: UNIT,
    screenshots: [],
    issues: [],
    jsErrors: [],
    sections: {},
    score: 0,
    breakdown: {}
  };

  try {
    const context = await browser.newContext({
      viewport: { width: 820, height: 1180 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    // Collect JS errors
    page.on('pageerror', err => results.jsErrors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') results.jsErrors.push(msg.text());
    });

    await page.goto(URL, { waitUntil: 'networkidle', timeout: 20000 });
    console.log(`\n${'='.repeat(60)}`);
    console.log(`QA TEST: ${UNIT}`);
    console.log(`${'='.repeat(60)}`);
    console.log('[OK] Page loaded:', URL);

    // ── Screenshot 1: start-light ──
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${UNIT}-start-light.png`), fullPage: false });
    results.screenshots.push(`${UNIT}-start-light.png`);
    console.log('[OK] Screenshot: start-light');

    // ── Screenshot 2: widget (scroll to #s8) ──
    const s8 = await page.$('#s8');
    if (s8) {
      await s8.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${UNIT}-widget.png`), fullPage: false });
      results.screenshots.push(`${UNIT}-widget.png`);
      console.log('[OK] Screenshot: widget (#s8)');
    } else {
      results.issues.push('#s8 section not found');
      console.log('[WARN] #s8 not found - trying alternative selectors');
      // Try step-8 or similar
      const alt = await page.$('[id*="8"], .step:nth-child(9)');
      if (alt) {
        await alt.scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${UNIT}-widget.png`), fullPage: false });
        results.screenshots.push(`${UNIT}-widget.png`);
      }
    }

    // ── Screenshot 3: end ──
    const endSection = await page.$('#end');
    if (endSection) {
      await endSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${UNIT}-end.png`), fullPage: false });
      results.screenshots.push(`${UNIT}-end.png`);
      console.log('[OK] Screenshot: end');
    } else {
      results.issues.push('#end section not found');
      console.log('[WARN] #end section not found');
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${UNIT}-end.png`), fullPage: false });
      results.screenshots.push(`${UNIT}-end.png`);
    }

    // ── Screenshot 4: start-dark ──
    const themeBtn = await page.$('#theme-toggle, .theme-toggle, button[aria-label*="theme"], button[aria-label*="Theme"], .toggle-theme, [data-theme-toggle]');
    if (themeBtn) {
      await themeBtn.click();
      await page.waitForTimeout(600);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${UNIT}-start-dark.png`), fullPage: false });
      results.screenshots.push(`${UNIT}-start-dark.png`);
      console.log('[OK] Screenshot: start-dark');
      // Toggle back
      await themeBtn.click();
      await page.waitForTimeout(300);
    } else {
      results.issues.push('No theme toggle found');
      console.log('[WARN] No theme toggle button found');
    }

    // ── Structural Checks ──
    console.log('\n--- Structural Checks ---');

    // Check all 12 required sections: #start, #s1-#s10, #end
    const requiredSections = ['start', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 'end'];
    for (const id of requiredSections) {
      const el = await page.$(`#${id}`);
      results.sections[id] = !!el;
      if (!el) {
        results.issues.push(`Missing section: #${id}`);
      }
    }
    const presentSections = Object.values(results.sections).filter(Boolean).length;
    console.log(`[INFO] Sections: ${presentSections}/12 present`);
    const missingSections = Object.entries(results.sections).filter(([k, v]) => !v).map(([k]) => k);
    if (missingSections.length > 0) {
      console.log('[WARN] Missing:', missingSections.join(', '));
    }

    // Check step numbers
    const stepNums = await page.$$eval('.step-num, .step-number', els => els.map(e => e.textContent.trim()));
    console.log(`[INFO] Step numbers found: ${stepNums.length}`, stepNums.join(', '));

    // ── Check stick figure ──
    const hasStickFigure = await page.evaluate(() => {
      const html = document.body.innerHTML;
      return html.includes('stick') || html.includes('figure') || html.includes('svg') ||
             html.includes('🧑') || html.includes('你') || html.includes('stickman');
    });
    console.log(`[INFO] Stick figure / SVG / persona: ${hasStickFigure ? 'Found' : 'Not found'}`);

    // ── Check callouts ──
    const callouts = await page.$$eval('[class*="callout"]', els =>
      els.map(e => ({ class: e.className, text: e.textContent.trim().slice(0, 80) }))
    );
    console.log(`[INFO] Callouts: ${callouts.length}`);
    callouts.forEach(c => console.log(`  - [${c.class}] ${c.text}`));

    // ── Check homework / resources ──
    const hasHomework = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('作业') || text.includes('homework') || text.includes('任务') ||
             text.includes('课后') || text.includes('动手');
    });
    const hasResources = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('资源延伸') || text.includes('延伸') || text.includes('资源');
    });
    console.log(`[INFO] Homework section: ${hasHomework ? 'Found' : 'NOT FOUND'}`);
    console.log(`[INFO] Resources (资源延伸): ${hasResources ? 'Found' : 'NOT FOUND'}`);
    if (!hasHomework) results.issues.push('Missing homework section');
    if (!hasResources) results.issues.push('Missing 资源延伸 section');

    // ── Check Vitamin case study ──
    const hasVitamin = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Vitamin') || text.includes('vitamin');
    });
    console.log(`[INFO] Vitamin case study: ${hasVitamin ? 'Found' : 'NOT FOUND'}`);
    if (!hasVitamin) results.issues.push('Missing Vitamin case study reference');

    // ── Check next-unit teaser ──
    const hasNextTeaser = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('下一') || text.includes('预告') || text.includes('next') ||
             text.includes('接下来') || text.includes('下一单元');
    });
    console.log(`[INFO] Next-unit teaser: ${hasNextTeaser ? 'Found' : 'NOT FOUND'}`);
    if (!hasNextTeaser) results.issues.push('Missing next-unit teaser');

    // ── Check recap grid ──
    const hasRecap = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('回顾') || text.includes('总结') || text.includes('recap') ||
             text.includes('复习') || text.includes('小结');
    });
    console.log(`[INFO] Recap: ${hasRecap ? 'Found' : 'NOT FOUND'}`);

    // ── Check external links ──
    const extLinks = await page.$$eval('a[href^="http"]', links =>
      links.map(l => ({ text: l.textContent.trim().slice(0, 50), href: l.href }))
    );
    console.log(`[INFO] External links: ${extLinks.length}`);
    extLinks.slice(0, 10).forEach(l => console.log(`  - [${l.text}] ${l.href.slice(0, 80)}`));

    // ── Click Tests: find interactive widgets ──
    console.log('\n--- Click / Widget Tests ---');

    // Scroll back to #s8 for widget testing
    if (s8) await s8.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Try clicking buttons in the widget area
    const widgetButtons = await page.$$('#s8 button, #s8 .btn, #s8 [role="button"], #s8 .tab, #s8 input[type="range"]');
    console.log(`[INFO] Interactive elements in #s8: ${widgetButtons.length}`);

    // Try broader search for interactive elements
    const allButtons = await page.$$eval('button, .btn, [role="button"], input[type="range"], .tab, [class*="tab"]', els =>
      els.map(e => ({
        tag: e.tagName,
        text: e.textContent.trim().slice(0, 40),
        class: e.className,
        id: e.id
      }))
    );
    console.log(`[INFO] All interactive elements: ${allButtons.length}`);
    allButtons.slice(0, 15).forEach(b => console.log(`  - <${b.tag}> [${b.class}] "${b.text}" #${b.id}`));

    // Click first few non-theme buttons and screenshot
    let clickCount = 0;
    const clickableButtons = await page.$$('button:not(#theme-toggle):not(.theme-toggle), .tab, [role="tab"]');
    for (let i = 0; i < Math.min(3, clickableButtons.length); i++) {
      try {
        const btnText = await clickableButtons[i].textContent();
        await clickableButtons[i].scrollIntoViewIfNeeded();
        await clickableButtons[i].click();
        await page.waitForTimeout(500);
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${UNIT}-click-${i + 1}.png`),
          fullPage: false
        });
        results.screenshots.push(`${UNIT}-click-${i + 1}.png`);
        console.log(`[OK] Clicked button ${i + 1}: "${btnText.trim().slice(0, 40)}"`);
        clickCount++;
      } catch (e) {
        console.log(`[WARN] Click ${i + 1} failed: ${e.message.slice(0, 80)}`);
      }
    }

    // Try sliders
    const sliders = await page.$$('input[type="range"]');
    if (sliders.length > 0) {
      for (let i = 0; i < Math.min(2, sliders.length); i++) {
        try {
          await sliders[i].scrollIntoViewIfNeeded();
          await sliders[i].fill('75');
          await page.waitForTimeout(400);
          await page.screenshot({
            path: path.join(SCREENSHOT_DIR, `${UNIT}-slider-${i + 1}.png`),
            fullPage: false
          });
          results.screenshots.push(`${UNIT}-slider-${i + 1}.png`);
          console.log(`[OK] Slider ${i + 1} adjusted`);
        } catch (e) {
          console.log(`[WARN] Slider ${i + 1} failed: ${e.message.slice(0, 80)}`);
        }
      }
    }

    // ── Scoring ──
    console.log('\n--- Scoring ---');
    let score = 0;
    const breakdown = {};

    // Layout (10): page loads, proper structure
    const layoutScore = presentSections >= 10 ? 10 : presentSections >= 6 ? 7 : 4;
    breakdown.layout = layoutScore;
    score += layoutScore;

    // Typography (10): headings, step numbers, proper fonts
    const headingCount = await page.$$eval('h1, h2, h3, h4', h => h.length);
    const typScore = headingCount >= 10 ? 10 : headingCount >= 5 ? 7 : 4;
    breakdown.typography = typScore;
    score += typScore;

    // Color (10): callouts, pills, marks
    const colorElements = await page.$$eval('[class*="callout"], [class*="pill"], mark, .hl', e => e.length);
    const colorScore = colorElements >= 3 ? 10 : colorElements >= 1 ? 7 : 3;
    breakdown.color = colorScore;
    score += colorScore;

    // Dark mode (10)
    const darkScore = themeBtn ? 10 : 0;
    breakdown.dark = darkScore;
    score += darkScore;

    // Widget (15): interactive elements
    const widgetScore = clickCount >= 2 ? 15 : clickCount >= 1 ? 10 : (allButtons.length > 2 ? 8 : 3);
    breakdown.widget = widgetScore;
    score += widgetScore;

    // Cards (5): callout cards
    const cardScore = callouts.length >= 2 ? 5 : callouts.length >= 1 ? 3 : 1;
    breakdown.cards = cardScore;
    score += cardScore;

    // Stick figure (5)
    const stickScore = hasStickFigure ? 5 : 0;
    breakdown.stickFigure = stickScore;
    score += stickScore;

    // Recap (5)
    const recapScore = hasRecap ? 5 : 0;
    breakdown.recap = recapScore;
    score += recapScore;

    // Next card (10)
    const nextScore = hasNextTeaser ? 10 : 0;
    breakdown.nextCard = nextScore;
    score += nextScore;

    // Sections (5)
    const sectScore = presentSections === 12 ? 5 : presentSections >= 10 ? 4 : 2;
    breakdown.sections = sectScore;
    score += sectScore;

    // Links (5)
    const linkScore = extLinks.length >= 3 ? 5 : extLinks.length >= 1 ? 3 : 0;
    breakdown.links = linkScore;
    score += linkScore;

    // Homework (5)
    const hwScore = (hasHomework ? 3 : 0) + (hasResources ? 2 : 0);
    breakdown.homework = hwScore;
    score += hwScore;

    results.score = score;
    results.breakdown = breakdown;

    console.log('Breakdown:', JSON.stringify(breakdown, null, 2));
    console.log(`\n${'='.repeat(40)}`);
    console.log(`  ${UNIT} SCORE: ${score} / 100`);
    console.log(`${'='.repeat(40)}`);

    // ── Summary ──
    console.log('\nScreenshots:', results.screenshots.length);
    console.log('JS Errors:', results.jsErrors.length > 0 ? results.jsErrors : 'None');
    console.log('Issues:', results.issues.length > 0 ? results.issues : 'None');

  } catch (err) {
    console.error(`[FAIL] ${UNIT}:`, err.message);
  } finally {
    await browser.close();
  }
})();
