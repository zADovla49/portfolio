import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface MedalCanvasProps {
  reducedMotion: boolean;
}

/**
 * Prestigious 3D Silver Medal Trophy Stage — Liberty Bell Judo Classic 2026 (Second Place).
 * Real-time PBR brushed & mirror sterling silver with dramatic overhead spotlight and interactive rotation.
 */
export const MedalCanvas: React.FC<MedalCanvasProps> = ({ reducedMotion }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setFallback(true);
      return;
    }

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 480;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 40);
    camera.position.set(0, 0.1, 6.0);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const envRT = pmrem.fromScene(envScene, 0.035);
    scene.environment = envRT.texture;
    envScene.dispose();

    // Dramatic Spotlight + Electric-Blue Rim Atmosphere
    const ambient = new THREE.AmbientLight('#091326', 0.65);
    scene.add(ambient);

    const topSpot = new THREE.SpotLight('#FFFFFF', 38, 18, Math.PI * 0.22, 0.65, 1.4);
    topSpot.position.set(1.2, 5.2, 4.4);
    scene.add(topSpot);

    const blueRim = new THREE.PointLight('#1E90FF', 14, 14, 1.5);
    blueRim.position.set(-3.4, 1.2, 2.2);
    scene.add(blueRim);

    const coolBackRim = new THREE.PointLight('#66B8FF', 11, 14, 1.5);
    coolBackRim.position.set(2.8, -2.0, -2.5);
    scene.add(coolBackRim);

    // Materials
    const mirrorSilver = new THREE.MeshPhysicalMaterial({
      color: '#EAF1FA',
      metalness: 1.0,
      roughness: 0.09,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2.1,
    });

    const brushedSilver = new THREE.MeshPhysicalMaterial({
      color: '#BCC8DA',
      metalness: 0.98,
      roughness: 0.26,
      clearcoat: 0.5,
      envMapIntensity: 1.55,
    });

    const darkAccentChrome = new THREE.MeshPhysicalMaterial({
      color: '#19253B',
      metalness: 0.92,
      roughness: 0.22,
      envMapIntensity: 1.3,
    });

    const navyRibbonMat = new THREE.MeshStandardMaterial({
      color: '#0A1936',
      metalness: 0.25,
      roughness: 0.58,
      side: THREE.DoubleSide,
    });

    const silverTrimMat = new THREE.MeshStandardMaterial({
      color: '#DCE6F5',
      metalness: 0.85,
      roughness: 0.25,
      side: THREE.DoubleSide,
    });

    const medalAssembly = new THREE.Group();
    medalAssembly.position.set(0, -0.22, 0);

    // 1. Main Sterling Silver Disc Core (aligned facing Z)
    const discGeo = new THREE.CylinderGeometry(1.36, 1.36, 0.16, 72);
    discGeo.rotateX(Math.PI / 2);
    const discMesh = new THREE.Mesh(discGeo, brushedSilver);
    medalAssembly.add(discMesh);

    // 2. Raised Beveled Outer Rim (Front & Back)
    const outerRim = new THREE.Mesh(new THREE.TorusGeometry(1.34, 0.075, 24, 96), mirrorSilver);
    outerRim.position.z = 0.06;
    const outerRimBack = outerRim.clone();
    outerRimBack.position.z = -0.06;
    medalAssembly.add(outerRim, outerRimBack);

    // 3. Inner Precision Concentric Rings + Subtle Dark Chrome Groove
    const midGroove = new THREE.Mesh(
      new THREE.TorusGeometry(1.12, 0.018, 16, 96),
      darkAccentChrome
    );
    midGroove.position.z = 0.082;
    const midGrooveBack = midGroove.clone();
    midGrooveBack.position.z = -0.082;

    const innerHalo = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.024, 16, 96), mirrorSilver);
    innerHalo.position.z = 0.085;
    const innerHaloBack = innerHalo.clone();
    innerHaloBack.position.z = -0.085;
    medalAssembly.add(midGroove, midGrooveBack, innerHalo, innerHaloBack);

    // 4. Sculpted Roman Numeral "II" (2nd Place Silver Honor) Relief on Both Faces
    const buildReliefFace = (zSign: number) => {
      const faceGroup = new THREE.Group();
      const barGeo = new THREE.BoxGeometry(0.16, 0.78, 0.07);
      const barLeft = new THREE.Mesh(barGeo, mirrorSilver);
      barLeft.position.set(-0.16, 0.02, zSign * 0.095);
      const barRight = new THREE.Mesh(barGeo, mirrorSilver);
      barRight.position.set(0.16, 0.02, zSign * 0.095);

      const capGeo = new THREE.BoxGeometry(0.62, 0.08, 0.075);
      const capTop = new THREE.Mesh(capGeo, mirrorSilver);
      capTop.position.set(0, 0.43, zSign * 0.098);
      const capBot = new THREE.Mesh(capGeo, mirrorSilver);
      capBot.position.set(0, -0.39, zSign * 0.098);

      // Precision radial hour/degree ticks (12 ceremonial markers)
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const tick = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.11, 0.04), mirrorSilver);
        tick.position.set(Math.cos(angle) * 1.0, Math.sin(angle) * 1.0, zSign * 0.085);
        tick.rotation.z = angle - Math.PI / 2;
        faceGroup.add(tick);
      }

      faceGroup.add(barLeft, barRight, capTop, capBot);
      return faceGroup;
    };

    medalAssembly.add(buildReliefFace(1), buildReliefFace(-1));

    // 5. Top Suspension Bail & Precision Clasp
    const claspMesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.16), mirrorSilver);
    claspMesh.position.set(0, 1.48, 0);
    const bailRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.036, 16, 48), mirrorSilver);
    bailRing.position.set(0, 1.64, 0);
    const ribbonBar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.78, 24), mirrorSilver);
    ribbonBar.rotation.z = Math.PI / 2;
    ribbonBar.position.set(0, 1.78, 0);
    medalAssembly.add(claspMesh, bailRing, ribbonBar);

    // 6. Sculptural Midnight-Navy & Silver-Edged V-Ribbon
    const createRibbonStrap = (dir: number) => {
      const strapGroup = new THREE.Group();
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.56, 1.85, 0.028), navyRibbonMat);
      const trimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.045, 1.85, 0.032), silverTrimMat);
      trimLeft.position.x = -0.255;
      const trimRight = new THREE.Mesh(new THREE.BoxGeometry(0.045, 1.85, 0.032), silverTrimMat);
      trimRight.position.x = 0.255;
      strapGroup.add(strap, trimLeft, trimRight);
      strapGroup.position.set(dir * 0.34, 2.55, -0.03 * dir);
      strapGroup.rotation.z = -dir * 0.24;
      return strapGroup;
    };
    medalAssembly.add(createRibbonStrap(-1), createRibbonStrap(1));

    scene.add(medalAssembly);

    // Subtle Spotlight Halo Floor / Atmospheric Particles
    const dustCount = 70;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 5;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: '#5CB3FF',
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Interactive Drag / Hover Rotation
    let isDragging = false;
    let prevX = 0;
    let userRotY = 0.32;
    let targetRotY = 0.32;
    let hoverX = 0;
    let hoverY = 0;

    const onDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      hoverX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      hoverY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      if (isDragging) {
        const dx = e.clientX - prevX;
        prevX = e.clientX;
        targetRotY += dx * 0.012;
      }
    };
    const onUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 460;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!isDragging && !reducedMotion) {
        targetRotY += 0.0045;
      }
      userRotY += (targetRotY - userRotY) * 0.08;

      medalAssembly.rotation.y = userRotY + hoverX * 0.18;
      medalAssembly.rotation.x = hoverY * 0.12 + (reducedMotion ? 0 : Math.sin(t * 0.9) * 0.04);
      if (!reducedMotion) {
        medalAssembly.position.y = -0.22 + Math.sin(t * 1.1) * 0.06;
        dust.rotation.y = t * 0.05;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', onResize);
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  if (fallback) {
    return (
      <div className="w-full h-[420px] flex items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-950/70">
        <div className="w-48 h-48 rounded-full border-4 border-slate-300/80 bg-gradient-to-br from-white via-slate-300 to-slate-600 shadow-[0_0_70px_rgba(41,151,255,0.3)] flex items-center justify-center">
          <span className="font-serif text-5xl font-semibold text-slate-900 tracking-widest">II</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[430px] sm:h-[500px] select-none cursor-grab active:cursor-grabbing">
      {/* Overhead theatrical spotlight beam */}
      <div
        className="pointer-events-none absolute inset-x-12 -top-8 h-72 opacity-60 blur-2xl"
        style={{
          background:
            'conic-gradient(from 165deg at 50% 0%, transparent 0deg, rgba(220,232,250,0.22) 18deg, rgba(41,151,255,0.18) 32deg, transparent 52deg)',
        }}
      />
      <div ref={containerRef} className="w-full h-full relative z-10" />
      <div className="pointer-events-none absolute bottom-3 inset-x-0 flex justify-center z-20">
        <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-slate-400/80 bg-slate-950/70 border border-slate-800/80 px-3.5 py-1 rounded-full backdrop-blur-md">
          DRAG TO INSPECT 360° SILVER RELIEF
        </span>
      </div>
    </div>
  );
};

export default MedalCanvas;
