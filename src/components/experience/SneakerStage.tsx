"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Html, useGLTF } from "@react-three/drei";

const MODEL_URL = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb";

function Shoe() {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} rotation={[0, -0.55, 0]} scale={8.4} position={[0, -0.25, 0]} />;
}

function Loader() {
  return <Html center><span className="stage-loader">Loading object</span></Html>;
}

export function SneakerStage() {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    setCanRender(Boolean(gl));
  }, []);

  if (!canRender) {
    return (
      <div className="stage-fallback" role="img" aria-label="Sneaker product experience unavailable on this device">
        <span>3D preview unavailable</span>
      </div>
    );
  }

  return (
    <div className="sneaker-stage" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.3, 4.5], fov: 34 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 5, 5]} intensity={2.5} />
        <directionalLight position={[-4, 2, -2]} intensity={1.25} />
        <Suspense fallback={<Loader />}>
          <Shoe />
          <Environment preset="studio" />
          <ContactShadows position={[0, -1.05, 0]} opacity={0.28} scale={7} blur={2.4} far={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
