import { useEffect } from 'react';
import { initializeInteractions } from './interactions.js';

export default function App() {
  useEffect(initializeInteractions, []);

  return (
    <>
<svg className="symbol-library" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
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
    <a className="brand" href="#main" aria-label="Sarthi Borkar, home">
      <span className="brand-mark" aria-hidden="true"><span className="pixel-star"></span></span>
      <span className="brand-word">sarthi<b>.</b></span>
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

<main id="main">
  <section className="hero" aria-labelledby="hero-title">
    <div className="container">
      <div className="od-grid hero-grid">
        <div className="od-stack hero-intro">
          <p className="hero-kicker"><span className="pixel-star" aria-hidden="true"></span> FOR SMALL BUSINESSES &amp; STARTUPS</p>
          <h1 id="hero-title"><span>AI BUILT</span><span>FOR YOUR</span><span className="red-line">BUSINESS.</span></h1>
          <p className="hero-copy">I help small businesses and startups reduce manual work with AI and custom software. Start with one business problem and a clearly scoped solution.</p>
          <div className="od-cluster hero-actions">
            <a className="button button-primary" href="https://cal.com/sarthi">Discuss a project <svg className="icon" aria-hidden="true"><use href="#external"/></svg><span className="sr-only">on Cal.com</span></a>
            <a className="text-link" href="#work">Explore the work <svg className="icon" aria-hidden="true"><use href="#arrow-down"/></svg></a>
          </div>
          <div className="od-cluster hero-skills" aria-label="Services"><span>AUTOMATION</span><span>PRIVATE AI</span><span>PAYMENTS</span></div>
        </div>
        <div className="console-wrap" aria-hidden="true">
          <div className="game-console" id="sarthi-console" data-phase="0">
            <div className="console-title"><span>SARTHI.EXE</span><span className="window-lights"><span></span><span></span><span></span></span></div>
            <div className="game-screen">
              <div className="game-hud"><div className="od-field"><span>FOCUS</span><span className="hud-sub">YOUR BUSINESS</span></div><div className="od-field"><span>APPROACH</span><span className="hud-sub">PLAN &amp; BUILD</span></div></div>
              <div className="scene">
                <img className="scene-backdrop" src="assets/pixel-valley.png" width="1536" height="1024" alt="" decoding="async" />
                <div className="scene-pillar scene-pillar-left"><span className="coin"></span><span className="question-block">?</span><span className="pixel-platform"></span></div>
                <div className="bot"><span className="bot-shadow"></span><span className="bot-dust"></span><span className="bot-rig"><canvas className="player-sprite" width="224" height="360" aria-hidden="true"></canvas><span className="player-head"><span className="player-hood"></span><span className="player-face"></span><span className="player-visor"></span></span><span className="bot-body"><i></i><i></i></span><span className="bot-feet"><i></i><i></i></span></span></div>
                <div className="scene-pillar"><span className="coin"></span><span className="question-block code-block">&lt;/&gt;</span><span className="pixel-platform"></span></div>
              </div>
              <div className="quest-steps"><span className="quest-step"><i></i>PLAN</span><span className="quest-step"><i></i>BUILD</span><span className="quest-step"><i></i>SHIP</span></div>
              <div className="game-caption">BUSINESS NEEDS. PRACTICAL SOFTWARE.</div>
            </div>
            <div className="console-footer"><span className="console-footer-label">SCROLL TO BUILD</span><span className="console-dots"><i></i><i></i></span></div>
          </div>
          <div className="art-caption"><span>INDEPENDENT ENGINEER. BASED IN BERLIN.</span><span className="pixel-star"></span></div>
        </div>
      </div>
      <div className="hero-bottom">
        <a className="scroll-hint" href="#services"><svg className="icon" aria-hidden="true"><use href="#arrow-down"/></svg> SCROLL TO EXPLORE</a>
        <p>Based in Berlin. Working directly with your team.</p>
        <span className="chapter-number" aria-hidden="true">01 / START</span>
      </div>
    </div>
  </section>

  <section className="section services" id="services" aria-labelledby="services-title">
    <div className="container">
      <p className="eyebrow section-label">01 / SERVICES</p>
      <div className="section-heading" data-reveal>
        <h2 id="services-title">SOLUTIONS FOR<br />DAILY WORK.</h2>
        <p>For local businesses, the starting point is often repetitive admin. For startups, it may be a new product or integration. Choose the support your team needs.</p>
      </div>
      <div className="od-grid services-grid">
        <article className="service-card service-card-blue" data-reveal>
          <div className="service-top"><span className="eyebrow">01 / AI SOLUTIONS</span><span className="service-symbol" aria-hidden="true"><svg className="icon"><use href="#chip"/></svg></span></div>
          <h3>Spend less time<br />on manual work.</h3>
          <p>Turn document processing and repetitive admin into workflows your team can use. I connect the tools you already work with.</p>
          <ul><li>Document processing and data entry</li><li>Internal tools connected to your systems</li></ul>
          <a className="text-link" href="https://cal.com/sarthi">Discuss automation <svg className="icon" aria-hidden="true"><use href="#arrow-right"/></svg><span className="sr-only">on Cal.com</span></a>
        </article>
        <article className="service-card service-card-sky" data-reveal>
          <div className="service-top"><span className="eyebrow">02 / PRIVATE AI</span><span className="service-symbol" aria-hidden="true"><svg className="icon"><use href="#lock"/></svg></span></div>
          <h3>Put company<br />knowledge to work.</h3>
          <p>Help your team find answers in internal documents. Define who can access the information and where the AI runs.</p>
          <ul><li>Private or self-hosted AI tools</li><li>Document search and access controls</li></ul>
          <a className="text-link" href="https://cal.com/sarthi">Discuss private AI <svg className="icon" aria-hidden="true"><use href="#arrow-right"/></svg><span className="sr-only">on Cal.com</span></a>
        </article>
        <article className="service-card service-card-yellow" data-reveal>
          <div className="service-top"><span className="eyebrow">03 / AGENT PAYMENTS<br />&amp; STABLECOINS</span><span className="service-symbol" aria-hidden="true"><svg className="icon"><use href="#payment"/></svg></span></div>
          <h3>Build payments<br />into your product.</h3>
          <p>For startups building AI agents or stablecoin products. I develop payment flows for paid tools and transaction tracking.</p>
          <ul><li>Paid tool access for AI agents</li><li>Stablecoin settlement and payment records</li></ul>
          <a className="text-link" href="https://cal.com/sarthi">Discuss payments <svg className="icon" aria-hidden="true"><use href="#arrow-right"/></svg><span className="sr-only">on Cal.com</span></a>
        </article>
        <article className="service-card" data-reveal>
          <div className="service-top"><span className="eyebrow">04 / CONSULTING</span><span className="service-symbol" aria-hidden="true"><svg className="icon"><use href="#path"/></svg></span></div>
          <h3>Choose the right<br />project to build.</h3>
          <p>Decide where AI can add value before you invest in development. Get clear requirements and a practical implementation plan.</p>
          <ul><li>Workflow review and technical options</li><li>Defined pilot scope and delivery priorities</li></ul>
          <a className="text-link" href="https://cal.com/sarthi">Plan your project <svg className="icon" aria-hidden="true"><use href="#arrow-right"/></svg><span className="sr-only">on Cal.com</span></a>
        </article>
      </div>
      <p className="service-note"><span className="pixel-star" aria-hidden="true"></span>Start with one workflow. Agree a clear scope, build a pilot, and review it with your team before expanding.</p>
    </div>
  </section>

  <section className="work-section" id="work" aria-labelledby="work-title">
    <div className="work-stage" id="work-stage">
      <div className="container">
        <p className="eyebrow section-label">02 / SELECTED PROJECTS</p>
        <div className="section-heading">
          <h2 id="work-title">SELECTED<br /><span>PROJECTS.</span></h2>
          <p>Explore my work in private AI and agent payments. These software projects and contributions link to their source code.</p>
        </div>
        <div className="work-viewport" id="work-viewport" role="region" aria-roledescription="carousel" aria-label="Selected projects">
          <div className="od-rail work-track" id="work-track" tabIndex="0" aria-label="Project cards. Use the left and right arrow keys to explore.">
            <article className="work-card" aria-label="1 of 4, Citadel">
              <div className="work-art work-art-sky" aria-hidden="true"><span className="art-corner">01 / MEMORY</span><div className="pixel-object"><div className="px-archive"><i></i><i></i><i></i><i></i><i></i><i></i></div></div><span className="pixel-star"></span></div>
              <div className="work-body"><div className="od-cluster work-meta"><span className="work-kind">TEAM PROJECT</span><span className="project-status">In testing</span></div><h3>Citadel</h3><p>Self-hosted memory for engineering teams and the agents working alongside them.</p><a className="text-link" href="https://github.com/masumi-network/Citadel">Explore Citadel <svg className="icon" aria-hidden="true"><use href="#external"/></svg><span className="sr-only">on GitHub</span></a></div>
            </article>
            <article className="work-card" aria-label="2 of 4, Kairen DealRail">
              <div className="work-art work-art-yellow" aria-hidden="true"><span className="art-corner">02 / PAYMENTS</span><div className="pixel-object"><div className="px-rail"><span className="px-node"><i></i></span><span className="px-route"></span><span className="px-node"><i></i></span><span className="coin"></span></div></div><span className="pixel-star"></span></div>
              <div className="work-body"><div className="od-cluster work-meta"><span className="work-kind">TEAM PROJECT</span><span className="project-status">Curated marketplace demo</span></div><h3>Kairen DealRail</h3><p>An agent commerce desk for task offers, payments, and escrow settlement.</p><a className="text-link" href="https://github.com/Kairen-Protocol/kairen-dealrail">Explore DealRail <svg className="icon" aria-hidden="true"><use href="#external"/></svg><span className="sr-only">on GitHub</span></a></div>
            </article>
            <article className="work-card" aria-label="3 of 4, IntentVault">
              <div className="work-art work-art-blue" aria-hidden="true"><span className="art-corner">03 / PRIVATE AI</span><div className="pixel-object"><span className="px-vault"><span className="px-lock"></span></span></div><span className="pixel-star"></span></div>
              <div className="work-body"><span className="work-kind">PROJECT / PRIVATE AI</span><h3>IntentVault</h3><p>Private AI workflows with reusable templates and structured outputs.</p><a className="text-link" href="https://github.com/Sarthib7/IntentVault">Explore IntentVault <svg className="icon" aria-hidden="true"><use href="#external"/></svg><span className="sr-only">on GitHub</span></a></div>
            </article>
            <article className="work-card" aria-label="4 of 4, Agentsmith">
              <div className="work-art work-art-red" aria-hidden="true"><span className="art-corner">04 / AGENT TOOLS</span><div className="pixel-object"><span className="px-bench"><i className="px-tool"></i><i className="px-tool"></i><i className="px-tool"></i></span></div><span className="pixel-star"></span></div>
              <div className="work-body"><span className="work-kind">AUTHORED &amp; CURATED COLLECTION</span><h3>Agentsmith</h3><p>Authored and collected agent skills, rules, and reusable workflows.</p><a className="text-link" href="https://github.com/Sarthib7/agentsmith">Explore Agentsmith <svg className="icon" aria-hidden="true"><use href="#external"/></svg><span className="sr-only">on GitHub</span></a></div>
            </article>
          </div>
        </div>
        <div className="work-controls" id="work-controls" hidden>
          <div className="work-buttons"><button type="button" className="work-button" id="work-prev" aria-label="Previous projects" aria-controls="work-track" aria-disabled="true"><svg className="icon" aria-hidden="true"><use href="#arrow-left"/></svg></button><button type="button" className="work-button" id="work-next" aria-label="Next projects" aria-controls="work-track" aria-disabled="false"><svg className="icon" aria-hidden="true"><use href="#arrow-right"/></svg></button></div>
          <div className="work-position"><span className="work-position-label" id="work-hint">SWIPE OR USE ARROWS</span><div className="progress-track" id="work-progress" role="progressbar" aria-label="Project gallery position" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span className="progress-fill" id="work-progress-fill"></span></div></div>
          <a className="text-link work-skip" href="#about">View experience <svg className="icon" aria-hidden="true"><use href="#arrow-down"/></svg></a>
        </div>
        <p className="sr-only" id="work-announcement" aria-live="polite" aria-atomic="true"></p>
      </div>
    </div>
  </section>

  <section className="section about" id="about" aria-labelledby="about-title">
    <div className="container od-grid about-grid">
      <div className="od-stack about-intro" data-reveal>
        <p className="eyebrow section-label">03 / EXPERIENCE</p>
        <h2 id="about-title">PRODUCT &amp;<br />ENGINEERING.</h2>
        <div className="od-cluster"><span className="tag">ENGINEER</span><span className="tag">PRODUCT BUILDER</span></div>
        <p>I am Sarthi Borkar, Head of Product at RouterLabs and Founder of Fundwise. My work covers AI, blockchain, stablecoins, and agentic payments.</p>
        <p>Work directly with me to turn a business need into a technical scope and working software.</p>
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

  <section className="section contact" id="contact" aria-labelledby="contact-title">
    <div className="container od-grid contact-grid" data-reveal>
      <div><p className="eyebrow section-label">CONTACT / YOUR NEXT PROJECT</p><h2 id="contact-title"><span>START WITH</span><span>ONE CLEAR</span><span>PRIORITY.</span></h2></div>
      <div className="od-stack contact-copy"><p>Tell me which task takes too much time or what your team needs to build. We can discuss a focused first project, including scope and budget.</p><a className="button button-primary" href="https://cal.com/sarthi">Discuss a project <svg className="icon" aria-hidden="true"><use href="#external"/></svg><span className="sr-only">on Cal.com</span></a><span className="booking-destination">cal.com/sarthi</span></div>
    </div>
  </section>
</main>

<footer className="site-footer">
  <div className="container footer-row">
    <a className="brand" href="#main" aria-label="Sarthi Borkar, return to top"><span className="brand-mark" aria-hidden="true"><span className="pixel-star"></span></span><span className="brand-word">sarthi<b>.</b></span></a>
    <div className="od-field footer-meta"><span>© 2026 Sarthi Borkar</span><span>AI solutions for business. Berlin.</span></div>
    <div className="od-cluster footer-links"><a className="text-link" href="https://github.com/Sarthib7">GitHub <svg className="icon" aria-hidden="true"><use href="#external"/></svg></a><a className="text-link" href="https://x.com/sarthib7" aria-label="Sarthi on X">X <svg className="icon" aria-hidden="true"><use href="#external"/></svg></a><a className="text-link" href="#main">Back to top <svg className="icon" aria-hidden="true"><use href="#arrow-up"/></svg></a></div>
  </div>
</footer>
    </>
  );
}
