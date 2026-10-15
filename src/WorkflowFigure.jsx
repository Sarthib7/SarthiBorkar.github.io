import { useState } from 'react';
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
  return (
    <figure className="workflow-figure iso" data-theme="light" data-stage={stage} style={{ '--stage': stage }}>
      <div className="figure-topline"><span>FIG. 01</span><span>A WORKFLOW, MADE TANGIBLE</span></div>
      <div className="figure-art" dangerouslySetInnerHTML={{ __html: art }} />
      <div className="figure-bottomline"><span>ONE STEP AT A TIME</span><span className="figure-readout">{String(stage + 1).padStart(2, '0')} / {stages[stage].name}</span></div>
      <div className="figure-controls" role="group" aria-label="Explore the workflow stages">
        {stages.map((item, index) => <button key={item.name} type="button" aria-pressed={stage === index} onClick={() => setStage(index)}><span>{String(index + 1).padStart(2, '0')}</span> {item.name}</button>)}
      </div>
      <figcaption className="figure-caption" aria-live="polite">{stages[stage].caption}</figcaption>
    </figure>
  );
}
