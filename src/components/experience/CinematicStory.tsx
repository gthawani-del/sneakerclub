"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Box3, BufferGeometry, Group, Mesh, MeshPhysicalMaterial, PerspectiveCamera, Vector3 } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const MODEL_URL = "/models/Meshy_AI_White_Runner_with_Cop_0905123346_generate.glb";

type RigState = { rx:number; ry:number; rz:number; x:number; y:number; z:number; camX:number; camY:number; camZ:number };

function Shoe({ state }: { state: React.MutableRefObject<RigState> }) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<Group>(null);
  const { camera } = useThree();
  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new Box3().setFromObject(clone);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    clone.position.sub(center);
    clone.scale.setScalar(2.45 / (Math.max(size.x,size.y,size.z) || 1));
    clone.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const geometry = object.geometry as BufferGeometry;
      if (!geometry.getAttribute("normal")) geometry.computeVertexNormals();
      object.material = new MeshPhysicalMaterial({ color:"#e9e5da", roughness:.62, metalness:0, clearcoat:.025, clearcoatRoughness:.88, envMapIntensity:.72 });
    });
    return clone;
  }, [scene]);

  useFrame(() => {
    if (!group.current) return;
    const s = state.current;
    group.current.rotation.set(s.rx,s.ry,s.rz);
    group.current.position.set(s.x,s.y,s.z);
    camera.position.set(s.camX,s.camY,s.camZ);
    camera.lookAt(0,0,0);
    (camera as PerspectiveCamera).updateProjectionMatrix();
  });
  return <group ref={group}><primitive object={prepared} /></group>;
}

export function CinematicStory() {
  const root = useRef<HTMLDivElement>(null);
  const state = useRef<RigState>({ rx:-.04, ry:-.48, rz:0, x:0, y:.55, z:0, camX:0, camY:.08, camZ:7.4 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches || !root.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const initial: RigState = mobile
      ? { rx:-.04, ry:-.48, rz:0, x:0, y:.62, z:0, camX:0, camY:.08, camZ:8.2 }
      : { rx:-.04, ry:-.48, rz:0, x:.35, y:.18, z:0, camX:0, camY:.08, camZ:6.25 };
    Object.assign(state.current, initial);

    const labels = gsap.utils.toArray<HTMLElement>(".story-label", root.current);
    gsap.set(labels, { autoAlpha:0, y:24 });
    if (labels[0]) gsap.set(labels[0], { autoAlpha:1, y:0 });

    const lenis = new Lenis({ duration:1.05, smoothWheel:true });
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const tick = (time:number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const poses = mobile ? [
      initial,
      { ...initial, ry:0, y:.52, camZ:7.9 },
      { ...initial, ry:-.22, rx:-.3, y:.42, camZ:6.75 },
      { ...initial, ry:-2.45, rx:-.08, y:.5, camZ:7.65 },
      { ...initial, ry:-.15, rx:1.05, y:.52, camZ:7.55 },
      { ...initial, ry:-.52, rx:-.05, y:.58, camZ:8.1 },
    ] : [
      initial,
      { ...initial, ry:0, y:.12, camZ:6.05 },
      { ...initial, ry:-.2, rx:-.28, y:.05, camZ:5.25 },
      { ...initial, ry:-2.45, rx:-.06, y:.1, camZ:5.85 },
      { ...initial, ry:-.12, rx:1.12, y:.14, camZ:5.9 },
      { ...initial, ry:-.52, rx:-.04, y:.16, camZ:6.2 },
    ];

    const tl = gsap.timeline({
      defaults:{ ease:"none" },
      scrollTrigger:{ trigger:root.current, start:"top top", end:"bottom bottom", scrub:true, invalidateOnRefresh:true }
    });

    poses.slice(1).forEach((pose, index) => {
      const chapter = index + 1;
      tl.to(state.current, { ...pose, duration:1 }, chapter - 1);
      const previous = labels[chapter - 1];
      const current = labels[chapter];
      if (previous) tl.to(previous, { autoAlpha:0, y:-18, duration:.16 }, chapter - .82);
      if (current) tl.fromTo(current, { autoAlpha:0, y:24 }, { autoAlpha:1, y:0, duration:.18 }, chapter - .58);
    });

    ScrollTrigger.refresh();
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={root} className={`cinematic-story${reduced ? " is-reduced" : ""}`}>
      <div className="cinematic-sticky">
        <Canvas camera={{ position:[0,.08,7.4], fov:30 }} dpr={[1,1.5]} gl={{ antialias:true, alpha:true, powerPreference:"high-performance" }}>
          <ambientLight intensity={.45}/><hemisphereLight args={["#f6f1e8","#14171b",1.05]}/><directionalLight position={[4,5,5]} intensity={2.4}/><directionalLight position={[-4,2,2]} intensity={1.2}/>
          <Suspense fallback={null}><Shoe state={state}/><Environment preset="studio" environmentIntensity={.7}/></Suspense>
        </Canvas>
        <div className="story-copy" aria-live="off">
          <div className="story-label story-label-hero"><p>Sneakerclub / 001</p><h1><span>FORM</span> <strong>001</strong></h1><p className="tagline">Built for a brighter kind of motion.</p></div>
          <div className="story-label"><p>01 / Profile</p><h2>Engineered comfort.</h2></div>
          <div className="story-label"><p>02 / Upper</p><h2>Engineered knit.</h2></div>
          <div className="story-label"><p>03 / Structure</p><h2>Structured support.</h2></div>
          <div className="story-label"><p>04 / Outsole</p><h2>Built for movement.</h2></div>
        </div>
        <p className="story-scroll" aria-hidden="true">Scroll to explore</p>
      </div>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
