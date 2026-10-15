import './project-visual.css';

export default function ProjectVisual({ src, variant = 'object' }) {
  return <img className={`project-visual project-visual--${variant}`} src={src} alt="" width="600" height="340" loading="lazy" decoding="async" />;
}
