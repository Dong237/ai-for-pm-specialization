// QA Test: Module 4.2 Overview Page
const { chromium } = require('playwright');
const path = require('path');

const SCREENSHOT_DIR = '/Users/bytedance/Desktop/Personal/job_pms/ai_for_pm_specialization/qa-screenshots/m4.2';
const URL = 'http://127.0.0.1:5566/c4-m2-safety/index.html';

(async () => {
  const browser = await chromium.launch();
  const results = { screenshots: [], issues: [], jsErrors: [], score: {} };

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

    await page.goto(URL, { waitUntil: 'networkidle', timeout: 15000 });
    console.log('[OK] Page loaded:', URL);

    // Screenshot 1: start-light
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overview-start-light.png'), fullPage: false });
    results.screenshots.push('overview-start-light.png');
    console.log('[OK] Screenshot: overview-start-light');

    // Screenshot 2: start-dark (click theme toggle, scroll top)
    const themeBtn = await page.$('#theme-toggle, .theme-toggle, button[aria-label*="theme"], button[aria-label*="Theme"], .toggle-theme, [data-theme-toggle]');
    if (themeBtn) {
      await themeBtn.click();
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overview-start-dark.png'), fullPage: false });
      results.screenshots.push('overview-start-dark.png');
      console.log('[OK] Screenshot: overview-start-dark');
      // Toggle back to light
      await themeBtn.click();
      await page.waitForTimeout(300);
    } else {
      results.issues.push('No theme toggle button found');
      console.log('[WARN] No theme toggle button found');
    }

    // Structural checks for overview
    const title = await page.title();
    console.log('[INFO] Page title:', title);

    // Check for unit links
    const unitLinks = await page.$$eval('a[href]', links =>
      links.filter(l => l.href.includes('/u')).map(l => ({ text: l.textContent.trim().slice(0, 60), href: l.href }))
    );
    console.log('[INFO] Unit links found:', unitLinks.length);
    unitLinks.forEach(l => console.log('  -', l.text, '->', l.href));

    if (unitLinks.length < 8) {
      results.issues.push(`Only ${unitLinks.length} unit links found (expected 8)`);
    }

    // Check for headings
    const headings = await page.$$eval('h1, h2, h3', hs => hs.map(h => h.textContent.trim().slice(0, 80)));
    console.log('[INFO] Headings:', headings.length);
    headings.forEach(h => console.log('  -', h));

    // Full page screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'overview-full.png'), fullPage: true });
    results.screenshots.push('overview-full.png');
    console.log('[OK] Screenshot: overview-full');

    // Check cards / styling
    const cardCount = await page.$$eval('.card, .unit-card, .module-card, [class*="card"]', c => c.length);
    console.log('[INFO] Card elements:', cardCount);

    // JS Errors
    if (results.jsErrors.length > 0) {
      console.log('[WARN] JS Errors:', results.jsErrors);
    } else {
      console.log('[OK] No JS errors');
    }

    // Score overview (simplified rubric)
    let score = 0;
    score += title.length > 0 ? 10 : 0; // has title
    score += unitLinks.length >= 8 ? 20 : (unitLinks.length >= 4 ? 10 : 0); // links
    score += headings.length > 0 ? 10 : 0; // headings
    score += themeBtn ? 15 : 0; // theme toggle
    score += results.jsErrors.length === 0 ? 15 : 5; // no JS errors
    score += cardCount > 0 ? 15 : 0; // cards
    score += 15; // base points for loading

    console.log('\n=== OVERVIEW SCORE:', score, '/ 100 ===');
    console.log('Issues:', results.issues.length > 0 ? results.issues : 'None');

  } catch (err) {
    console.error('[FAIL]', err.message);
  } finally {
    await browser.close();
  }
})();
