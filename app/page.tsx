'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current!;
    const bar = barRef.current!;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFAF6EB);
    
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.set(5,2.6,5.2);
    
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

    // LIGHTS - bright luxury
    scene.add(new THREE.AmbientLight(0xffffff,1.15));
    scene.add(new THREE.HemisphereLight(0xFFF8E3, 0xE8D5A5, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff,0.9);
    sun.position.set(4,6,3);
    scene.add(sun);

    const house = new THREE.Group();
    scene.add(house);

    const cream = new THREE.MeshStandardMaterial({color:0xFFF6DE, roughness:0.65, metalness:0.04});
    const cream2 = new THREE.MeshStandardMaterial({color:0xF5EAC8, roughness:0.6});
    const brass = new THREE.MeshStandardMaterial({color:0xD6B07A, roughness:0.32, metalness:0.65});

    function box(w:number,h:number,d:number,mat:any,x:number,y:number,z:number){
      const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
      m.position.set(x,y,z);
      m.scale.y = 0.001;
      m.position.y -= h/2;
      house.add(m);
      return m;
    }

    const base = box(4.6,0.5,3.2,brass,0,-0.7,0);
    const wallL = box(0.12,1.6,2.1,cream,-1.85,0,0);
    const wallR = box(0.12,1.6,2.1,cream,1.85,0,0);
    const wallB = box(3.8,1.6,0.12,cream,0,0,-1.05);
    const block1 = box(1.2,0.95,1.0,cream2,-0.9,0,0.55);
    const block2 = box(1.3,1.15,1.1,cream,1.0,0,0.45);
    const blockMid = box(0.9,0.7,0.9,cream2,-0.7,0,0.1);
    const roof = box(4.1,0.28,2.9,cream2,0,0,0);
    roof.scale.y = 1;
    roof.position.y = 4;

    const dustG = new THREE.BufferGeometry();
    const N=140; const p = new Float32Array(N*3);
    for(let i=0;i<N*3;i++) p[i]=(Math.random()-0.5)*9;
    dustG.setAttribute('position', new THREE.BufferAttribute(p,3));
    const dust = new THREE.Points(dustG, new THREE.PointsMaterial({color:0xFFD98A,size:0.055,transparent:true,opacity:0.75}));
    house.add(dust);

    const tl = gsap.timeline({
      scrollTrigger:{
        trigger:".spacer",
        start:"top top",
        end:"bottom bottom",
        scrub:1.2,
        onUpdate:(s:any)=>{ if(bar) bar.style.width=(s.progress*100)+"%"; }
      }
    });

    tl.to(base.scale,{y:1,duration:1,ease:"power2.out"},0)
      .to(base.position,{y:-0.45,duration:1},0)
      .to([wallL.scale,wallR.scale,wallB.scale],{y:1,duration:1.2,stagger:0.1,ease:"power2.out"},0.4)
      .to([wallL.position,wallR.position,wallB.position],{y:0.8,duration:1.2,stagger:0.1},0.4)
      .to([block1.scale,block2.scale,blockMid.scale],{y:1,duration:1,stagger:0.15,ease:"back.out(1)"},1.0)
      .to([block1.position,block2.position,blockMid.position],{y:0.55,duration:1,stagger:0.15},1.0)
      .to(roof.position,{y:1.75,duration:1.2,ease:"power3.inOut"},1.8)
      .to(house.rotation,{y:Math.PI*0.15,duration:1},2.2);

    let mx=0;
    const onMouse = (e:MouseEvent)=>{ mx=(e.clientX/window.innerWidth-0.5); };
    window.addEventListener('mousemove', onMouse);

    let raf=0;
    const render = () => {
      raf = requestAnimationFrame(render);
      house.rotation.y+= (mx*0.5 - house.rotation.y*0.01)*0.02;
      house.position.y=Math.sin(Date.now()*0.0005)*0.04;
      dust.rotation.y+=0.0008;
      camera.lookAt(0,0.6,0);
      renderer.render(scene,camera);
    };
    render();

    const onResize = ()=>{ camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight); };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      ScrollTrigger.getAll().forEach(t=>t.kill());
      tl.kill();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,100;6..96,600&family=Instrument+Serif:ital@0;1&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#FAF6EB;color:#121212;font-family:Inter,sans-serif;overscroll-behavior:none}
      `}</style>
      <div ref={barRef} style={{position:'fixed',top:0,left:0,height:2,background:'#C8A96A',zIndex:20,width:0}} />
      <canvas ref={canvasRef} id="webgl" style={{position:'fixed',inset:0,width:'100%',height:'100vh',zIndex:0}} />
      
      <nav style={{position:'fixed',top:0,width:'100%',zIndex:10,padding:'20px 36px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(250,246,235,.85)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(200,169,106,.2)'}}>
        <div style={{fontFamily:'Bodoni Moda',letterSpacing:8,fontSize:11,fontWeight:600}}>AUREA <span style={{fontFamily:'Instrument Serif',fontStyle:'italic',letterSpacing:1,color:'#C8A96A',marginLeft:8,textTransform:'none',fontSize:12}}>Architecture Atelier</span></div>
        <a href="#" style={{border:'1px solid #121212',padding:'10px 18px',fontSize:8,letterSpacing:4,textTransform:'uppercase',textDecoration:'none',color:'#121212'}}>Portfolio</a>
      </nav>

      <div className="hero" style={{position:'relative',zIndex:2,width:'100%',height:'100vh',pointerEvents:'none'}}>
        <div style={{position:'absolute',left:44,bottom:48,maxWidth:480}}>
          <h1 style={{fontFamily:'Bodoni Moda',fontSize:'clamp(48px,6vw,78px)',lineHeight:.85,fontWeight:100,letterSpacing:-1}}>We don't build<br/>houses.<br/><i style={{fontFamily:'Instrument Serif',fontStyle:'italic',color:'#C8A96A',display:'block'}}>We craft legacies.</i></h1>
          <div style={{marginTop:24,fontSize:9,letterSpacing:5,textTransform:'uppercase',opacity:.5,display:'flex',gap:10,alignItems:'center'}}><span style={{width:40,height:1,background:'#C8A96A',display:'inline-block'}}/>Scroll to build the house — swipe up/down</div>
        </div>
      </div>
      <div className="spacer" style={{height:'350vh'}} />
      <div style={{position:'relative',zIndex:2,background:'#FAF6EB',padding:'100px 44px',borderTop:'1px solid rgba(200,169,106,.2)'}}>
        <h2 style={{fontFamily:'Bodoni Moda',fontSize:48,fontWeight:100,lineHeight:.9,maxWidth:600}}>From <i style={{fontFamily:'Instrument Serif',fontStyle:'italic',color:'#C8A96A'}}>foundation</i> to <i style={{fontFamily:'Instrument Serif',fontStyle:'italic',color:'#C8A96A'}}>roof</i> — built on scroll.</h2>
        <p style={{marginTop:20,opacity:.5,lineHeight:1.7,maxWidth:400,fontSize:13}}>No iframe now. 100% Next.js + Three.js + GSAP. Full stack pro.</p>
      </div>
    </>
  );
}
