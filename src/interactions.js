export function initializeInteractions() {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-links');
  const icon = toggle.querySelector('use');
  const controller = new AbortController();
  const listen = (target, event, handler) => target.addEventListener(event, handler, { signal: controller.signal });
  const mobile = matchMedia('(max-width: 760px)');
  const setMenu = (open, returnFocus = false) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    icon.setAttribute('href', open ? '#close' : '#menu');
    if (returnFocus) toggle.focus();
  };
  root.classList.add('js');
  toggle.hidden = false;
  listen(toggle, 'click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  listen(document, 'keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false, true);
  });
  listen(document, 'click', event => {
    if (!header.contains(event.target)) setMenu(false);
  });
  listen(header, 'focusout', event => {
    if (!header.contains(event.relatedTarget)) setMenu(false);
  });
  listen(menu, 'click', event => {
    const link = event.target.closest('a');
    if (!link || !mobile.matches) return;
    setMenu(false);
    const fragment = link.getAttribute('href');
    if (!fragment.startsWith('#')) return;
    const target = document.getElementById(fragment.slice(1));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
  listen(mobile, 'change', () => setMenu(false));
  const navLinks = [...menu.querySelectorAll('a[href^="#"]')];
  const sectionIds = ['services', 'work', 'about', 'contact'];
  const visible = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visible.add(entry.target.id);
      else visible.delete(entry.target.id);
    });
    const current = sectionIds.filter(id => visible.has(id)).pop();
    navLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -50% 0px' });
  sectionIds.forEach(id => observer.observe(document.getElementById(id)));
  return () => {
    controller.abort();
    observer.disconnect();
    navLinks.forEach(link => link.removeAttribute('aria-current'));
    root.classList.remove('js');
    setMenu(false);
    toggle.hidden = true;
  };
}
