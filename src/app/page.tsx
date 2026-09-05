import { SneakerStageLoader } from "@/components/experience/SneakerStageLoader";

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero" aria-labelledby="hero-title">
        <header className="site-header">
          <a className="wordmark" href="#main-content" aria-label="Sneakerclub home">SNEAKERCLUB</a>
          <nav className="primary-nav" aria-label="Primary navigation">
            <a href="#form-details">New</a>
            <a href="#collection">Collection</a>
            <a href="#about">About</a>
          </nav>
          <a className="bag-link" href="#bag" aria-label="Shopping bag, empty">Bag <span>0</span></a>
        </header>

        <div className="product-zone">
          <SneakerStageLoader />
          <p className="drag-cue" aria-hidden="true"><span>↔</span> Drag to inspect</p>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Sneakerclub / 001</p>
          <h1 id="hero-title"><span>FORM</span> <strong>001</strong></h1>
          <p className="tagline">Built for a brighter kind of motion.</p>
          <p className="lede">Technical comfort. Everyday proportion. An original silhouette designed to move without shouting.</p>
          <a className="hero-cta" href="#form-details">Explore FORM 001 <span aria-hidden="true">↘</span></a>
        </div>

        <p className="scroll-cue" aria-hidden="true">Scroll to explore</p>
      </section>

      <section className="product-intro" id="form-details" aria-labelledby="form-details-title">
        <div className="section-index">01 — FORM</div>
        <div className="intro-grid">
          <h2 id="form-details-title">Designed around movement.</h2>
          <div className="intro-copy">
            <p>FORM 001 balances a technical knit upper, structured support and a sculpted sole in one restrained everyday silhouette.</p>
            <dl className="spec-list">
              <div><dt>Upper</dt><dd>Engineered knit</dd></div>
              <div><dt>Midsole</dt><dd>Sculpted foam</dd></div>
              <div><dt>Outsole</dt><dd>Segmented rubber</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="collection-tease" id="collection" aria-labelledby="collection-title">
        <p className="section-index">02 — COLLECTION</p>
        <h2 id="collection-title">One system.<br />More forms coming.</h2>
      </section>

      <section className="brand-note" id="about" aria-labelledby="about-title">
        <p className="section-index">03 — SNEAKERCLUB</p>
        <h2 id="about-title">Less noise.<br />Better objects.</h2>
      </section>
      <div id="bag" hidden />
    </main>
  );
}
