"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, useGLTF } from "@react-three/drei";
import { Box3, Group, Mesh, MeshPhysicalMaterial, Vector3 } from "three";

const MODEL_URL = "/models/Meshy_AI_White_Runner_with_Cop_0905123346_generate.glb";

function Shoe({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useGLTF(MODEL_URL);
  const { size } = useThree();
  const group = useRef<Group>(null);
  const drag = useRef({ active: false, x: 0, yaw: -0.35 });
  const mobile = size.width <= 768;

  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new Box3().setFromObject(clone);
    const center = bounds.getCenter(new Vector3());
    const dimensions = bounds.getSize(new Vector3());
    const longest = Math.max(dimensions.x, dimensions.y, dimensions.z) || 1;
    const normalizedScale = 3.2 / longest;

    clone.position.sub(center);
    clone.scale.setScalar(normalizedScale);
    clone.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      object.material = new MeshPhysicalMaterial({
        color: "#e8e5dc",
        roughness: 0.48,
        metalness: 0.02,
        clearcoat: 0.08,
        clearcoatRoughness: 0.62,
      });
    });
    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (!group.current || reducedMotion) return;
    const response = Math.min(delta * 7, 1);
    group.current.rotation.y += (drag.current.yaw - group.current.rotation.y) * response;
  });

  const pointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (reducedMotion) return;
    event.stopPropagation();
    drag.current.active = true;
    drag.current.x = event.clientX;
    (event.target as Element).setPointerCapture?.(event.pointerId);
  };

  const pointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!drag.current.active || reducedMotion) return;
    const delta = event.clientX - drag.current.x;
    drag.current.x = event.clientX;
    drag.current.yaw += delta * 0.008;
  };

  const pointerUp = (event: ThreeEvent<PointerEvent>) => {
    drag.current.active = false;
    (event.target as Element).releasePointerCapture?.(event.pointerId);
  };

  return (
    <group ref={group} rotation={[mobile ? -0.04 : -0.02, -0.35, mobile ? -0.03 : 0]}>
      <primitive
        object={prepared}
        scale={mobile ? 1.02 : 1.18}
        position={mobile ? [0, -0.05, 0] : [0.08, -0.04, 0]}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
      />
    </group>
  );
}

function Loader() {
  return <Html center><span className="stage-loader">Loading FORM 001</span></Html>;
}

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
      <Canvas
        camera={{ position: [0, 0.12, 5], fov: 30 }}
        dpr={[1, 1.5]}
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.72} />
        <directionalLight position={[4, 5, 5]} intensity={2.4} />
        <directionalLight position={[-4, 2, 1]} intensity={1.25} />
        <Suspense fallback={<Loader />}>
          <Shoe reducedMotion={reducedMotion} />
          <Environment preset="studio" />
          <ContactShadows position={[0, -0.78, 0]} opacity={0.22} scale={5} blur={2.6} far={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
