const { chromium } = require('playwright');
const path = require('path');
const BASE = 'http://127.0.0.1:5566/c4-m2-safety';
const DIR = '/Users/bytedance/Desktop/Personal/job_pms/ai_for_pm_specialization/qa-screenshots/m4.2';
const UNITS = ['u1-prompt-injection','u2-jailbreak','u3-input-filtering','u4-output-moderation','u5-privacy-compliance','u6-nmpa','u7-liability','u8-vitamin-safety'];

async function checkOverview(browser) {
  const ctx = await browser.newContext({ viewport:{width:820,height:1180}, deviceScaleFactor:2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(`${BASE}/index.html`, {waitUntil:'networkidle',timeout:15000});
  console.log('\n' + '='.repeat(60));
  console.log('OVERVIEW PAGE');
  console.log('='.repeat(60));
  console.log('[OK] Loaded');
  await page.screenshot({path:path.join(DIR,'overview-start-light.png'),fullPage:false});
  console.log('[OK] Screenshot: overview-start-light');
  const tb = await page.$('#theme-toggle, .theme-toggle, button[aria-label*="theme"], button[aria-label*="Theme"]');
  if(tb){await tb.click();await page.waitForTimeout(500);await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(DIR,'overview-start-dark.png'),fullPage:false});console.log('[OK] Screenshot: overview-start-dark');await tb.click();await page.waitForTimeout(300);}
  else console.log('[WARN] No theme toggle');
  const links = await page.$$eval('a[href]', ls=>ls.filter(l=>l.href.includes('/u')).map(l=>({t:l.textContent.trim().slice(0,60),h:l.href})));
  console.log(`[INFO] Unit links: ${links.length}`);
  links.forEach(l=>console.log(`  - ${l.t} -> ${l.h.slice(-40)}`));
  const heads = await page.$$eval('h1,h2,h3', hs=>hs.map(h=>h.textContent.trim().slice(0,80)));
  console.log(`[INFO] Headings: ${heads.length}`);
  const cards = await page.$$eval('[class*="card"]', c=>c.length);
  console.log(`[INFO] Cards: ${cards}`);
  let s = 0;
  s += heads.length > 0 ? 10 : 0;
  s += links.length >= 8 ? 20 : links.length >= 4 ? 10 : 0;
  s += tb ? 15 : 0;
  s += errs.length === 0 ? 15 : 5;
  s += cards > 0 ? 15 : 0;
  s += 15 + 10;
  console.log(`[INFO] JS Errors: ${errs.length > 0 ? errs.join('; ') : 'None'}`);
  console.log(`\n  OVERVIEW SCORE: ${s} / 100`);
  await ctx.close();
  return s;
}

async function checkUnit(browser, unit) {
  const ctx = await browser.newContext({viewport:{width:820,height:1180},deviceScaleFactor:2});
  const page = await ctx.newPage();
  const errs = [];
  const issues = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if(m.type()==='error') errs.push(m.text()); });

  await page.goto(`${BASE}/${unit}/index.html`, {waitUntil:'networkidle',timeout:20000});
  console.log('\n' + '='.repeat(60));
  console.log(`UNIT: ${unit}`);
  console.log('='.repeat(60));
  console.log('[OK] Loaded');

  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(500);
  await page.screenshot({path:path.join(DIR,`${unit}-start-light.png`),fullPage:false});
  console.log('[OK] Screenshot: start-light');

  const s8 = await page.$('#s8');
  if(s8){await s8.scrollIntoViewIfNeeded();await page.waitForTimeout(800);await page.screenshot({path:path.join(DIR,`${unit}-widget.png`),fullPage:false});console.log('[OK] Screenshot: widget');}
  else{issues.push('Missing #s8');console.log('[WARN] #s8 not found');}

  const end = await page.$('#end');
  if(end){await end.scrollIntoViewIfNeeded();await page.waitForTimeout(800);await page.screenshot({path:path.join(DIR,`${unit}-end.png`),fullPage:false});console.log('[OK] Screenshot: end');}
  else{issues.push('Missing #end');await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await page.waitForTimeout(800);await page.screenshot({path:path.join(DIR,`${unit}-end.png`),fullPage:false});console.log('[WARN] #end not found, scrolled to bottom');}

  const tb = await page.$('#theme-toggle, .theme-toggle, button[aria-label*="theme"], button[aria-label*="Theme"]');
  if(tb){await tb.click();await page.waitForTimeout(600);await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(400);await page.screenshot({path:path.join(DIR,`${unit}-start-dark.png`),fullPage:false});console.log('[OK] Screenshot: start-dark');await tb.click();await page.waitForTimeout(300);}
  else{issues.push('No theme toggle');console.log('[WARN] No theme toggle');}

  const secs = ['start','s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','end'];
  let present = 0;
  const missing = [];
  for(const id of secs){const el = await page.$(`#${id}`);if(el)present++;else missing.push(id);}
  console.log(`[INFO] Sections: ${present}/12`);
  if(missing.length>0){console.log(`[WARN] Missing: ${missing.join(', ')}`);issues.push(`Missing sections: ${missing.join(', ')}`);}

  const stepNums = await page.$$eval('.step-num, .step-number', es=>es.map(e=>e.textContent.trim()));
  console.log(`[INFO] Step numbers: ${stepNums.length} (${stepNums.join(',')})`);

  const callouts = await page.$$eval('[class*="callout"]', es=>es.map(e=>({c:e.className,t:e.textContent.trim().slice(0,60)})));
  console.log(`[INFO] Callouts: ${callouts.length}`);

  const checks = await page.evaluate(()=>{
    const t = document.body.innerText;
    return {
      homework: t.includes('作业')||t.includes('任务')||t.includes('动手')||t.includes('课后'),
      resources: t.includes('资源延伸')||t.includes('资源'),
      vitamin: t.toLowerCase().includes('vitamin'),
      nextTeaser: t.includes('下一')||t.includes('预告')||t.includes('接下来'),
      recap: t.includes('回顾')||t.includes('总结')||t.includes('recap')||t.includes('小结'),
      stickFigure: document.body.innerHTML.includes('stick')||document.body.innerHTML.includes('svg')||t.includes('你')
    };
  });
  console.log(`[INFO] Homework: ${checks.homework} | Resources: ${checks.resources} | Vitamin: ${checks.vitamin} | Next: ${checks.nextTeaser} | Recap: ${checks.recap} | Stick: ${checks.stickFigure}`);
  if(!checks.homework)issues.push('Missing homework');
  if(!checks.resources)issues.push('Missing resources');
  if(!checks.vitamin)issues.push('Missing Vitamin reference');
  if(!checks.nextTeaser)issues.push('Missing next-unit teaser');

  const extLinks = await page.$$eval('a[href^="http"]', ls=>ls.map(l=>({t:l.textContent.trim().slice(0,40),h:l.href})));
  console.log(`[INFO] External links: ${extLinks.length}`);
  extLinks.slice(0,5).forEach(l=>console.log(`  - ${l.t} -> ${l.h.slice(0,70)}`));

  console.log('\n--- Click Tests ---');
  const allBtns = await page.$$eval('button, .btn, [role="button"], input[type="range"], [role="tab"], .tab-btn', es=>es.map(e=>({tag:e.tagName,text:e.textContent.trim().slice(0,30),cls:e.className,id:e.id})));
  console.log(`[INFO] Interactive elements: ${allBtns.length}`);
  allBtns.slice(0,10).forEach(b=>console.log(`  - <${b.tag}> "${b.text}" .${b.cls} #${b.id}`));

  let clickCount = 0;
  const clickable = await page.$$('button:not(#theme-toggle):not(.theme-toggle), [role="tab"], .tab-btn');
  for(let i=0;i<Math.min(3,clickable.length);i++){
    try{
      const t = await clickable[i].textContent();
      await clickable[i].scrollIntoViewIfNeeded();
      await clickable[i].click();
      await page.waitForTimeout(500);
      await page.screenshot({path:path.join(DIR,`${unit}-click-${i+1}.png`),fullPage:false});
      console.log(`[OK] Click ${i+1}: "${t.trim().slice(0,30)}"`);
      clickCount++;
    }catch(e){console.log(`[WARN] Click ${i+1} failed: ${e.message.slice(0,60)}`);}
  }

  const sliders = await page.$$('input[type="range"]');
  for(let i=0;i<Math.min(2,sliders.length);i++){
    try{await sliders[i].scrollIntoViewIfNeeded();await sliders[i].fill('75');await page.waitForTimeout(400);await page.screenshot({path:path.join(DIR,`${unit}-slider-${i+1}.png`),fullPage:false});console.log(`[OK] Slider ${i+1} adjusted`);clickCount++;}
    catch(e){console.log(`[WARN] Slider ${i+1}: ${e.message.slice(0,60)}`);}
  }

  const headCount = await page.$$eval('h1,h2,h3,h4', h=>h.length);
  const colorEls = await page.$$eval('[class*="callout"],[class*="pill"],mark,.hl', e=>e.length);

  const b = {};
  b.layout = present>=10?10:present>=6?7:4;
  b.typography = headCount>=10?10:headCount>=5?7:4;
  b.color = colorEls>=3?10:colorEls>=1?7:3;
  b.dark = tb?10:0;
  b.widget = clickCount>=2?15:clickCount>=1?10:allBtns.length>2?8:3;
  b.cards = callouts.length>=2?5:callouts.length>=1?3:1;
  b.stickFigure = checks.stickFigure?5:0;
  b.recap = checks.recap?5:0;
  b.nextCard = checks.nextTeaser?10:0;
  b.sections = present===12?5:present>=10?4:2;
  b.links = extLinks.length>=3?5:extLinks.length>=1?3:0;
  b.homework = (checks.homework?3:0)+(checks.resources?2:0);
  const score = Object.values(b).reduce((a,c)=>a+c,0);

  console.log('\n--- Score Breakdown ---');
  Object.entries(b).forEach(([k,v])=>console.log(`  ${k}: ${v}`));
  console.log(`\n  ${unit} SCORE: ${score} / 100`);
  console.log(`  JS Errors: ${errs.length>0?errs.join('; '):'None'}`);
  console.log(`  Issues: ${issues.length>0?issues.join('; '):'None'}`);

  await ctx.close();
  return {unit, score, breakdown:b, issues, jsErrors:errs};
}

(async()=>{
  const browser = await chromium.launch();
  const allResults = [];

  const overviewScore = await checkOverview(browser);
  allResults.push({unit:'overview', score:overviewScore});

  for(const u of UNITS){
    const r = await checkUnit(browser, u);
    allResults.push(r);
  }

  await browser.close();

  console.log('\n' + '='.repeat(60));
  console.log('MODULE 4.2 SUMMARY');
  console.log('='.repeat(60));
  allResults.forEach(r=>{
    const tag = r.score>=90?'EXCELLENT':r.score>=75?'GOOD':r.score>=60?'OK':'NEEDS WORK';
    console.log(`  ${(r.unit||'').padEnd(25)} ${String(r.score).padStart(3)} / 100  [${tag}]`);
  });
  const avg = allResults.reduce((a,r)=>a+r.score,0)/allResults.length;
  console.log(`\n  MODULE AVERAGE: ${avg.toFixed(1)} / 100`);
  console.log('='.repeat(60));
})();
