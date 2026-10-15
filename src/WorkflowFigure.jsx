import { useEffect, useState } from 'react';
import art from './workflow-art.svg?raw';
import './anatomy.css';
import './figure.css';

const stages = [
  { name: 'Collect', caption: 'Bring the documents and tools your team already uses into one workflow.' },
  { name: 'Process', caption: 'Apply a focused AI step, with a review before the result moves forward.' },
  { name: 'Deliver', caption: 'Return the result to your team, ready for the next task.' },
];

export default function WorkflowFigure() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let timer;
    function start() {
      clearInterval(timer);
      setStage(0);
      if (!reduced.matches) timer = setInterval(() => {
        if (!document.hidden) setStage(current => (current + 1) % stages.length);
      }, 2400);
    }
    start();
    reduced.addEventListener('change', start);
    return () => { clearInterval(timer); reduced.removeEventListener('change', start); };
  }, []);
  function followPointer(event) {
    if (event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    event.currentTarget.style.setProperty('--pointer-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--pointer-y', `${y * 100}%`);
    event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - y) * 8}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(x - 0.5) * 10}deg`);
  }
  function resetPointer(event) {
    ['--pointer-x', '--pointer-y', '--tilt-x', '--tilt-y'].forEach(property => event.currentTarget.style.removeProperty(property));
  }
  return (
    <figure className="workflow-figure iso" data-theme="light" data-stage={stage} style={{ '--stage': stage }}>
      <div className="figure-topline"><span>FIG. 01</span><span>A WORKFLOW, MADE TANGIBLE</span></div>
      <div className="figure-art" onPointerMove={followPointer} onPointerLeave={resetPointer}>
        <div className="figure-machine" dangerouslySetInnerHTML={{ __html: art }} />
      </div>
      <div className="figure-bottomline"><span>ONE STEP AT A TIME</span><span className="figure-readout">{String(stage + 1).padStart(2, '0')} / {stages[stage].name}</span></div>
      <figcaption className="figure-caption">{stages[stage].caption}</figcaption>
    </figure>
  );
}
