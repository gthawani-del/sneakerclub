"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, TrackballControls, useGLTF } from "@react-three/drei";
import { Box3, BufferGeometry, Mesh, MeshPhysicalMaterial, Vector3 } from "three";
import type { TrackballControls as TrackballControlsImpl } from "three-stdlib";

const MODEL_URL = "/models/Meshy_AI_White_Runner_with_Cop_0905123346_generate.glb";

function Shoe() {
  const { scene } = useGLTF(MODEL_URL);
  const { size } = useThree();
  const mobile = size.width <= 768;

  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new Box3().setFromObject(clone);
    const center = bounds.getCenter(new Vector3());
    const dimensions = bounds.getSize(new Vector3());
    const longest = Math.max(dimensions.x, dimensions.y, dimensions.z) || 1;

    clone.position.sub(center);
    clone.scale.setScalar(3.2 / longest);
    clone.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const geometry = object.geometry as BufferGeometry;
      if (!geometry.getAttribute("normal")) geometry.computeVertexNormals();
      object.castShadow = true;
      object.receiveShadow = true;
      object.material = new MeshPhysicalMaterial({
        color: "#e9e5da",
        roughness: 0.62,
        metalness: 0,
        clearcoat: 0.025,
        clearcoatRoughness: 0.88,
        envMapIntensity: 0.72,
      });
    });
    return clone;
  }, [scene]);

  return (
    <primitive
      object={prepared}
      scale={mobile ? 1.02 : 1.18}
      position={mobile ? [0, -0.05, 0] : [0.08, -0.04, 0]}
      rotation={[mobile ? -0.04 : -0.02, -0.35, 0]}
    />
  );
}

function ProductControls() {
  const controls = useRef<TrackballControlsImpl>(null);
  const { gl } = useThree();

  useEffect(() => {
    const element = gl.domElement;
    element.style.touchAction = "pan-y";
    return () => {
      element.style.touchAction = "";
    };
  }, [gl]);

  return (
    <TrackballControls
      ref={controls}
      makeDefault
      noPan
      noZoom
      rotateSpeed={2.2}
      dynamicDampingFactor={0.16}
      staticMoving={false}
    />
  );
}

function Loader() {
  return <Html center><span className="stage-loader">Loading FORM 001</span></Html>;
}

export function SneakerStage() {
  const [canRender, setCanRender] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    setCanRender(Boolean(gl));
  }, []);

  if (canRender === null) return <div className="stage-fallback" aria-hidden="true" />;
  if (!canRender) return <div className="stage-fallback" role="img" aria-label="Sneaker product experience unavailable on this device"><span>3D preview unavailable</span></div>;

  return (
    <div className="sneaker-stage" aria-label="Interactive 3D view of FORM 001 sneaker. Drag freely to inspect every angle.">
      <Canvas
        camera={{ position: [0, 0.12, 5], fov: 30 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.42} />
        <hemisphereLight args={["#f6f1e8", "#14171b", 1.05]} />
        <directionalLight position={[4, 5, 5]} intensity={2.45} />
        <directionalLight position={[-4, 2, 2]} intensity={1.35} />
        <directionalLight position={[0, -3, 2]} intensity={0.48} />
        <Suspense fallback={<Loader />}>
          <Shoe />
          <Environment preset="studio" environmentIntensity={0.7} />
          <ContactShadows position={[0, -0.78, 0]} opacity={0.24} scale={5} blur={2.5} far={4} />
          <ProductControls />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
