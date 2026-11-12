import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createADMonogramGroup } from './adGeometry';

interface UniverseCanvasProps {
  scrollProgressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
}

export const UniverseCanvas: React.FC<UniverseCanvasProps> = ({
  scrollProgressRef,
  reducedMotion,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#030712', 0.032);

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      140
    );
    camera.position.set(0, 0.15, 7.2);

    // Studio metallic reflection environment
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const envRT = pmrem.fromScene(envScene, 0.04);
    scene.environment = envRT.texture;
    envScene.dispose();

    // Cinematic Lighting Rig
    const ambient = new THREE.AmbientLight('#0B1933', 0.8);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight('#F1F6FF', 3.4);
    keyLight.position.set(5.5, 6.5, 7.5);
    scene.add(keyLight);

    const rimBlueLeft = new THREE.PointLight('#1E90FF', 16, 26, 1.6);
    rimBlueLeft.position.set(-4.8, 2.2, 3.2);
    scene.add(rimBlueLeft);

    const rimBlueDeep = new THREE.PointLight('#00B4FF', 14, 34, 1.5);
    rimBlueDeep.position.set(4.5, -2.2, -4.0);
    scene.add(rimBlueDeep);

    const cursorLight = new THREE.PointLight('#38A3FF', 9, 16, 1.8);
    cursorLight.position.set(0, 0, 4.2);
    scene.add(cursorLight);

    // === SCENE 1: HERO 3D ARCHITECTURAL AD MONOGRAM ===
    const { root: adGroup, emblemCore, ringOuter, ringInner, blueBladeMat } =
      createADMonogramGroup();
    const isMobileInit = window.innerWidth < 768;
    adGroup.position.set(isMobileInit ? 0 : 0, isMobileInit ? 0.55 : 0.28, 0);
    adGroup.scale.setScalar(isMobileInit ? 0.72 : 0.98);
    scene.add(adGroup);

    // === SCENE 2: ABOUT — ARCHITECTURAL OBSIDIAN & SILVER MONOLITHS (z = -15) ===
    const monolithGroup = new THREE.Group();
    monolithGroup.position.set(0, 0, -15);
    const slabMat = new THREE.MeshPhysicalMaterial({
      color: '#101A2E',
      metalness: 0.94,
      roughness: 0.16,
      clearcoat: 1.0,
      envMapIntensity: 1.6,
    });
    const edgeMat = new THREE.LineBasicMaterial({
      color: '#2997FF',
      transparent: true,
      opacity: 0.38,
    });
    const monolithSpecs = [
      { pos: [-3.4, 0.3, -1.2], rot: [0.12, 0.42, -0.06], scale: [0.65, 3.4, 0.16] },
      { pos: [3.6, -0.2, -2.4], rot: [-0.08, -0.48, 0.05], scale: [0.75, 3.8, 0.18] },
      { pos: [-2.2, -1.4, 1.5], rot: [0.22, 0.25, 0.12], scale: [0.42, 2.2, 0.14] },
      { pos: [2.5, 1.5, 0.8], rot: [-0.18, -0.3, -0.1], scale: [0.45, 2.4, 0.14] },
    ];
    monolithSpecs.forEach((s) => {
      const box = new THREE.BoxGeometry(s.scale[0], s.scale[1], s.scale[2]);
      const mesh = new THREE.Mesh(box, slabMat);
      mesh.position.set(s.pos[0], s.pos[1], s.pos[2]);
      mesh.rotation.set(s.rot[0], s.rot[1], s.rot[2]);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(box), edgeMat);
      mesh.add(edges);
      monolithGroup.add(mesh);
    });
    scene.add(monolithGroup);

    // === SCENE 3: JOURNEY — CYBERSECURITY & DATA LATTICE NETWORK (z = -32) ===
    const networkGroup = new THREE.Group();
    networkGroup.position.set(0, 0, -32);

    const coreWireGeo = new THREE.IcosahedronGeometry(2.15, 1);
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: '#2997FF',
      wireframe: true,
      transparent: true,
      opacity: 0.24,
    });
    const coreWire = new THREE.Mesh(coreWireGeo, coreWireMat);
    networkGroup.add(coreWire);

    const innerShieldGeo = new THREE.OctahedronGeometry(1.18, 0);
    const innerShieldMat = new THREE.MeshPhysicalMaterial({
      color: '#9EC5FF',
      metalness: 0.95,
      roughness: 0.12,
      envMapIntensity: 1.8,
    });
    const innerShield = new THREE.Mesh(innerShieldGeo, innerShieldMat);
    networkGroup.add(innerShield);

    // Constellation nodes + connecting network lines
    const nodePositions: THREE.Vector3[] = [];
    const nodeMat = new THREE.MeshBasicMaterial({ color: '#58B4FF' });
    const nodeGeo = new THREE.OctahedronGeometry(0.065, 0);
    for (let i = 0; i < 38; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 38);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.6 + (i % 3) * 0.85;
      const v = new THREE.Vector3(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi) * 0.78,
        r * Math.cos(phi)
      );
      nodePositions.push(v);
      const nMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nMesh.position.copy(v);
      networkGroup.add(nMesh);
    }

    const linePoints: number[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 2.25) {
          linePoints.push(
            nodePositions[i].x,
            nodePositions[i].y,
            nodePositions[i].z,
            nodePositions[j].x,
            nodePositions[j].y,
            nodePositions[j].z
          );
        }
      }
    }
    const netLinesGeo = new THREE.BufferGeometry();
    netLinesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
    const netLinesMat = new THREE.LineBasicMaterial({
      color: '#1E90FF',
      transparent: true,
      opacity: 0.28,
    });
    networkGroup.add(new THREE.LineSegments(netLinesGeo, netLinesMat));

    const netLight = new THREE.PointLight('#1E90FF', 18, 22, 1.5);
    netLight.position.set(0, 0, 0);
    networkGroup.add(netLight);
    scene.add(networkGroup);

    // === SCENE 4–6: DEEP HORIZON GRID & VISION BEACON (z = -54 to -68) ===
    const visionGroup = new THREE.Group();
    visionGroup.position.set(0, 0, -64);
    const haloRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.018, 16, 140),
      new THREE.MeshBasicMaterial({ color: '#2997FF', transparent: true, opacity: 0.45 })
    );
    const haloRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(4.8, 0.008, 12, 140),
      new THREE.MeshBasicMaterial({ color: '#DCE6F5', transparent: true, opacity: 0.22 })
    );
    haloRing2.rotation.x = 0.45;
    visionGroup.add(haloRing, haloRing2);
    scene.add(visionGroup);

    // === VOLUMETRIC ATMOSPHERIC PARTICLES SPANNING FULL Z-TUNNEL ===
    const particleCount = 650;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 26;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pPositions[i * 3 + 2] = 6 - Math.random() * 82;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: '#4DA6FF',
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse / Pointer tracking
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      const mobile = w < 768;
      adGroup.scale.setScalar(mobile ? 0.68 : 0.98);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    const clock = new THREE.Clock();
    let smoothScroll = 0;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const targetScroll = scrollProgressRef.current;
      smoothScroll += (targetScroll - smoothScroll) * (reducedMotion ? 0.25 : 0.065);

      pointer.x += (pointer.targetX - pointer.x) * 0.06;
      pointer.y += (pointer.targetY - pointer.y) * 0.06;

      // Camera flies smoothly down the Z-axis corridor from z=7.2 to z=-57
      const camZ = 7.2 - smoothScroll * 64.0;
      const camX = pointer.x * (reducedMotion ? 0.1 : 0.42);
      const camY = 0.15 + pointer.y * (reducedMotion ? 0.08 : 0.28);
      camera.position.set(camX, camY, camZ);
      camera.lookAt(camX * 0.35, camY * 0.35, camZ - 8.5);

      // Cursor reactive light follows active camera depth
      cursorLight.position.set(pointer.x * 3.8, pointer.y * 2.5, camZ - 3.2);

      if (!reducedMotion) {
        // Hero AD Monogram slow ceremonial rotation + pointer tilt + scroll drift
        emblemCore.rotation.y = Math.sin(elapsed * 0.42) * 0.28 + pointer.x * 0.34;
        emblemCore.rotation.x = Math.cos(elapsed * 0.31) * 0.08 - pointer.y * 0.22;
        adGroup.position.y =
          (window.innerWidth < 768 ? 0.52 : 0.26) + Math.sin(elapsed * 0.8) * 0.08;
        ringOuter.rotation.z = elapsed * 0.14;
        ringInner.rotation.z = -elapsed * 0.22;
        blueBladeMat.emissiveIntensity = 2.2 + Math.sin(elapsed * 2.2) * 0.6;

        // About monoliths subtle levitation
        monolithGroup.children.forEach((child, idx) => {
          child.position.y += Math.sin(elapsed * 0.7 + idx * 1.4) * 0.0015;
          child.rotation.y += 0.0008 * (idx % 2 === 0 ? 1 : -1);
        });

        // Journey 3D Network Lattice rotation
        networkGroup.rotation.y = elapsed * 0.12 + pointer.x * 0.2;
        networkGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.12 - pointer.y * 0.15;
        innerShield.rotation.y = -elapsed * 0.38;
        innerShield.rotation.z = elapsed * 0.22;

        // Vision Horizon rings
        haloRing.rotation.z = elapsed * 0.1;
        haloRing2.rotation.y = elapsed * 0.15;

        // Subtle particle drift
        particles.rotation.z = elapsed * 0.012;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion, scrollProgressRef]);

  if (!webglSupported) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(30, 144, 255, 0.14) 0%, rgba(5, 11, 24, 0.94) 52%, #020409 100%)',
        }}
      />
    );
  }

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default UniverseCanvas;
