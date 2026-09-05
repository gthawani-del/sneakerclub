"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, useGLTF } from "@react-three/drei";
import type { Group } from "three";

const MODEL_URL = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb";

function Shoe({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useGLTF(MODEL_URL);
  const { size } = useThree();
  const group = useRef<Group>(null);
  const mobile = size.width <= 768;

  useFrame(({ pointer }, delta) => {
    if (!group.current || reducedMotion) return;
    const response = Math.min(delta * 3.2, 1);
    const targetY = -0.5 + pointer.x * (mobile ? 0.07 : 0.13);
    const targetX = pointer.y * (mobile ? 0.02 : 0.035);
    group.current.rotation.y += (targetY - group.current.rotation.y) * response;
    group.current.rotation.x += (targetX - group.current.rotation.x) * response;
  });

  return (
    <group ref={group} rotation={[0, -0.5, mobile ? -0.035 : 0]}>
      <primitive
        object={scene}
        scale={mobile ? 3.15 : 5.35}
        position={mobile ? [0, -0.15, 0] : [0.15, -0.12, 0]}
      />
    </group>
  );
}

function Loader() { return <Html center><span className="stage-loader">Loading object</span></Html>; }

export function SneakerStage() {
  const [canRender, setCanRender] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    setCanRender(Boolean(gl));
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  if (canRender === null) return <div className="stage-fallback" aria-hidden="true" />;
  if (!canRender) return <div className="stage-fallback" role="img" aria-label="Sneaker product experience unavailable on this device"><span>3D preview unavailable</span></div>;

  return (
    <div className="sneaker-stage" aria-hidden="true">
      <Canvas camera={{ position:[0,0.15,5.25], fov:32 }} dpr={[1,1.5]} frameloop={reducedMotion ? "demand" : "always"} gl={{ antialias:true, alpha:true, powerPreference:"high-performance" }}>
        <ambientLight intensity={0.62} />
        <directionalLight position={[4,5,5]} intensity={2.15} />
        <directionalLight position={[-4,2,-2]} intensity={1.05} />
        <Suspense fallback={<Loader />}>
          <Shoe reducedMotion={reducedMotion} />
          <Environment preset="studio" />
          <ContactShadows position={[0,-.78,0]} opacity={0.18} scale={6} blur={2.8} far={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
