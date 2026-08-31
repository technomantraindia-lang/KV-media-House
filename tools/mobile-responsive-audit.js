const { chromium } = require('playwright');

const baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4176';
const widths = [1440, 1366, 1200, 1024, 768, 600, 480, 430, 390, 375, 360, 320];
const routes = [
  '/',
  '/about.html',
  '/services.html',
  '/services/content-creation.html',
  '/services/social-media-management.html',
  '/services/digital-marketing.html',
  '/services/event-brand-media.html',
  '/services/content-creation/brand-reels-short-form-video.html',
  '/services/social-media-management/social-media-campaigns.html',
  '/services/digital-marketing/brand-business-strategy.html',
  '/services/event-brand-media/event-coverage.html',
  '/work.html',
  '/founder.html',
  '/contact.html',
  '/blog.html'
];

async function pageMetrics(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const vw = window.innerWidth;
    const all = Array.from(document.querySelectorAll('body *'));
    const offenders = [];

    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      if (rect.right > vw + 2 || rect.left < -2) {
        const selector = el.id
          ? `#${el.id}`
          : `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).slice(0, 3).join('.')}` : ''}`;
        offenders.push({
          selector,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width)
        });
      }
      if (offenders.length >= 8) break;
    }

    const mobileMenu = document.querySelector('#mobileMenu');
    const menuRect = mobileMenu ? mobileMenu.getBoundingClientRect() : null;

    return {
      viewport: vw,
      scrollWidth: Math.max(doc.scrollWidth, body ? body.scrollWidth : 0),
      clientWidth: doc.clientWidth,
      offenders,
      mobileMenu: menuRect
        ? {
            width: Math.round(menuRect.width),
            height: Math.round(menuRect.height),
            overflowY: getComputedStyle(mobileMenu).overflowY
          }
        : null
    };
  });
}

(async () => {
  const browser = await chromium.launch();
  const failures = [];

  for (const width of widths) {
    console.log(`Checking ${width}px`);
    const page = await browser.newPage({ viewport: { width, height: 820 }, deviceScaleFactor: 1 });
    await page.route('**/*', routeRequest => {
      const url = routeRequest.request().url();
      if (/fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|images\.unsplash/.test(url)) {
        routeRequest.abort();
        return;
      }
      routeRequest.continue();
    });

    for (const route of routes) {
      const consoleErrors = [];
      const onConsole = msg => {
        const text = msg.text();
        if (msg.type() === 'error' && !text.includes('net::ERR_FAILED')) consoleErrors.push(text);
      };
      const onPageError = err => consoleErrors.push(err.message);
      page.on('console', onConsole);
      page.on('pageerror', onPageError);

      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 6000 });
      await page.waitForTimeout(80);
      const metrics = await pageMetrics(page);

      if (!response || response.status() >= 400) {
        failures.push({ width, route, issue: `HTTP ${response ? response.status() : 'no response'}` });
      }
      const offenders = metrics.offenders.filter(item => item.selector !== 'a.skip-link');
      if (metrics.scrollWidth > metrics.clientWidth + 2 && offenders.length) {
        failures.push({ width, route, issue: `horizontal overflow ${metrics.scrollWidth}/${metrics.clientWidth}`, offenders });
      }
      if (consoleErrors.length) {
        failures.push({ width, route, issue: 'console errors', consoleErrors: consoleErrors.slice(0, 4) });
      }

      if (width <= 640) {
        await page.click('#burgerBtn');
        await page.waitForTimeout(180);
        const menu = await pageMetrics(page);
        if (!menu.mobileMenu || menu.mobileMenu.width > width + 2 || menu.mobileMenu.overflowY !== 'auto') {
          failures.push({ width, route, issue: 'mobile menu sizing/scrolling', mobileMenu: menu.mobileMenu });
        }
      }

      page.off('console', onConsole);
      page.off('pageerror', onPageError);
    }

    await page.close();
  }

  await browser.close();

  if (failures.length) {
    console.log(JSON.stringify(failures, null, 2));
    process.exit(1);
  }

  console.log(`Mobile responsive audit passed for ${routes.length} routes across ${widths.length} widths.`);
})();
