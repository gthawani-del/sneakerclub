"use client";

import dynamic from "next/dynamic";

const SneakerStage = dynamic(
  () => import("./SneakerStage").then((module) => module.SneakerStage),
  {
    ssr: false,
    loading: () => <div className="stage-fallback" aria-hidden="true" />,
  },
);

export function SneakerStageLoader() {
  return <SneakerStage />;
}
