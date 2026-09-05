"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Box3, BufferGeometry, Group, MathUtils, Mesh, MeshPhysicalMaterial, PerspectiveCamera, Vector3 } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const MODEL_URL = "/models/Meshy_AI_White_Runner_with_Cop_0905123346_generate.glb";
type RigState={rx:number;ry:number;rz:number;x:number;y:number;z:number;camX:number;camY:number;camZ:number};
const M:RigState[]=[
{rx:-.04,ry:-.48,rz:0,x:0,y:.62,z:0,camX:0,camY:.08,camZ:8.2},
{rx:-.015,ry:0,rz:0,x:0,y:.54,z:0,camX:0,camY:.06,camZ:7.95},
{rx:-.30,ry:-.28,rz:-.02,x:0,y:.42,z:0,camX:.08,camY:.15,camZ:6.9},
{rx:-.08,ry:-2.35,rz:.02,x:0,y:.5,z:0,camX:-.08,camY:.08,camZ:7.65},
{rx:1.02,ry:-.18,rz:-.04,x:0,y:.48,z:0,camX:0,camY:.12,camZ:7.55},
{rx:-.05,ry:-.52,rz:0,x:0,y:.58,z:0,camX:0,camY:.08,camZ:8.1},
];
const D:RigState[]=[
{rx:-.04,ry:-.48,rz:0,x:.35,y:.18,z:0,camX:0,camY:.08,camZ:6.25},
{rx:-.015,ry:0,rz:0,x:.35,y:.13,z:0,camX:0,camY:.06,camZ:6.05},
{rx:-.26,ry:-.24,rz:-.02,x:.38,y:.05,z:0,camX:.12,camY:.16,camZ:5.25},
{rx:-.06,ry:-2.35,rz:.02,x:.34,y:.1,z:0,camX:-.12,camY:.08,camZ:5.85},
{rx:1.08,ry:-.14,rz:-.04,x:.3,y:.13,z:0,camX:0,camY:.14,camZ:5.9},
{rx:-.04,ry:-.52,rz:0,x:.35,y:.16,z:0,camX:0,camY:.08,camZ:6.2},
];
const copy=(s:RigState):RigState=>({...s});
const smooth=(v:number)=>v*v*(3-2*v);

function Shoe({target,current,onReady}:{target:React.MutableRefObject<RigState>;current:React.MutableRefObject<RigState>;onReady:()=>void}){
 const {scene}=useGLTF(MODEL_URL); const group=useRef<Group>(null); const {camera}=useThree(); const announced=useRef(false);
 const prepared=useMemo(()=>{const clone=scene.clone(true);const bounds=new Box3().setFromObject(clone);const center=bounds.getCenter(new Vector3());const size=bounds.getSize(new Vector3());clone.position.sub(center);clone.scale.setScalar(2.45/(Math.max(size.x,size.y,size.z)||1));clone.traverse(o=>{if(!(o instanceof Mesh))return;const g=o.geometry as BufferGeometry;if(!g.getAttribute("normal"))g.computeVertexNormals();o.material=new MeshPhysicalMaterial({color:"#e9e5da",roughness:.62,metalness:0,clearcoat:.025,clearcoatRoughness:.88,envMapIntensity:.72})});return clone},[scene]);
 useFrame((_,delta)=>{if(!group.current)return;const t=target.current,c=current.current;c.rx=MathUtils.damp(c.rx,t.rx,7.2,delta);c.ry=MathUtils.damp(c.ry,t.ry,7.2,delta);c.rz=MathUtils.damp(c.rz,t.rz,7.2,delta);c.x=MathUtils.damp(c.x,t.x,6.4,delta);c.y=MathUtils.damp(c.y,t.y,6.4,delta);c.z=MathUtils.damp(c.z,t.z,6.4,delta);c.camX=MathUtils.damp(c.camX,t.camX,5.8,delta);c.camY=MathUtils.damp(c.camY,t.camY,5.8,delta);c.camZ=MathUtils.damp(c.camZ,t.camZ,5.8,delta);group.current.rotation.set(c.rx,c.ry,c.rz);group.current.position.set(c.x,c.y,c.z);camera.position.set(c.camX,c.camY,c.camZ);camera.lookAt(0,0,0);(camera as PerspectiveCamera).updateProjectionMatrix();if(!announced.current){announced.current=true;requestAnimationFrame(onReady)}});
 return <group ref={group}><primitive object={prepared}/></group>
}

export function CinematicStory(){
 const root=useRef<HTMLDivElement>(null);const target=useRef<RigState>(copy(D[0]));const current=useRef<RigState>(copy(D[0]));const poses=useRef<RigState[]>(D);const [ready,setReady]=useState(false);const [sceneReady,setSceneReady]=useState(false);const [reduced,setReduced]=useState(false);
 useEffect(()=>{const mobile=window.matchMedia("(max-width: 768px)").matches;poses.current=mobile?M:D;target.current=copy(poses.current[0]);current.current=copy(poses.current[0]);setReady(true)},[]);
 useEffect(()=>{const mq=window.matchMedia("(prefers-reduced-motion: reduce)");setReduced(mq.matches);if(mq.matches||!root.current||!ready)return;gsap.registerPlugin(ScrollTrigger);const labels=gsap.utils.toArray<HTMLElement>(".story-label",root.current);gsap.set(labels,{autoAlpha:0,y:18});if(labels[0])gsap.set(labels[0],{autoAlpha:1,y:0});const lenis=new Lenis({duration:.92,smoothWheel:true});const onScroll=()=>ScrollTrigger.update();lenis.on("scroll",onScroll);const tick=(time:number)=>lenis.raf(time*1000);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
 const stops=[0,.18,.39,.60,.79,1];const apply=(p:number)=>{let seg=0;while(seg<stops.length-2&&p>stops[seg+1])seg++;const span=stops[seg+1]-stops[seg];let local=MathUtils.clamp((p-stops[seg])/span,0,1);const hold=.14;if(local<hold)local=0;else if(local>1-hold)local=1;else local=(local-hold)/(1-2*hold);local=smooth(local);const a=poses.current[seg],b=poses.current[seg+1],t=target.current;for(const k of Object.keys(t) as (keyof RigState)[])t[k]=MathUtils.lerp(a[k],b[k],local);
 const centers=[0,.285,.495,.695,.895];labels.forEach((label,i)=>{const dist=Math.abs(p-centers[i]);const opacity=i===0?(1-MathUtils.clamp((p-.10)/.07,0,1)):MathUtils.clamp(1-dist/.105,0,1);gsap.set(label,{autoAlpha:opacity,y:14*(1-opacity)})});};
 const trigger=ScrollTrigger.create({trigger:root.current,start:"top top",end:"bottom bottom",invalidateOnRefresh:true,onUpdate:self=>apply(self.progress)});apply(trigger.progress);ScrollTrigger.refresh();return()=>{trigger.kill();gsap.ticker.remove(tick);lenis.off("scroll",onScroll);lenis.destroy()}},[ready]);
 const cam=ready?poses.current[0]:D[0];return <div ref={root} className={`cinematic-story${sceneReady?" is-scene-ready":""}${reduced?" is-reduced":""}`}><div className="cinematic-sticky">{ready&&<div className="cinematic-canvas-wrap"><Canvas camera={{position:[cam.camX,cam.camY,cam.camZ],fov:30}} dpr={[1,1.5]} gl={{antialias:true,alpha:true,powerPreference:"high-performance"}}><ambientLight intensity={.45}/><hemisphereLight args={["#f6f1e8","#14171b",1.05]}/><directionalLight position={[4,5,5]} intensity={2.4}/><directionalLight position={[-4,2,2]} intensity={1.2}/><Suspense fallback={null}><Shoe target={target} current={current} onReady={()=>setSceneReady(true)}/><Environment preset="studio" environmentIntensity={.7}/></Suspense></Canvas></div>}<div className="story-copy" aria-live="off"><div className="story-label story-label-hero"><p>Sneakerclub / 001</p><h1><span>FORM</span> <strong>001</strong></h1><p className="tagline">Built for a brighter kind of motion.</p></div><div className="story-label"><p>01 / Profile</p><h2>Engineered comfort.</h2></div><div className="story-label"><p>02 / Upper</p><h2>Engineered knit.</h2></div><div className="story-label"><p>03 / Structure</p><h2>Structured support.</h2></div><div className="story-label"><p>04 / Outsole</p><h2>Built for movement.</h2></div></div><p className="story-scroll" aria-hidden="true">Scroll to explore</p></div></div>
}
useGLTF.preload(MODEL_URL);
