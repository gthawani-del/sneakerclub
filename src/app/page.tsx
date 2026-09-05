import dynamic from "next/dynamic";

const SneakerStage = dynamic(
  () => import("@/components/experience/SneakerStage").then((module) => module.SneakerStage),
  { ssr: false, loading: () => <div className="stage-fallback" aria-hidden="true" /> },
);

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Sneakerclub / 001</p>
          <h1 id="hero-title">Form in motion.</h1>
          <p className="lede">A lightweight real-time product study. Static first; choreography comes next.</p>
        </div>
        <SneakerStage />
        <p className="asset-credit">Prototype shoe model © 2021 Shopify, CC BY 4.0.</p>
      </section>
    </main>
  );
}
