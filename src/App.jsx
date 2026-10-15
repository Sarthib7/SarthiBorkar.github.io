import { useEffect } from 'react';
import { initializeInteractions } from './interactions.js';
import WorkflowFigure from './WorkflowFigure.jsx';
import ProjectCarousel from './ProjectCarousel.jsx';
import ProjectVisual from './ProjectVisual.jsx';
import { projects } from './projects.js';

export default function App() {
  useEffect(initializeInteractions, []);

  return (
    <>
<svg className="symbol-library" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <symbol id="brand-s" viewBox="0 0 40 40"><path d="M29 9H16l-7 7 20 9-7 7H9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round"/></symbol>
    <symbol id="arrow-right" viewBox="0 0 24 24"><path d="M4 12h16m-6-6 6 6-6 6"/></symbol>
    <symbol id="arrow-left" viewBox="0 0 24 24"><path d="M20 12H4m6-6-6 6 6 6"/></symbol>
    <symbol id="arrow-down" viewBox="0 0 24 24"><path d="M12 4v16m-6-6 6 6 6-6"/></symbol>
    <symbol id="arrow-up" viewBox="0 0 24 24"><path d="M12 20V4m-6 6 6-6 6 6"/></symbol>
    <symbol id="external" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6h12v12"/></symbol>
    <symbol id="chip" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14"/><path d="M9 9h6v6H9zM9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3"/></symbol>
    <symbol id="path" viewBox="0 0 24 24"><path d="M4 19h5v-7h6V5h5M16 2l4 3-4 3"/><rect x="2" y="17" width="4" height="4"/></symbol>
    <symbol id="lock" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/></symbol>
    <symbol id="payment" viewBox="0 0 24 24"><path d="M3 5h18v14H3zM3 10h18M7 15h4m6 0h1"/></symbol>
    <symbol id="plus" viewBox="0 0 24 24"><path d="M12 4v16M4 12h16"/></symbol>
    <symbol id="pin" viewBox="0 0 24 24"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/></symbol>
    <symbol id="menu" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></symbol>
    <symbol id="close" viewBox="0 0 24 24"><path d="m5 5 14 14M5 19 19 5"/></symbol>
  </defs>
</svg>
<a className="skip-link" href="#main">Skip to content</a>

<header className="site-header" id="top">
  <div className="container header-row">
    <a className="brand" href="#main" aria-label="Sarthiii, home">
      <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><use href="#brand-s"/></svg></span>
      <span className="brand-word">Sarthiii</span>
    </a>
    <button className="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Open navigation" hidden>
      <svg className="icon" aria-hidden="true"><use href="#menu"/></svg>
    </button>
    <nav className="site-nav" aria-label="Main navigation">
      <div className="nav-links" id="nav-links">
        <a className="nav-link" href="#services">Services</a>
        <a className="nav-link" href="#work">Selected work</a>
        <a className="nav-link" href="#about">Experience</a>
        <a className="nav-link mobile-book" href="https://cal.com/sarthi">Book a call <span className="sr-only">on Cal.com</span></a>
      </div>
    </nav>
    <a className="button button-outline header-book" href="https://cal.com/sarthi">Book a call <svg className="icon" aria-hidden="true"><use href="#external"/></svg><span className="sr-only">on Cal.com</span></a>
  </div>
</header>

<main id="main" tabIndex={-1}>
  <section className="hero" aria-labelledby="hero-title">
    <div className="container">
      <div className="od-grid hero-grid">
        <div className="od-stack hero-intro">
          <p className="hero-signature">Sarthi Borkar</p>
          <h1 id="hero-title"><span>Engineering for</span><span className="hero-title-serif">agents &amp; people.</span></h1>
          <p className="hero-copy">I build AI tools, payment systems, and products people can use. My work connects product thinking with engineering across software, finance, and robotics.</p>
          <div className="od-cluster hero-actions">
            <a className="button button-primary" href="https://cal.com/sarthi">Discuss a project <svg className="icon" aria-hidden="true"><use href="#external"/></svg><span className="sr-only">on Cal.com</span></a>
            <a className="text-link" href="#work">View selected work <svg className="icon" aria-hidden="true"><use href="#arrow-down"/></svg></a>
          </div>
          <div className="od-cluster hero-skills" aria-label="Services"><span>AI SYSTEMS</span><span>PRODUCT ENGINEERING</span><span>AGENT PAYMENTS</span></div>
        </div>
        <div className="hero-visual"><WorkflowFigure /></div>
      </div>
      <div className="hero-bottom">
        <a className="scroll-hint" href="#services"><svg className="icon" aria-hidden="true"><use href="#arrow-down"/></svg> BUILT WITH PURPOSE</a>
        <p>Independent work. Open to client projects and engineering roles.</p>
        <span className="chapter-number" aria-hidden="true">BERLIN, DE</span>
      </div>
    </div>
  </section>

  <section className="discipline-strip" aria-label="Areas of work">
    <div className="container discipline-row"><span>AI systems</span><span>Agent payments</span><span>Product engineering</span><span>Berlin, Germany</span></div>
  </section>

  <section className="section services" id="services" aria-labelledby="services-title">
    <div className="container">
      <p className="eyebrow section-label">01 / HOW I CAN HELP</p>
      <div className="section-heading" data-reveal>
        <h2 id="services-title">What I build.</h2>
      </div>
      <div className="od-grid services-grid">
        <article className="service-card service-card-blue" data-reveal>
          <div className="service-top"><span className="eyebrow">01 / AI SOLUTIONS</span><span className="service-symbol" aria-hidden="true"><svg className="icon"><use href="#chip"/></svg></span></div>
          <h3>AI automation</h3>
          <p>Document workflows and internal tools connected to your systems.</p>
          <a className="text-link" href="https://cal.com/sarthi">Discuss automation <svg className="icon" aria-hidden="true"><use href="#arrow-right"/></svg><span className="sr-only">on Cal.com</span></a>
        </article>
        <article className="service-card service-card-sky" data-reveal>
          <div className="service-top"><span className="eyebrow">02 / PRIVATE AI</span><span className="service-symbol" aria-hidden="true"><svg className="icon"><use href="#lock"/></svg></span></div>
          <h3>Private AI</h3>
          <p>Search company knowledge with control over access and hosting.</p>
          <a className="text-link" href="https://cal.com/sarthi">Discuss private AI <svg className="icon" aria-hidden="true"><use href="#arrow-right"/></svg><span className="sr-only">on Cal.com</span></a>
        </article>
        <article className="service-card service-card-yellow" data-reveal>
          <div className="service-top"><span className="eyebrow">03 / AGENT PAYMENTS<br />&amp; STABLECOINS</span><span className="service-symbol" aria-hidden="true"><svg className="icon"><use href="#payment"/></svg></span></div>
          <h3>Agent payments</h3>
          <p>Paid tools for agents, stablecoin settlement, and transaction records.</p>
          <a className="text-link" href="https://cal.com/sarthi">Discuss payments <svg className="icon" aria-hidden="true"><use href="#arrow-right"/></svg><span className="sr-only">on Cal.com</span></a>
        </article>
        <article className="service-card" data-reveal>
          <div className="service-top"><span className="eyebrow">04 / CONSULTING</span><span className="service-symbol" aria-hidden="true"><svg className="icon"><use href="#path"/></svg></span></div>
          <h3>Technical consulting</h3>
          <p>A clear technical scope and a practical plan for your next build.</p>
          <a className="text-link" href="https://cal.com/sarthi">Plan your project <svg className="icon" aria-hidden="true"><use href="#arrow-right"/></svg><span className="sr-only">on Cal.com</span></a>
        </article>
      </div>
    </div>
  </section>

  <section className="work-section" id="work" aria-labelledby="work-title">
    <div className="work-stage" id="work-stage">
      <div className="container">
        <p className="eyebrow section-label">02 / SELECTED PROJECTS</p>
        <div className="section-heading">
          <h2 id="work-title">Selected work<span className="heading-period">.</span></h2>
        </div>
        <ProjectCarousel>
          {projects.map((project, index) => (
            <article className="work-card" key={project.name} aria-labelledby={`project-${index}`}>
              <div className={`work-art work-art-${project.color} work-art--${project.variant}`} aria-hidden="true">
                <span className="art-corner">{project.category}</span>
                <ProjectVisual src={project.media} variant={project.variant} />
                <div className="project-cover-copy"><span className="project-cover-label">{project.name}</span><span className="project-cover-subtitle">{project.caption}</span></div>
                <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="work-body">
                <div className="work-meta"><span className="work-kind">{project.category}</span>{project.status && <span className="project-status">{project.status}</span>}</div>
                <h3 id={`project-${index}`}>{project.name}</h3>
                <p>{project.description}</p>
                <div className="project-tags" aria-label="Project focus">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                <a className="text-link" href={project.url}>{project.linkLabel} <svg className="icon" aria-hidden="true"><use href={project.url.startsWith('#') ? '#arrow-right' : '#external'}/></svg></a>
              </div>
            </article>
          ))}
        </ProjectCarousel>
      </div>
    </div>
  </section>

  <section className="section about" id="about" aria-labelledby="about-title">
    <div className="container od-grid about-grid">
      <div className="od-stack about-intro" data-reveal>
        <p className="eyebrow section-label">03 / EXPERIENCE</p>
        <h2 id="about-title">Product-minded.<br />Hands-on.</h2>
        <p>I build AI and payment products. Head of Product at RouterLabs. Founder of Fundwise.</p>
        <div className="about-fact"><svg className="icon" aria-hidden="true"><use href="#pin"/></svg> Based in Berlin, Germany</div>
      </div>
      <div>
        <ol className="timeline timeline-current" aria-label="Current roles">
          <li className="timeline-entry" data-reveal><span className="timeline-date">CURRENT</span><div className="od-stack timeline-body"><h3>Head of Product</h3><a className="timeline-company text-link" href="https://routerlabs.ai">RouterLabs <svg className="icon" aria-hidden="true"><use href="#external"/></svg></a></div></li>
          <li className="timeline-entry" data-reveal><span className="timeline-date">CURRENT</span><div className="od-stack timeline-body"><h3>Founder</h3><a className="timeline-company text-link" href="https://fundwise.fun">Fundwise <svg className="icon" aria-hidden="true"><use href="#external"/></svg></a></div></li>
        </ol>
        <details className="experience-archive">
          <summary>More experience <span className="chapter-count">08</span><svg className="icon" aria-hidden="true"><use href="#plus"/></svg></summary>
          <ol className="timeline" aria-label="More experience and education">
            <li className="timeline-entry"><span className="timeline-date">2025-present</span><div className="od-stack timeline-body"><h3>Agentic Engineer &amp; DevRel</h3><span className="timeline-company">Masumi Network</span><p>Developer tools and payment infrastructure for AI agents, with DevRel across Masumi and Sokosumi.</p></div></li>
            <li className="timeline-entry"><span className="timeline-date">2025-present</span><div className="od-stack timeline-body"><h3>DeFi Efficiency Researcher</h3><span className="timeline-company">DoubleZero</span><p>Research into protocol optimization, scalability, and DeFi infrastructure efficiency.</p></div></li>
            <li className="timeline-entry"><span className="timeline-date">2025</span><div className="od-stack timeline-body"><h3>Events Lead</h3><span className="timeline-company">Bitget Builder</span><p>Community events and sponsorship coordination across Europe.</p></div></li>
            <li className="timeline-entry"><span className="timeline-date">2024-2025</span><div className="od-stack timeline-body"><h3>Head of Operations</h3><span className="timeline-company">dxb.care</span><p>Concierge operations and client communication for blockchain investors.</p></div></li>
            <li className="timeline-entry"><span className="timeline-date">2024-2025</span><div className="od-stack timeline-body"><h3>Full Stack Web3 Developer</h3><span className="timeline-company">FeeFlex Labs</span><p>Decentralized applications and Web3 infrastructure.</p></div></li>
            <li className="timeline-entry"><span className="timeline-date">2023-2024</span><div className="od-stack timeline-body"><h3>Developer Advocate</h3><span className="timeline-company">Router Protocol</span><p>Workshops and developer onboarding for cross-chain DeFi.</p></div></li>
            <li className="timeline-entry"><span className="timeline-date">2023</span><div className="od-stack timeline-body"><h3>Ambassador Developer</h3><span className="timeline-company">Push Protocol</span><p>Application development and education around blockchain communication.</p></div></li>
            <li className="timeline-entry"><span className="timeline-date">2023</span><div className="od-stack timeline-body"><h3>Blockchain Academy Graduate</h3><span className="timeline-company">Polkadot Blockchain Academy</span><p>Intensive blockchain development education.</p></div></li>
          </ol>
        </details>
      </div>
    </div>
  </section>

  <aside className="working-note"><div className="container"><p className="working-note-title">A product partner.<br />An engineer on the details.</p><div><p>For a focused build, a technical collaboration, or an engineering role.</p><div className="working-note-links"><a className="text-link" href="https://github.com/Sarthib7">GitHub <svg className="icon" aria-hidden="true"><use href="#external"/></svg></a><a className="text-link" href="https://linkedin.com/in/sarthiborkar">LinkedIn <svg className="icon" aria-hidden="true"><use href="#external"/></svg></a><a className="text-link" href="https://cal.com/sarthi">Talk with me <svg className="icon" aria-hidden="true"><use href="#external"/></svg></a></div></div></div></aside>

  <section className="section contact" id="contact" aria-labelledby="contact-title">
    <div className="container od-grid contact-grid" data-reveal>
      <div><h2 id="contact-title"><span>Start with</span><span>one clear</span><span>priority.</span></h2></div>
      <div className="od-stack contact-copy"><p>Have a project or an engineering role in mind? Let’s talk.</p><a className="button button-primary" href="https://cal.com/sarthi">Discuss a project <svg className="icon" aria-hidden="true"><use href="#external"/></svg><span className="sr-only">on Cal.com</span></a><span className="booking-destination">cal.com/sarthi</span></div>
    </div>
  </section>
</main>

<footer className="site-footer">
  <div className="container footer-row">
    <a className="brand" href="#main" aria-label="Sarthiii, return to top"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><use href="#brand-s"/></svg></span><span className="brand-word">Sarthiii</span></a>
    <div className="od-field footer-meta"><span>© 2026 Sarthi Borkar</span><span>Product engineering. AI systems. Berlin.</span></div>
    <div className="od-cluster footer-links"><a className="text-link" href="https://github.com/Sarthib7">GitHub <svg className="icon" aria-hidden="true"><use href="#external"/></svg></a><a className="text-link" href="https://x.com/sarthib7" aria-label="Sarthi on X">X <svg className="icon" aria-hidden="true"><use href="#external"/></svg></a><a className="text-link" href="#main">Back to top <svg className="icon" aria-hidden="true"><use href="#arrow-up"/></svg></a></div>
  </div>
</footer>
    </>
  );
}
