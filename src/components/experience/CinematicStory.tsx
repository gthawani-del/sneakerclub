"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Box3, BufferGeometry, Group, MathUtils, Mesh, MeshPhysicalMaterial, PerspectiveCamera, Vector3 } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const MODEL_URL = "/models/Meshy_AI_White_Runner_with_Cop_0905123346_generate.glb";

type RigState = { rx:number; ry:number; rz:number; x:number; y:number; z:number; camX:number; camY:number; camZ:number };
type StoryProfile = { initial: RigState; profile: RigState };

const MOBILE_PROFILE: StoryProfile = {
  initial:{ rx:-.04, ry:-.48, rz:0, x:0, y:.62, z:0, camX:0, camY:.08, camZ:8.2 },
  profile:{ rx:-.015, ry:0, rz:0, x:0, y:.54, z:0, camX:0, camY:.06, camZ:7.95 },
};
const DESKTOP_PROFILE: StoryProfile = {
  initial:{ rx:-.04, ry:-.48, rz:0, x:.35, y:.18, z:0, camX:0, camY:.08, camZ:6.25 },
  profile:{ rx:-.015, ry:0, rz:0, x:.35, y:.13, z:0, camX:0, camY:.06, camZ:6.05 },
};

function getProfile(): StoryProfile {
  if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) return MOBILE_PROFILE;
  return DESKTOP_PROFILE;
}

function copyRig(source: RigState): RigState { return { ...source }; }

function Shoe({ target, current, onReady }: { target: React.MutableRefObject<RigState>; current: React.MutableRefObject<RigState>; onReady: () => void }) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<Group>(null);
  const { camera } = useThree();
  const announced = useRef(false);
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

  useFrame((_, delta) => {
    if (!group.current) return;
    const t = target.current;
    const c = current.current;
    const rotationDamp = 7.2;
    const positionDamp = 6.4;
    const cameraDamp = 5.8;
    c.rx = MathUtils.damp(c.rx,t.rx,rotationDamp,delta); c.ry = MathUtils.damp(c.ry,t.ry,rotationDamp,delta); c.rz = MathUtils.damp(c.rz,t.rz,rotationDamp,delta);
    c.x = MathUtils.damp(c.x,t.x,positionDamp,delta); c.y = MathUtils.damp(c.y,t.y,positionDamp,delta); c.z = MathUtils.damp(c.z,t.z,positionDamp,delta);
    c.camX = MathUtils.damp(c.camX,t.camX,cameraDamp,delta); c.camY = MathUtils.damp(c.camY,t.camY,cameraDamp,delta); c.camZ = MathUtils.damp(c.camZ,t.camZ,cameraDamp,delta);
    group.current.rotation.set(c.rx,c.ry,c.rz);
    group.current.position.set(c.x,c.y,c.z);
    camera.position.set(c.camX,c.camY,c.camZ);
    camera.lookAt(0,0,0);
    (camera as PerspectiveCamera).updateProjectionMatrix();
    if (!announced.current) { announced.current = true; requestAnimationFrame(onReady); }
  });
  return <group ref={group}><primitive object={prepared} /></group>;
}

export function CinematicStory() {
  const root = useRef<HTMLDivElement>(null);
  const profileRef = useRef<StoryProfile>(DESKTOP_PROFILE);
  const target = useRef<RigState>(copyRig(DESKTOP_PROFILE.initial));
  const current = useRef<RigState>(copyRig(DESKTOP_PROFILE.initial));
  const progress = useRef({ value:0 });
  const [reduced, setReduced] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    profileRef.current = profile;
    target.current = copyRig(profile.initial);
    current.current = copyRig(profile.initial);
    setProfileReady(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches || !root.current || !profileReady) return;

    gsap.registerPlugin(ScrollTrigger);
    const labels = gsap.utils.toArray<HTMLElement>(".story-label", root.current);
    gsap.set(labels, { autoAlpha:0, y:18 });
    if (labels[0]) gsap.set(labels[0], { autoAlpha:1, y:0 });

    const lenis = new Lenis({ duration:.92, smoothWheel:true });
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const tick = (time:number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const profile = profileRef.current;
    const applyProgress = (p:number) => {
      progress.current.value = p;
      const moveStart=.08, moveEnd=.34;
      const local = MathUtils.clamp((p-moveStart)/(moveEnd-moveStart),0,1);
      const eased = local*local*(3-2*local);
      const a=profile.initial,b=profile.profile,t=target.current;
      t.rx=MathUtils.lerp(a.rx,b.rx,eased); t.ry=MathUtils.lerp(a.ry,b.ry,eased); t.rz=MathUtils.lerp(a.rz,b.rz,eased);
      t.x=MathUtils.lerp(a.x,b.x,eased); t.y=MathUtils.lerp(a.y,b.y,eased); t.z=MathUtils.lerp(a.z,b.z,eased);
      t.camX=MathUtils.lerp(a.camX,b.camX,eased); t.camY=MathUtils.lerp(a.camY,b.camY,eased); t.camZ=MathUtils.lerp(a.camZ,b.camZ,eased);

      const heroOpacity = 1 - MathUtils.clamp((p-.16)/.07,0,1);
      const profileOpacity = MathUtils.clamp((p-.25)/.08,0,1) * (1-MathUtils.clamp((p-.48)/.08,0,1));
      if (labels[0]) gsap.set(labels[0], { autoAlpha:heroOpacity, y:-10*(1-heroOpacity) });
      if (labels[1]) gsap.set(labels[1], { autoAlpha:profileOpacity, y:18*(1-profileOpacity) });
      for (let i=2;i<labels.length;i++) gsap.set(labels[i], { autoAlpha:0 });
    };

    const trigger = ScrollTrigger.create({
      trigger:root.current,
      start:"top top",
      end:"bottom bottom",
      scrub:true,
      invalidateOnRefresh:true,
      onUpdate:self => applyProgress(self.progress),
    });
    applyProgress(trigger.progress);
    ScrollTrigger.refresh();
    return () => { trigger.kill(); gsap.ticker.remove(tick); lenis.off("scroll",onScroll); lenis.destroy(); };
  }, [profileReady]);

  const canvasCamera = profileReady ? profileRef.current.initial : DESKTOP_PROFILE.initial;

  return (
    <div ref={root} className={`cinematic-story cinematic-story-foundation${sceneReady ? " is-scene-ready" : ""}${reduced ? " is-reduced" : ""}`}>
      <div className="cinematic-sticky">
        {profileReady && <div className="cinematic-canvas-wrap">
          <Canvas camera={{ position:[canvasCamera.camX,canvasCamera.camY,canvasCamera.camZ], fov:30 }} dpr={[1,1.5]} gl={{ antialias:true, alpha:true, powerPreference:"high-performance" }}>
            <ambientLight intensity={.45}/><hemisphereLight args={["#f6f1e8","#14171b",1.05]}/><directionalLight position={[4,5,5]} intensity={2.4}/><directionalLight position={[-4,2,2]} intensity={1.2}/>
            <Suspense fallback={null}><Shoe target={target} current={current} onReady={() => setSceneReady(true)}/><Environment preset="studio" environmentIntensity={.7}/></Suspense>
          </Canvas>
        </div>}
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
