import { SneakerStageLoader } from "@/components/experience/SneakerStageLoader";

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Sneakerclub</p>
          <h1 id="hero-title"><span>FORM</span> <strong>001</strong></h1>
          <p className="tagline">Built for a brighter kind of motion.</p>
          <p className="lede">A modern sneaker designed for all-day comfort, effortless style and a more conscious tomorrow.</p>
          <a className="hero-cta" href="#form-details">Explore FORM 001 <span aria-hidden="true">→</span></a>
        </div>
        <SneakerStageLoader />
        <p className="scroll-cue" aria-hidden="true">Scroll to explore</p>
      </section>

      <section className="product-intro" id="form-details" aria-labelledby="form-details-title">
        <h2 id="form-details-title">FORM 001</h2>
        <p>One silhouette. Engineered around comfort, proportion and everyday movement.</p>
      </section>
    </main>
  );
}
