import dynamic from "next/dynamic";

const CinematicStory = dynamic(() => import("@/components/experience/CinematicStory").then((m) => m.CinematicStory));

export default function Home() {
  return (
    <main id="main-content">
      <header className="site-header site-header-fixed">
        <a className="wordmark" href="#main-content" aria-label="Sneakerclub home">SNEAKERCLUB</a>
        <nav className="primary-nav" aria-label="Primary navigation"><a href="#form-details">New</a><a href="#collection">Collection</a><a href="#about">About</a></nav>
        <a className="bag-link" href="#bag" aria-label="Shopping bag, empty">Bag <span>0</span></a>
      </header>

      <CinematicStory />

      <section className="product-intro" id="form-details" aria-labelledby="form-details-title">
        <div className="section-index">01 — FORM</div>
        <div className="intro-grid">
          <h2 id="form-details-title">Designed around movement.</h2>
          <div className="intro-copy">
            <p>FORM 001 balances a technical knit upper, structured support and a sculpted sole in one restrained everyday silhouette.</p>
            <dl className="spec-list"><div><dt>Upper</dt><dd>Engineered knit</dd></div><div><dt>Midsole</dt><dd>Sculpted foam</dd></div><div><dt>Outsole</dt><dd>Segmented rubber</dd></div></dl>
          </div>
        </div>
      </section>
      <section className="collection-tease" id="collection" aria-labelledby="collection-title"><p className="section-index">02 — COLLECTION</p><h2 id="collection-title">One system.<br/>More forms coming.</h2></section>
      <section className="brand-note" id="about" aria-labelledby="about-title"><p className="section-index">03 — SNEAKERCLUB</p><h2 id="about-title">Less noise.<br/>Better objects.</h2></section>
      <div id="bag" hidden />
    </main>
  );
}
