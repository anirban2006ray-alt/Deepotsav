import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface HeroDiyaProps {
  isLit?: boolean;
}

export const HeroDiya3D: React.FC<HeroDiyaProps> = ({ isLit = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software-WebGL Detection
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 2. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.5);
    camera.lookAt(0, 0.4, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Rig (Warm key light, cool hemisphere fill, dynamic flame point light)
    const keyLight = new THREE.DirectionalLight(0xffdf99, 2.2);
    keyLight.position.set(3, 6, 4);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x452960, 0x120b1e, 1.2);
    scene.add(hemiLight);

    const flameLight = new THREE.PointLight(0xff9922, isLit ? 3.5 : 0, 8, 1.8);
    flameLight.position.set(0, 1.3, 0);
    scene.add(flameLight);

    // 6. Composite 3-12 Part Procedural Diya Model (THREE.Group)
    const diyaGroup = new THREE.Group();
    scene.add(diyaGroup);

    // PBR Materials
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xdca842,
      metalness: 0.88,
      roughness: 0.24,
    });
    const brassTrimMat = new THREE.MeshStandardMaterial({
      color: 0xba8020,
      metalness: 0.92,
      roughness: 0.18,
    });
    const oilMat = new THREE.MeshStandardMaterial({
      color: 0x3d1704,
      metalness: 0.3,
      roughness: 0.08,
    });
    const wickMat = new THREE.MeshStandardMaterial({
      color: 0x180f08,
      roughness: 0.9,
    });

    // Part 1: Stepped Pedestal Base (Cylinder with bevel)
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.22, 32);
    const baseMesh = new THREE.Mesh(baseGeo, brassMat);
    baseMesh.position.y = 0.11;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    diyaGroup.add(baseMesh);

    // Part 2: Base Collar Ring
    const collarGeo = new THREE.TorusGeometry(1.18, 0.08, 16, 48);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, brassTrimMat);
    collarMesh.position.y = 0.22;
    diyaGroup.add(collarMesh);

    // Part 3: Main Bowl using LatheGeometry (curved authentic Diya profile)
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, 0.22));
    points.push(new THREE.Vector2(0.9, 0.24));
    points.push(new THREE.Vector2(1.5, 0.45));
    points.push(new THREE.Vector2(1.85, 0.75));
    points.push(new THREE.Vector2(1.78, 0.95));
    points.push(new THREE.Vector2(1.65, 0.96));
    points.push(new THREE.Vector2(1.4, 0.72));
    points.push(new THREE.Vector2(0.8, 0.52));
    points.push(new THREE.Vector2(0, 0.48));
    const bowlGeo = new THREE.LatheGeometry(points, 48);
    const bowlMesh = new THREE.Mesh(bowlGeo, brassMat);
    bowlMesh.castShadow = true;
    bowlMesh.receiveShadow = true;
    diyaGroup.add(bowlMesh);

    // Part 4: Scalloped Ornamental Beaded Rim (Torus + Petal beads)
    const rimGeo = new THREE.TorusGeometry(1.78, 0.06, 16, 48);
    rimGeo.rotateX(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, brassTrimMat);
    rimMesh.position.y = 0.95;
    diyaGroup.add(rimMesh);

    // Part 5: Beaded studs around the rim
    const beadGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const beadCount = 20;
    for (let i = 0; i < beadCount; i++) {
      const angle = (i / beadCount) * Math.PI * 2;
      const bead = new THREE.Mesh(beadGeo, brassTrimMat);
      bead.position.set(Math.cos(angle) * 1.76, 0.97, Math.sin(angle) * 1.76);
      diyaGroup.add(bead);
    }

    // Part 6: Ghee / Sacred Mustard Oil Reservoir
    const oilGeo = new THREE.CylinderGeometry(1.4, 0.9, 0.08, 32);
    const oilMesh = new THREE.Mesh(oilGeo, oilMat);
    oilMesh.position.y = 0.65;
    diyaGroup.add(oilMesh);

    // Part 7: Twisted Cotton Wick
    const wickCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.5, 0.62, 0),
      new THREE.Vector3(0.2, 0.75, 0),
      new THREE.Vector3(0, 0.95, 0),
    ]);
    const wickGeo = new THREE.TubeGeometry(wickCurve, 20, 0.045, 8, false);
    const wickMesh = new THREE.Mesh(wickGeo, wickMat);
    diyaGroup.add(wickMesh);

    // Part 8: Multi-layer Realistic Flame (Core, Body, Halo)
    const flameGroup = new THREE.Group();
    flameGroup.position.set(0, 1.0, 0);
    diyaGroup.add(flameGroup);

    // Outer Saffron Glow Flame
    const outerFlameGeo = new THREE.ConeGeometry(0.28, 0.85, 24);
    outerFlameGeo.translate(0, 0.42, 0);
    const outerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xff5511,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);
    flameGroup.add(outerFlame);

    // Inner Golden Flame
    const innerFlameGeo = new THREE.ConeGeometry(0.18, 0.68, 20);
    innerFlameGeo.translate(0, 0.34, 0);
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xffdd44,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    flameGroup.add(innerFlame);

    // Blue-White Base Core
    const coreGeo = new THREE.SphereGeometry(0.09, 16, 16);
    coreGeo.translate(0, 0.05, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    flameGroup.add(coreMesh);

    flameGroup.visible = isLit;

    // Part 9: Soft Radial Contact Shadow Grounding
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.75,
    });
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    scene.add(shadowPlane);

    // Part 10: Ambient Floating Firefly / Golden Sparkles (InstancedMesh)
    const sparkCount = 28;
    const sparkGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({
      color: 0xffc857,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const sparkMesh = new THREE.InstancedMesh(sparkGeo, sparkMat, sparkCount);
    const dummy = new THREE.Object3D();
    const sparkData = Array.from({ length: sparkCount }, () => ({
      x: (Math.random() - 0.5) * 3.5,
      y: 0.8 + Math.random() * 2.5,
      z: (Math.random() - 0.5) * 3.5,
      speed: 0.4 + Math.random() * 0.8,
      offset: Math.random() * Math.PI * 2,
    }));
    sparkMesh.computeBoundingSphere();
    sparkMesh.frustumCulled = false;
    scene.add(sparkMesh);

    // 7. Animation Loop with Paced Software WebGL Guard
    let frameId = 0;
    let clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Gentle continuous rotation of Diya
      diyaGroup.rotation.y = elapsed * 0.22;

      // Realistic flame flicker
      if (isLit) {
        const flicker = Math.sin(elapsed * 12) * 0.08 + Math.cos(elapsed * 18) * 0.04;
        const scaleY = 1.0 + flicker;
        const scaleXZ = 1.0 - flicker * 0.4;
        outerFlame.scale.set(scaleXZ, scaleY, scaleXZ);
        innerFlame.scale.set(scaleXZ * 0.95, scaleY * 1.02, scaleXZ * 0.95);
        flameLight.intensity = 3.2 + Math.sin(elapsed * 15) * 0.6;
      }

      // Sparkle orbits
      sparkData.forEach((spark, idx) => {
        const y = spark.y + Math.sin(elapsed * spark.speed + spark.offset) * 0.3;
        const x = spark.x + Math.cos(elapsed * 0.3 + spark.offset) * 0.2;
        const z = spark.z + Math.sin(elapsed * 0.3 + spark.offset) * 0.2;
        dummy.position.set(x, y, z);
        const s = 0.8 + Math.sin(elapsed * 3 + spark.offset) * 0.4;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        sparkMesh.setMatrixAt(idx, dummy.matrix);
      });
      sparkMesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.dispose();
      baseGeo.dispose();
      collarGeo.dispose();
      bowlGeo.dispose();
      rimGeo.dispose();
      beadGeo.dispose();
      oilGeo.dispose();
      wickGeo.dispose();
      outerFlameGeo.dispose();
      innerFlameGeo.dispose();
      coreGeo.dispose();
      sparkGeo.dispose();
      shadowTex.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isLit]);

  return (
    <div className="relative w-full h-[420px] md:h-[520px] flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-xs text-[#D6BD8B]/70 tracking-widest uppercase font-cinzel">
        ✦ Interactive 3D Sacred Diya ✦
      </div>
    </div>
  );
};
