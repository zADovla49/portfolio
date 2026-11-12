import * as THREE from 'three';

/**
 * Builds the architectural 'AD' 3D monogram group with brushed silver,
 * dark obsidian chrome backing, electric-blue precision core, and orbital rings.
 */
export function createADMonogramGroup(): {
  root: THREE.Group;
  emblemCore: THREE.Group;
  ringOuter: THREE.Mesh;
  ringInner: THREE.Mesh;
  blueBladeMat: THREE.MeshStandardMaterial;
} {
  const root = new THREE.Group();
  const emblemCore = new THREE.Group();

  // Materials — realistic metallic silver, dark chrome, and electric-blue emissive filament
  const silverMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#DCE6F5'),
    metalness: 1.0,
    roughness: 0.14,
    reflectivity: 1.0,
    clearcoat: 0.85,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.85,
  });

  const darkChromeMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#131C2E'),
    metalness: 0.96,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.5,
  });

  const blueBladeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#2997FF'),
    emissive: new THREE.Color('#1882FF'),
    emissiveIntensity: 2.6,
    metalness: 0.4,
    roughness: 0.15,
  });

  // 1. Architectural 'A' Shape (CCW outer contour + CW triangular counter)
  const shapeA = new THREE.Shape();
  shapeA.moveTo(-1.56, -1.14);
  shapeA.lineTo(-1.17, -1.14);
  shapeA.lineTo(-0.96, -0.44);
  shapeA.lineTo(-0.44, -0.44);
  shapeA.lineTo(-0.44, -1.14);
  shapeA.lineTo(-0.10, -1.14);
  shapeA.lineTo(-0.10, 1.14);
  shapeA.lineTo(-0.52, 1.14);
  shapeA.lineTo(-1.56, -1.14);

  const holeA = new THREE.Path();
  holeA.moveTo(-0.44, -0.12);
  holeA.lineTo(-0.85, -0.12);
  holeA.lineTo(-0.44, 0.72);
  holeA.lineTo(-0.44, -0.12);
  shapeA.holes.push(holeA);

  // 2. Architectural Chamfered 'D' Shape (CCW outer contour + CW inner counter)
  const shapeD = new THREE.Shape();
  shapeD.moveTo(0.10, -1.14);
  shapeD.lineTo(0.94, -1.14);
  shapeD.lineTo(1.50, -0.58);
  shapeD.lineTo(1.50, 0.58);
  shapeD.lineTo(0.94, 1.14);
  shapeD.lineTo(0.10, 1.14);
  shapeD.lineTo(0.10, -1.14);

  const holeD = new THREE.Path();
  holeD.moveTo(0.44, -0.80);
  holeD.lineTo(0.44, 0.80);
  holeD.lineTo(0.81, 0.80);
  holeD.lineTo(1.16, 0.45);
  holeD.lineTo(1.16, -0.45);
  holeD.lineTo(0.81, -0.80);
  holeD.lineTo(0.44, -0.80);
  shapeD.holes.push(holeD);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.34,
    bevelEnabled: true,
    bevelThickness: 0.055,
    bevelSize: 0.04,
    bevelOffset: 0,
    bevelSegments: 8,
    curveSegments: 24,
  };

  const geoA = new THREE.ExtrudeGeometry(shapeA, extrudeSettings);
  geoA.center();
  // Restore exact X offset after centering Z
  geoA.translate(-0.83, 0, 0);

  const geoD = new THREE.ExtrudeGeometry(shapeD, extrudeSettings);
  geoD.center();
  geoD.translate(0.80, 0, 0);

  // Multi-material look: brushed silver front/back + dark chrome side bevel depth
  const meshA = new THREE.Mesh(geoA, [silverMaterial, darkChromeMaterial]);
  const meshD = new THREE.Mesh(geoD, [silverMaterial, darkChromeMaterial]);
  meshA.castShadow = true;
  meshA.receiveShadow = true;
  meshD.castShadow = true;
  meshD.receiveShadow = true;

  // Dark Chrome Architectural Recessed Shadow Chassis behind AD
  const backA = new THREE.Mesh(geoA, darkChromeMaterial);
  backA.scale.set(1.025, 1.025, 0.45);
  backA.position.z = -0.22;

  const backD = new THREE.Mesh(geoD, darkChromeMaterial);
  backD.scale.set(1.025, 1.025, 0.45);
  backD.position.z = -0.22;

  // Central Electric-Blue Axis Filament between A and D
  const bladeGeo = new THREE.BoxGeometry(0.042, 2.42, 0.22);
  const bladeMesh = new THREE.Mesh(bladeGeo, blueBladeMat);
  bladeMesh.position.set(-0.015, 0, 0.02);

  // Chamfered Octagonal Architectural Frame around the Monogram
  const frameShape = new THREE.Shape();
  const fw = 2.08;
  const fh = 1.68;
  const ch = 0.36;
  frameShape.moveTo(-fw + ch, -fh);
  frameShape.lineTo(fw - ch, -fh);
  frameShape.lineTo(fw, -fh + ch);
  frameShape.lineTo(fw, fh - ch);
  frameShape.lineTo(fw - ch, fh);
  frameShape.lineTo(-fw + ch, fh);
  frameShape.lineTo(-fw, fh - ch);
  frameShape.lineTo(-fw, -fh + ch);
  frameShape.closePath();

  const frameHole = new THREE.Path();
  const iw = fw - 0.055;
  const ih = fh - 0.055;
  const ich = ch - 0.02;
  frameHole.moveTo(-iw + ich, ih);
  frameHole.lineTo(iw - ich, ih);
  frameHole.lineTo(iw, ih - ich);
  frameHole.lineTo(iw, -ih + ich);
  frameHole.lineTo(iw - ich, -ih);
  frameHole.lineTo(-iw + ich, -ih);
  frameHole.lineTo(-iw, -ih + ich);
  frameHole.lineTo(-iw, ih - ich);
  frameHole.closePath();
  frameShape.holes.push(frameHole);

  const frameGeo = new THREE.ExtrudeGeometry(frameShape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.015,
    bevelSegments: 4,
  });
  frameGeo.translate(0, 0, -0.18);
  const frameMesh = new THREE.Mesh(frameGeo, darkChromeMaterial);

  emblemCore.add(meshA, meshD, backA, backD, bladeMesh, frameMesh);

  // Precision Orbital Gyroscope Rings
  const ringMatSilver = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#8FA3BF'),
    metalness: 1.0,
    roughness: 0.22,
    envMapIntensity: 1.4,
  });

  const ringMatBlue = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#2997FF'),
    emissive: new THREE.Color('#0E68CC'),
    emissiveIntensity: 1.2,
    metalness: 0.8,
    roughness: 0.2,
  });

  const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(2.75, 0.012, 16, 128), ringMatSilver);
  ringOuter.rotation.set(Math.PI * 0.36, Math.PI * 0.12, 0);

  const ringInner = new THREE.Mesh(
    new THREE.TorusGeometry(2.38, 0.009, 16, 120, Math.PI * 1.45),
    ringMatBlue
  );
  ringInner.rotation.set(-Math.PI * 0.28, -Math.PI * 0.22, 0.4);

  root.add(emblemCore, ringOuter, ringInner);

  return { root, emblemCore, ringOuter, ringInner, blueBladeMat };
}
