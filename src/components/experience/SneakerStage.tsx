"use client";

import { useEffect, useRef, useState } from "react";
import type { ModelViewerElement } from "@google/model-viewer";

const MODEL_URL = "/models/Meshy_AI_White_Runner_with_Cop_0905123346_generate.glb";

type ViewerProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  src: string;
  alt: string;
  loading?: "auto" | "lazy" | "eager";
  reveal?: "auto" | "interaction" | "manual";
  "camera-controls"?: boolean;
  "touch-action"?: string;
  "camera-orbit"?: string;
  "min-camera-orbit"?: string;
  "max-camera-orbit"?: string;
  "field-of-view"?: string;
  "min-field-of-view"?: string;
  "max-field-of-view"?: string;
  "interaction-prompt"?: string;
  "shadow-intensity"?: string;
  "shadow-softness"?: string;
  "environment-image"?: string;
  exposure?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ViewerProps;
    }
  }
}

export function SneakerStage() {
  const viewer = useRef<ModelViewerElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    import("@google/model-viewer").then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="sneaker-stage stage-fallback" aria-live="polite">
        <span className="stage-loader">Loading FORM 001</span>
      </div>
    );
  }

  return (
    <div className="sneaker-stage">
      <model-viewer
        ref={viewer as React.Ref<HTMLElement>}
        src={MODEL_URL}
        alt="Interactive 3D view of the Sneakerclub FORM 001 sneaker"
        loading="eager"
        reveal="auto"
        camera-controls
        touch-action="pan-y"
        camera-orbit="-70deg 72deg 105%"
        min-camera-orbit="auto 0deg 70%"
        max-camera-orbit="auto 180deg 160%"
        field-of-view="30deg"
        min-field-of-view="20deg"
        max-field-of-view="45deg"
        interaction-prompt="auto"
        shadow-intensity="0.8"
        shadow-softness="0.85"
        environment-image="neutral"
        exposure="1.05"
        style={{ width: "100%", height: "100%", background: "transparent" }}
      />
    </div>
  );
}
