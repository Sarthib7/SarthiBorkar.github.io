import { test, expect } from '@playwright/test';

async function openApp(page) {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/\bjs\b/);
}

test('portfolio renders projects without browser errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await openApp(page);
  await expect(page).toHaveTitle('Sarthi Borkar | AI & Product Engineer');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('agents & people.');
  await expect(page.locator('.service-card')).toHaveCount(4);
  await expect(page.locator('.work-card h3')).toHaveText(['FalconOS', 'Fundwise', 'Citadel', 'Noesora', 'Exbridge', 'LastLight', 'Agentsmith', 'Kairen DealRail', 'IntentVault']);
  await expect(page.locator('.work-track')).toHaveCSS('display', 'flex');
  await expect(page.locator('.timeline-entry')).toHaveCount(10);
  await expect(page.locator('.hero-actions .button')).toHaveAttribute('href', 'https://cal.com/sarthi');
  await expect(page.locator('.figure-art svg')).toHaveAttribute('role', 'img');
  await page.locator('.skip-link').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  expect(errors).toEqual([]);
});

test('minimal page keeps services and contact usable without the removed copy', async ({ page }) => {
  await openApp(page);
  await expect(page.locator('.hero-kicker, .hero-project-note, #services .section-heading p, #work .section-heading p, #contact .section-label')).toHaveCount(0);
  await expect(page.locator('#services h2')).toHaveText('What I build.');
  await expect(page.locator('.service-card h3')).toHaveText(['AI automation', 'Private AI', 'Agent payments', 'Technical consulting']);
  await expect(page.locator('.service-card ul')).toHaveCount(0);
  for (const link of await page.locator('.service-card > a').all()) await expect(link).toHaveAttribute('href', 'https://cal.com/sarthi');
  await expect(page.locator('.contact-copy > p')).toContainText('engineering role');
  await expect(page.locator('.brand-word')).toHaveText(['Sarthiii', 'Sarthiii']);
  await expect(page.locator('.figure-topline, .figure-caption')).toHaveCount(0);
  await expect(page.locator('.workflow-figure')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('.figure-art')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('workflow automatically moves through all three stages without controls', async ({ page }) => {
  await page.clock.install();
  await openApp(page);
  const figure = page.locator('.workflow-figure');
  const carriage = figure.locator('[data-carriage]');
  await expect(figure.locator('button')).toHaveCount(0);
  await expect(figure.locator('.figure-scan')).toHaveCount(0);
  await expect(figure).toHaveAttribute('data-stage', '0');
  const initial = await carriage.evaluate(node => getComputedStyle(node).transform);
  await page.clock.runFor(2400);
  await expect(figure.locator('.figure-readout')).toHaveText('02 / Process');
  await page.clock.runFor(700);
  await expect.poll(() => carriage.evaluate(node => getComputedStyle(node).transform)).not.toBe(initial);
  await page.clock.runFor(1700);
  await expect(figure.locator('.figure-readout')).toHaveText('03 / Deliver');
  await page.clock.runFor(2400);
  await expect(figure.locator('.figure-readout')).toHaveText('01 / Collect');
});

test('automatic diagram follows the cursor and respects reduced motion', async ({ page }) => {
  await openApp(page);
  const machine = page.locator('.figure-machine');
  const art = page.locator('.figure-art');
  const initialTilt = await machine.evaluate(node => getComputedStyle(node).transform);
  const bounds = await art.boundingBox();
  await page.mouse.move(bounds.x + bounds.width * .8, bounds.y + bounds.height * .3);
  await expect.poll(() => machine.evaluate(node => getComputedStyle(node).transform)).not.toBe(initialTilt);
  expect(await art.evaluate(node => parseFloat(node.style.getPropertyValue('--pointer-x')))).toBeCloseTo(80, 2);
  await page.mouse.move(0, 0);
  await expect.poll(() => art.evaluate(node => node.style.getPropertyValue('--pointer-x'))).toBe('');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(machine).toHaveCSS('transform', 'none');
});

test('mobile navigation closes on Escape, outside click, focus exit and selection', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  const toggle = page.locator('#menu-toggle');
  const menu = page.locator('#nav-links');
  await expect(menu).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('.hero-copy').click();
  await expect(menu).toBeHidden();
  await toggle.click();
  await page.locator('.hero-actions a[href="#work"]').focus();
  await expect(menu).toBeHidden();
  await toggle.click();
  await menu.getByRole('link', { name: 'Services', exact: true }).click();
  await expect(menu).toBeHidden();
  await expect(page.locator('#services')).toBeFocused();
  await expect(page).toHaveURL(/#services$/);
});

test('all project links stay visible and the figure fits narrow screens', async ({ page }) => {
  await openApp(page);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('.work-card')).toHaveCount(9);
    for (const link of await page.locator('.work-card a').all()) {
      await link.focus();
      await expect(link).toBeInViewport();
    }
    expect(await page.locator('.figure-art svg').evaluate(svg => {
      const art = svg.getBoundingClientRect();
      return art.left >= 0 && art.right <= innerWidth;
    })).toBe(true);
  }
});

test('links have labels, fragment targets exist and project URLs are preserved', async ({ page }) => {
  await openApp(page);
  expect(await page.locator('a, use').evaluateAll(elements => elements.flatMap(element => {
    const href = element.getAttribute('href');
    if (!href || href === '#') return ['Empty link'];
    if (href.startsWith('#') && !document.getElementById(href.slice(1))) return ['Missing target: ' + href];
    if (element.tagName.toLowerCase() === 'a' && !element.textContent.trim() && !element.getAttribute('aria-label')) return ['Missing label: ' + href];
    return [];
  }))).toEqual([]);
  for (const link of await page.locator('.work-card a').all()) await expect(link).toHaveAttribute('href', /^(https:\/\/|#contact)/);
});

test('reduced motion stops automatic stages and resumes when enabled', async ({ page }) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);
  await expect(page.locator('[data-carriage]')).toHaveCSS('transition-duration', '0s');
  await page.clock.runFor(7200);
  await expect(page.locator('.workflow-figure')).toHaveAttribute('data-stage', '0');
  await expect(page.locator('.work-track')).toHaveCSS('display', 'grid');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.runFor(2400);
  await expect(page.locator('.figure-readout')).toHaveText('02 / Process');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  test('content, navigation, illustration and experience remain usable', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#nav-links')).toBeVisible();
    await expect(page.locator('#menu-toggle')).toBeHidden();
    await expect(page.locator('.figure-art svg')).toBeVisible();
    await expect(page.locator('.figure-controls')).toHaveCount(0);
    await expect(page.locator('.work-card')).toHaveCount(9);
    await expect(page.locator('#work-track')).toHaveCSS('display', 'grid');
    await expect(page.locator('#work-controls')).toBeHidden();
    for (const link of await page.locator('.work-card a').all()) {
      await link.focus();
      await expect(link).toBeInViewport();
    }
    await page.locator('.experience-archive summary').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.experience-archive .timeline')).toBeVisible();
    await expect(page.locator('.experience-archive .timeline-entry')).toHaveCount(8);
  });
});

const galleryPosition = page => page.locator('#work-progress').getAttribute('aria-valuenow').then(Number);

test('desktop scroll carousel follows scroll, buttons, keys and link focus', async ({ page }) => {
  await openApp(page);
  const track = page.locator('#work-track');
  await expect(page.locator('#work')).toHaveClass(/is-pinned/);
  await page.locator('.hero-actions a[href="#work"]').click();
  await expect.poll(() => galleryPosition(page)).toBe(0);
  await page.locator('#work-next').click();
  await expect.poll(() => galleryPosition(page)).toBeGreaterThan(0);
  await page.locator('#work-prev').click();
  await expect.poll(() => galleryPosition(page)).toBe(0);
  await page.mouse.wheel(0, 160);
  await expect.poll(() => galleryPosition(page)).toBeGreaterThan(0);
  await track.focus();
  await track.press('End');
  await expect.poll(() => galleryPosition(page)).toBe(100);
  await expect(page.locator('#work-next')).toHaveAttribute('aria-disabled', 'true');
  await track.press('Home');
  await expect.poll(() => galleryPosition(page)).toBe(0);
  await track.press('ArrowRight');
  await expect.poll(() => galleryPosition(page)).toBeGreaterThan(0);
  await track.press('Home');
  await page.locator('.work-card a').last().focus();
  await expect.poll(() => page.locator('.work-card').last().evaluate(card => {
    const rect = card.getBoundingClientRect();
    const viewport = document.querySelector('.work-viewport').getBoundingClientRect();
    return rect.left >= viewport.left - 2 && rect.right <= viewport.right + 2;
  })).toBe(true);
});

test('mobile carousel uses native swipe and stops controls at both ends', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  await expect(page.locator('#work')).not.toHaveClass(/is-pinned/);
  await expect(page.locator('#work-track')).toHaveCSS('overflow-x', 'auto');
  await expect(page.locator('#work-prev')).toHaveAttribute('aria-disabled', 'true');
  await page.locator('#work-next').click();
  await expect.poll(() => galleryPosition(page)).toBeGreaterThan(0);
  await page.locator('#work-track').evaluate(track => { track.scrollLeft = track.scrollWidth; });
  await expect.poll(() => galleryPosition(page)).toBe(100);
  await expect(page.locator('#work-next')).toHaveAttribute('aria-disabled', 'true');
  await page.locator('#work-track').focus();
  await page.keyboard.press('Home');
  await expect.poll(() => galleryPosition(page)).toBe(0);
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => galleryPosition(page)).toBeGreaterThan(0);
  await page.keyboard.press('End');
  await expect.poll(() => galleryPosition(page)).toBe(100);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('short screens and live reduced-motion changes keep every project reachable', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await openApp(page);
  await expect(page.locator('#work')).not.toHaveClass(/is-pinned/);
  await page.locator('#work-next').click();
  await expect.poll(() => galleryPosition(page)).toBeGreaterThan(0);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('#work')).toHaveClass(/is-pinned/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#work')).not.toHaveClass(/is-pinned/);
  await expect(page.locator('#work-track')).toHaveCSS('display', 'grid');
  await expect(page.locator('#work-controls')).toBeHidden();
  await expect(page.locator('#work-track')).toHaveCSS('transform', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('#work')).toHaveClass(/is-pinned/);
});

test('each featured project has loaded local artwork', async ({ page }) => {
  await openApp(page);
  const images = page.locator('.work-art img');
  await expect(images).toHaveCount(9);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
  }
});

test('FalconOS, Fundwise, and LastLight use moving Anatomy mechanisms with a static reduced-motion view', async ({ page }) => {
  await openApp(page);
  await expect(page.locator('#hero-title')).toHaveText('Building foragents & people.');
  const covers = page.locator('.work-card .project-visual');
  await expect(covers.nth(0)).toHaveAttribute('src', './assets/projects/falconos.svg');
  await expect(covers.nth(1)).toHaveAttribute('src', './assets/projects/fundwise.svg');
  await expect(covers.nth(5)).toHaveAttribute('src', './assets/projects/lastlight.svg');
  for (const [file, selector] of [['falconos', '.evidence-gate'], ['fundwise', '.payout-drawer'], ['lastlight', '.player-piece']]) {
    await page.goto(`/assets/projects/${file}.svg`);
    const mechanism = page.locator(selector);
    const initial = await mechanism.evaluate(node => getComputedStyle(node).transform);
    await expect.poll(() => mechanism.evaluate(node => getComputedStyle(node).transform), { timeout: 8000 }).not.toBe(initial);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(mechanism).toHaveCSS('animation-name', 'none');
    await expect(mechanism).toHaveCSS('transform', 'none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
});

test('keeps all nine projects in Selected work and uses the Sarthiii brand', async ({ page }) => {
  await openApp(page);
  await expect(page.locator('.work-card h3')).toHaveText(['FalconOS', 'Fundwise', 'Citadel', 'Noesora', 'Exbridge', 'LastLight', 'Agentsmith', 'Kairen DealRail', 'IntentVault']);
  await expect(page.locator('.project-index')).toHaveCount(0);
  await expect(page.locator('#work .work-card')).toHaveCount(9);
  await expect(page.locator('.gallery-readout')).toHaveText('01 / 09');
  await expect(page.locator('.site-header .brand-word')).toHaveText('Sarthiii');
  await expect(page.locator('.site-header .brand-mark svg use')).toHaveAttribute('href', '#brand-s');
  await expect(page.locator('.site-header .brand')).toHaveAttribute('href', '#main');
});

test('carousel remeasures when upstream content changes height', async ({ page }) => {
  await openApp(page);
  await expect(page.locator('#work')).toHaveClass(/is-pinned/);
  await page.locator('.hero').evaluate(hero => { hero.style.paddingTop = '300px'; });
  const track = page.locator('#work-track');
  await track.evaluate(element => element.focus({ preventScroll: true }));
  await track.press('Home');
  await expect.poll(() => page.locator('#work').evaluate(work => Math.abs(
    work.getBoundingClientRect().top - document.querySelector('.site-header').offsetHeight
  ))).toBeLessThanOrEqual(2);
  await expect.poll(() => galleryPosition(page)).toBe(0);
});
