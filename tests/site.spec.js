import { test, expect } from '@playwright/test';

async function openApp(page) {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/\bjs\b/);
  await expect(page.locator('.bot')).toHaveClass(/\bis-framed\b/);
}

const position = page => page.locator('#work-progress').getAttribute('aria-valuenow').then(Number);

test('renders the source content and local image without hydration errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await openApp(page);
  await expect(page).toHaveTitle('Sarthi Borkar | AI Solutions for Business');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('BUSINESS.');
  await expect(page.locator('.service-card')).toHaveCount(4);
  await expect(page.locator('.work-card h3')).toHaveText(['Citadel', 'Kairen DealRail', 'IntentVault', 'Agentsmith']);
  await expect(page.locator('.timeline-entry')).toHaveCount(10);
  await expect(page.locator('.hero-actions .button')).toHaveAttribute('href', 'https://cal.com/sarthi');
  await expect.poll(() => page.locator('.scene-backdrop').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('desktop gallery follows page scroll, controls, keys, and link focus', async ({ page }) => {
  await openApp(page);
  const track = page.locator('#work-track');
  await expect(page.locator('#work')).toHaveClass(/\bis-pinned\b/);
  await page.locator('.hero-actions a[href="#work"]').click();
  await expect.poll(() => position(page)).toBe(0);
  await page.locator('#work-next').click();
  await expect.poll(() => position(page)).toBeGreaterThan(0);
  await expect(page.locator('#work-announcement')).toHaveText('Showing more projects.');
  await page.locator('#work-prev').click();
  await expect.poll(() => position(page)).toBe(0);
  await page.mouse.wheel(0, 200);
  await expect.poll(() => position(page)).toBeGreaterThan(0);
  await track.focus();
  await track.press('End');
  await expect.poll(() => position(page)).toBe(100);
  await expect(page.locator('#work-next')).toHaveAttribute('aria-disabled', 'true');
  await track.press('Home');
  await expect.poll(() => position(page)).toBe(0);
  await track.press('ArrowRight');
  await expect.poll(() => position(page)).toBeGreaterThan(0);
  await track.press('Home');
  await expect.poll(() => position(page)).toBe(0);
  const lastLink = page.locator('.work-card').last().getByRole('link');
  await lastLink.focus();
  await expect(lastLink).toBeFocused();
  await expect.poll(() => lastLink.evaluate(link => {
    const card = link.closest('.work-card').getBoundingClientRect();
    const viewport = document.querySelector('#work-viewport').getBoundingClientRect();
    return card.left >= viewport.left - 2 && card.right <= viewport.right + 2;
  })).toBe(true);
  await expect(page.locator('.work-card').last()).toHaveClass(/\bis-current\b/);
});

test('short desktop uses native horizontal scrolling instead of pinning', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await openApp(page);
  await expect(page.locator('#work')).not.toHaveClass(/\bis-pinned\b/);
  await expect(page.locator('#work-track')).toHaveCSS('overflow-x', 'auto');
  await expect(page.locator('#work-hint')).toHaveText('EXPLORE WITH ARROWS');
  await page.locator('#work-next').click();
  await expect.poll(() => page.locator('#work-track').evaluate(track => track.scrollLeft)).toBeGreaterThan(0);
  await expect.poll(() => position(page)).toBeGreaterThan(0);
});

test('navigation clears the current section when returning home or reaching contact', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await openApp(page);
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await nav.getByRole('link', { name: 'Services', exact: true }).click();
  await expect(nav.getByRole('link', { name: 'Services', exact: true })).toHaveAttribute('aria-current', 'location');
  await page.locator('.site-header .brand').click();
  await expect(page).toHaveURL(/#main$/);
  await expect(nav.locator('[aria-current]')).toHaveCount(0);
  await nav.getByRole('link', { name: 'Experience', exact: true }).click();
  await expect(nav.getByRole('link', { name: 'Experience', exact: true })).toHaveAttribute('aria-current', 'location');
  await page.locator('#contact').evaluate(section => section.scrollIntoView({ block: 'start' }));
  await expect(nav.locator('[aria-current]')).toHaveCount(0);
});

test('all links have labels and all fragment references have targets', async ({ page }) => {
  await openApp(page);
  const invalid = await page.locator('a, use').evaluateAll(elements => elements.flatMap(element => {
    const href = element.getAttribute('href');
    if (!href || href === '#') return ['Empty link'];
    if (href.startsWith('#') && !document.getElementById(href.slice(1))) return ['Missing target: ' + href];
    if (element.tagName.toLowerCase() === 'a' && !element.textContent.trim() && !element.getAttribute('aria-label')) return ['Missing label: ' + href];
    return [];
  }));
  expect(invalid).toEqual([]);
  await expect(page.locator('a')).toHaveCount(26);
  await expect(page.getByRole('button', { includeHidden: true })).toHaveCount(3);
});

test('mobile menu closes on Escape, outside click, focus exit, and anchor selection', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  const toggle = page.locator('#menu-toggle');
  const menu = page.locator('#nav-links');
  await expect(toggle).toBeVisible();
  await expect(menu).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle.locator('use')).toHaveAttribute('href', '#close');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('h1').click();
  await expect(menu).toBeHidden();
  await toggle.click();
  await page.locator('.hero-actions a[href="#work"]').focus();
  await expect(menu).toBeHidden();
  await toggle.click();
  await menu.getByRole('link', { name: 'Services', exact: true }).click();
  await expect(menu).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#services')).toBeFocused();
  await expect(page).toHaveURL(/#services$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('mobile project controls and native rail scrolling update progress', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  await expect(page.locator('#work')).not.toHaveClass(/\bis-pinned\b/);
  await expect(page.locator('#work-hint')).toHaveText('SWIPE OR USE ARROWS');
  await page.locator('#work-next').click();
  await expect.poll(() => position(page)).toBeGreaterThan(0);
  await page.locator('#work-prev').click();
  await expect.poll(() => position(page)).toBe(0);
  await expect(page.locator('#work-prev')).toHaveAttribute('aria-disabled', 'true');
  await page.locator('#work-track').evaluate(track => { track.scrollLeft = track.scrollWidth; });
  await expect.poll(() => position(page)).toBe(100);
  await expect(page.locator('#work-next')).toHaveAttribute('aria-disabled', 'true');
});

test('the scene stays inside its console across screen widths', async ({ page }) => {
  await openApp(page);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect.poll(() => page.evaluate(() => {
      const scene = document.querySelector('.scene').getBoundingClientRect();
      const screen = document.querySelector('.game-screen').getBoundingClientRect();
      return scene.left >= screen.left && scene.right <= screen.right
        && document.documentElement.scrollWidth <= innerWidth;
    })).toBe(true);
  }
});

test('reduced motion shows a project grid and responds to preference changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);
  const work = page.locator('#work');
  const track = page.locator('#work-track');
  const art = page.locator('#sarthi-console');
  await expect(work).not.toHaveClass(/\bis-pinned\b/);
  await expect(track).toHaveCSS('display', 'grid');
  await expect(page.locator('#work-controls')).toBeHidden();
  await expect(art).toHaveAttribute('data-player-state', 'idle');
  await expect(page.locator('.bot')).toHaveAttribute('data-frame', '0');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(work).toHaveClass(/\bis-pinned\b/);
  await expect(page.locator('#work-controls')).toBeVisible();
  await page.locator('.hero-actions a[href="#work"]').click();
  await page.locator('#work-next').click();
  await expect.poll(() => position(page)).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(work).not.toHaveClass(/\bis-pinned\b/);
  await expect(track).toHaveCSS('display', 'grid');
  await expect(track).toHaveCSS('transform', 'none');
  await expect(page.locator('#work-controls')).toBeHidden();
  await expect(art).toHaveAttribute('data-player-state', 'idle');
  await expect(page.locator('.bot')).toHaveAttribute('data-frame', '0');
});

test('scroll advances the pixel character and experience expands natively', async ({ page }) => {
  await openApp(page);
  expect(await page.locator('.player-sprite').evaluate(canvas =>
    canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.some((value, index) => index % 4 === 3 && value > 0)
  )).toBe(true);
  const frames = new Set();
  const states = new Set();
  for (const top of [0, 80, 160, 240, 320, 400]) {
    await page.evaluate(async y => {
      window.scrollTo(0, y);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }, top);
    frames.add(await page.locator('.bot').getAttribute('data-frame'));
    states.add(await page.locator('#sarthi-console').getAttribute('data-player-state'));
  }
  expect(frames.size).toBeGreaterThan(2);
  expect(states.size).toBeGreaterThan(2);
  const archive = page.locator('.experience-archive');
  await expect(archive.locator('.timeline')).toBeHidden();
  await archive.locator('summary').click();
  await expect(archive).toHaveAttribute('open', '');
  await expect(archive.locator('.timeline-entry')).toHaveCount(8);
  await expect(archive.locator('.timeline-entry').first()).toBeVisible();
  await archive.locator('summary').click();
  await expect(archive.locator('.timeline')).toBeHidden();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  test('prerendered content, navigation, projects, and experience remain usable', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/\bjs\b/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('BUSINESS.');
    await expect(page.locator('#nav-links')).toBeVisible();
    await expect(page.locator('#menu-toggle')).toBeHidden();
    await expect(page.locator('#work-track')).toHaveCSS('display', 'grid');
    await expect(page.locator('.work-card')).toHaveCount(4);
    await expect(page.locator('#work-controls')).toBeHidden();
    await page.locator('.experience-archive summary').click();
    await expect(page.locator('.experience-archive .timeline')).toBeVisible();
    await expect(page.locator('.experience-archive .timeline-entry')).toHaveCount(8);
  });
});
