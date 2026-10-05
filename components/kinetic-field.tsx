'use client';
import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

/** Live geometric ribbons: the surface itself evolves, rather than spinning a model. */
export default function KineticField({enabled}:{enabled:boolean}){
 const host=useRef<HTMLDivElement>(null),play=useRef(enabled);
 useEffect(()=>{play.current=enabled},[enabled]);
 useEffect(()=>{
  const el=host.current;if(!el)return;
  let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:window.innerWidth>700,powerPreference:'high-performance'});}catch{return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(0,0,11);
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
  scene.add(new THREE.AmbientLight(0x5377ff,2));const key=new THREE.DirectionalLight(0xffffff,6);key.position.set(-3,5,4);scene.add(key);const blue=new THREE.PointLight(0x1639ff,80);blue.position.set(3,1,3);scene.add(blue);
  const group=new THREE.Group();scene.add(group);const meshes:THREE.Mesh[]=[],materials:THREE.MeshPhysicalMaterial[]=[],geometries:THREE.BufferGeometry[]=[];
  const n=180,w=8;
  for(let r=0;r<5;r++){
   const pos=new Float32Array((n+1)*(w+1)*3),indices:number[]=[];
   for(let i=0;i<n;i++)for(let j=0;j<w;j++){const a=i*(w+1)+j,b=a+w+1;indices.push(a,b,a+1,b,b+1,a+1);}
   const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(pos,3).setUsage(THREE.DynamicDrawUsage));geometry.setIndex(indices);
   const material=new THREE.MeshPhysicalMaterial({color:r%2?0x174aff:0xbfcfff,metalness:.98,roughness:.13,clearcoat:1,clearcoatRoughness:.05,side:THREE.DoubleSide,envMapIntensity:2.2});
   const mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;group.add(mesh);meshes.push(mesh);materials.push(material);geometries.push(geometry);
  }
  const stars=new Float32Array(400*3);for(let i=0;i<400;i++){stars[i*3]=(Math.random()-.5)*23;stars[i*3+1]=(Math.random()-.5)*15;stars[i*3+2]=-Math.random()*18;}
  const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(stars,3));const starMat=new THREE.PointsMaterial({color:0x94b9ff,size:.017,transparent:true,opacity:.55});const points=new THREE.Points(starGeo,starMat);scene.add(points);
  let frame=0,t=0,last=performance.now(),mx=0,my=0,visible=true,drawn=false;const move=(e:PointerEvent)=>{mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2;};window.addEventListener('pointermove',move,{passive:true});
  const resize=()=>{camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight);drawn=false;};resize();const ro=new ResizeObserver(resize);ro.observe(el);const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});io.observe(el);
  const animate=(now:number)=>{frame=requestAnimationFrame(animate);const delta=Math.min((now-last)/1000,.04);last=now;if(!visible||document.hidden||(!play.current&&drawn))return;if(play.current)t+=delta;
   meshes.forEach((mesh,r)=>{const a=mesh.geometry.attributes.position as THREE.BufferAttribute;const shift=r*.47;for(let i=0;i<=n;i++){const u=i/n*Math.PI*2.25-Math.PI*1.12;for(let j=0;j<=w;j++){const v=(j/w-.5)*(.6+r*.065),twist=u*1.6+t*.35+shift;const radius=2.35+Math.sin(u*2+t*.65+shift)*.62+r*.17;const x=Math.sin(u)*radius+v*Math.cos(twist),y=Math.cos(u)*radius*.55+Math.sin(u*1.8+t*.5+shift)*.6+v*Math.sin(twist),z=Math.sin(u*1.3+t*.28+shift)*1.65+Math.cos(twist)*v;a.setXYZ(i*(w+1)+j,x,y,z);}}a.needsUpdate=true;mesh.geometry.computeVertexNormals();});
   const scroll=Math.min(window.scrollY/innerHeight,2);group.rotation.z=-.55+Math.sin(t*.19)*.28+scroll*.7;group.rotation.y=Math.sin(t*.21)*.65+mx*.22;group.rotation.x=Math.cos(t*.17)*.26+my*.12;group.scale.setScalar(innerWidth<650?1.15:1.45);group.position.y=-scroll*.85;
   camera.position.x+=(mx*.55-camera.position.x)*.025;camera.position.y+=(-my*.35-camera.position.y)*.025;camera.position.z=11-scroll*1.4;camera.lookAt(0,0,0);points.rotation.z=t*.012;renderer.render(scene,camera);drawn=true;
  };frame=requestAnimationFrame(animate);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);ro.disconnect();io.disconnect();geometries.forEach(x=>x.dispose());materials.forEach(x=>x.dispose());starGeo.dispose();starMat.dispose();env.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div className="kinetic-field" ref={host} aria-hidden="true"/>;
}
