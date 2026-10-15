import { Children, useEffect, useRef } from 'react';
import './carousel.css';

export default function ProjectCarousel({ children }) {
  const galleryRef = useRef(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    const work = gallery.closest('#work');
    const stage = work.querySelector('.work-stage');
    const track = gallery.querySelector('#work-track');
    const viewport = gallery.querySelector('.work-viewport');
    const cards = [...track.children];
    const controls = gallery.querySelector('#work-controls');
    const previous = gallery.querySelector('#work-prev');
    const next = gallery.querySelector('#work-next');
    const progress = gallery.querySelector('#work-progress');
    const fill = gallery.querySelector('.gallery-progress-fill');
    const readout = gallery.querySelector('.gallery-readout');
    const hint = gallery.querySelector('.gallery-hint');
    const announcement = gallery.querySelector('[aria-live]');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 1000px)');
    const controller = new AbortController();
    const listen = (target, event, handler) => target.addEventListener(event, handler, { signal: controller.signal, passive: event === 'scroll' });
    const clamp = value => Math.max(0, Math.min(maximum, value));
    let maximum = 0;
    let position = 0;
    let start = 0;
    let pinned = false;
    let offsets = [];
    let stops = [];
    let frame = 0;
    let measureFrame = 0;

    function scheduleMeasure() {
      if (measureFrame) return;
      measureFrame = requestAnimationFrame(() => {
        measureFrame = 0;
        measure();
      });
    }

    function render(value) {
      position = clamp(value);
      if (pinned) track.style.transform = `translate3d(${-position}px,0,0)`;
      const fraction = maximum ? position / maximum : 0;
      progress.setAttribute('aria-valuenow', String(Math.round(fraction * 100)));
      fill.style.transform = `scaleX(${fraction})`;
      previous.setAttribute('aria-disabled', String(position <= 2));
      next.setAttribute('aria-disabled', String(position >= maximum - 2));
      const active = position >= maximum - 2 ? cards.length - 1 : offsets.findLastIndex(offset => offset <= position + 2);
      readout.textContent = `${String(Math.max(0, active) + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    }

    function measure() {
      const fraction = maximum ? position / maximum : 0;
      const wasWithin = pinned && window.scrollY >= start - 2 && window.scrollY <= start + maximum + 2;
      pinned = false;
      work.classList.remove('is-pinned');
      work.style.removeProperty('height');
      track.style.removeProperty('transform');
      gallery.classList.toggle('is-carousel', !reduced.matches);
      const headerHeight = document.querySelector('.site-header').offsetHeight;
      work.style.setProperty('--gallery-top', `${headerHeight}px`);
      maximum = Math.max(0, track.scrollWidth - track.clientWidth);
      const first = cards[0].offsetLeft;
      offsets = cards.map(card => card.offsetLeft - first);
      stops = [...new Set(offsets.map(clamp))];
      controls.hidden = reduced.matches || maximum < 2;
      pinned = desktop.matches && !reduced.matches && maximum > 2 && stage.offsetHeight + headerHeight + 16 < innerHeight;
      if (pinned) {
        work.classList.add('is-pinned');
        work.style.height = `${stage.offsetHeight + maximum}px`;
        start = window.scrollY + work.getBoundingClientRect().top - headerHeight;
        track.scrollLeft = 0;
        viewport.scrollLeft = 0;
        if (wasWithin) window.scrollTo({ top: start + fraction * maximum, behavior: 'instant' });
        render(window.scrollY - start);
      } else {
        track.scrollLeft = reduced.matches ? 0 : fraction * maximum;
        if (wasWithin) work.scrollIntoView({ block: 'start', behavior: 'instant' });
        render(track.scrollLeft);
      }
      gallery.dataset.mode = reduced.matches ? 'grid' : pinned ? 'scroll' : 'swipe';
      hint.textContent = pinned ? 'SCROLL TO EXPLORE' : 'SWIPE OR USE ARROWS';
      track.tabIndex = reduced.matches ? -1 : 0;
      track.setAttribute('aria-label', reduced.matches ? 'Project gallery' : 'Project gallery. Use left and right arrows, Home, or End.');
      if (reduced.matches) viewport.removeAttribute('aria-roledescription');
      else viewport.setAttribute('aria-roledescription', 'carousel');
    }

    function move(value, smooth = true) {
      measure();
      const destination = clamp(value);
      if (pinned) {
        window.scrollTo({ top: start + destination, behavior: 'instant' });
        render(destination);
      } else {
        track.scrollTo({ left: destination, behavior: smooth && !reduced.matches ? 'smooth' : 'instant' });
        if (!smooth) render(destination);
      }
    }
    function step(direction) {
      if (direction < 0 && position <= 2 || direction > 0 && position >= maximum - 2) return;
      const destination = direction > 0
        ? stops.find(stop => stop > position + 2) ?? maximum
        : [...stops].reverse().find(stop => stop < position - 2) ?? 0;
      move(destination);
      announcement.textContent = direction > 0 ? 'Showing more projects.' : 'Showing previous projects.';
    }
    listen(next, 'click', () => step(1));
    listen(previous, 'click', () => step(-1));
    listen(track, 'scroll', () => { if (!pinned) render(track.scrollLeft); });
    listen(window, 'scroll', () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (pinned) render(window.scrollY - start);
      });
    });
    listen(track, 'keydown', event => {
      if (event.target !== track || reduced.matches) return;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home' || event.key === 'End') move(event.key === 'Home' ? 0 : maximum);
      else step(event.key === 'ArrowRight' ? 1 : -1);
    });
    listen(track, 'focusin', event => {
      if (reduced.matches) return;
      const index = cards.findIndex(card => card.contains(event.target));
      if (index < 0) return;
      if (pinned) { track.scrollLeft = 0; viewport.scrollLeft = 0; }
      const left = offsets[index];
      const right = left + cards[index].offsetWidth;
      if (left < position - 2) move(left, false);
      else if (right > position + viewport.clientWidth + 2) move(right - viewport.clientWidth, false);
    });
    listen(window, 'resize', measure);
    listen(window, 'pageshow', measure);
    listen(reduced, 'change', measure);
    measure();
    const layoutObserver = new ResizeObserver(scheduleMeasure);
    [document.querySelector('.site-header'), document.querySelector('.hero'), document.querySelector('#services'), stage]
      .filter(Boolean).forEach(element => layoutObserver.observe(element));
    return () => {
      controller.abort();
      layoutObserver.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(measureFrame);
      work.classList.remove('is-pinned');
      work.style.removeProperty('height');
      work.style.removeProperty('--gallery-top');
      gallery.classList.remove('is-carousel');
      delete gallery.dataset.mode;
      track.style.removeProperty('transform');
      controls.hidden = true;
    };
  }, []);

  return (
    <div className="project-gallery" ref={galleryRef}>
      <div className="work-viewport" role="region" aria-label="Selected projects">
        <div className="work-track" id="work-track" tabIndex={-1} aria-label="Project gallery">{children}</div>
      </div>
      <div className="gallery-controls" id="work-controls" hidden>
        <div className="gallery-buttons">
          <button type="button" id="work-prev" aria-label="Previous projects" aria-controls="work-track" aria-disabled="true"><svg className="icon" aria-hidden="true"><use href="#arrow-left"/></svg></button>
          <button type="button" id="work-next" aria-label="Next projects" aria-controls="work-track" aria-disabled="false"><svg className="icon" aria-hidden="true"><use href="#arrow-right"/></svg></button>
        </div>
        <span className="gallery-hint">SWIPE OR USE ARROWS</span>
        <div className="gallery-progress" id="work-progress" role="progressbar" aria-label="Project gallery position" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span className="gallery-progress-fill" /></div>
        <span className="gallery-readout">01 / {String(Children.count(children)).padStart(2, '0')}</span>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true" />
    </div>
  );
}
