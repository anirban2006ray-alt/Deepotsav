import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { sound } from '../utils/audio';
import { Sparkles, RotateCw, ZoomIn, ZoomOut, Flame, Volume2, VolumeX, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

type DiyaModel = 'brass' | 'gold' | 'floral' | 'lotus' | 'floating';
type FlameStyle = 'steady' | 'gentle' | 'radiant';

export const ThreeDiyaExperience: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Experience State
  const [isLit, setIsLit] = useState<boolean>(true);
  const [model, setModel] = useState<DiyaModel>('brass');
  const [flameStyle, setFlameStyle] = useState<FlameStyle>('gentle');
  const [flameIntensity, setFlameIntensity] = useState<number>(75);
  const [diyaCount, setDiyaCount] = useState<number>(1);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [use2DFallback, setUse2DFallback] = useState<boolean>(false);

  // References for runtime updates without destroying the WebGL context
  const sceneStateRef = useRef({
    isLit,
    model,
    flameStyle,
    flameIntensity,
    diyaCount,
    isAutoRotating,
  });

  useEffect(() => {
    sceneStateRef.current = {
      isLit,
      model,
      flameStyle,
      flameIntensity,
      diyaCount,
      isAutoRotating,
    };
  }, [isLit, model, flameStyle, flameIntensity, diyaCount, isAutoRotating]);

  // Three.js Mount Hook
  useEffect(() => {
    if (use2DFallback) return;
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL Detection
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080b1a, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 6.2);

    // Renderer
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

    // PMREM Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    const keyLight = new THREE.DirectionalLight(0xffe2a4, 2.4);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x351d52, 0x080b1a, 1.2);
    scene.add(hemiLight);

    const flamePointLight = new THREE.PointLight(0xff8c24, 3.8, 12, 1.6);
    flamePointLight.position.set(0, 1.35, 0);
    scene.add(flamePointLight);

    // Center Stage Ground
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // Floor Pedestal Stone with Decorative Inlay
    const floorGeo = new THREE.CylinderGeometry(4.5, 4.8, 0.2, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111528,
      metalness: 0.2,
      roughness: 0.8,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.1;
    floorMesh.receiveShadow = true;
    stageGroup.add(floorMesh);

    // Floor Golden Border Ring
    const floorRingGeo = new THREE.TorusGeometry(4.48, 0.05, 16, 64);
    floorRingGeo.rotateX(Math.PI / 2);
    const floorRingMat = new THREE.MeshStandardMaterial({
      color: 0xddaa42,
      metalness: 0.9,
      roughness: 0.2,
    });
    const floorRing = new THREE.Mesh(floorRingGeo, floorRingMat);
    floorRing.position.y = 0.01;
    stageGroup.add(floorRing);

    // Radial Contact Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(128, 128, 15, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 5.2),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.8 })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.015;
    stageGroup.add(contactShadow);

    // Diya Container
    const diyasContainer = new THREE.Group();
    stageGroup.add(diyasContainer);

    // Function to assemble a single procedural Diya model (composite 3-12 parts)
    const buildDiyaMesh = (currentModel: DiyaModel): THREE.Group => {
      const g = new THREE.Group();

      let mainColor = 0xdca842;
      let trimColor = 0xba8020;
      let metalness = 0.88;
      let roughness = 0.22;

      if (currentModel === 'gold') {
        mainColor = 0xffd166;
        trimColor = 0xffea9f;
        metalness = 0.95;
        roughness = 0.12;
      } else if (currentModel === 'floral') {
        mainColor = 0xee923d;
        trimColor = 0xf47aa5;
        metalness = 0.65;
        roughness = 0.35;
      } else if (currentModel === 'lotus') {
        mainColor = 0xffb4c8;
        trimColor = 0xddaa42;
        metalness = 0.55;
        roughness = 0.3;
      } else if (currentModel === 'floating') {
        mainColor = 0xd49b42;
        trimColor = 0x168b78;
        metalness = 0.75;
        roughness = 0.25;
      }

      const bodyMat = new THREE.MeshStandardMaterial({
        color: mainColor,
        metalness,
        roughness,
      });

      const trimMat = new THREE.MeshStandardMaterial({
        color: trimColor,
        metalness: 0.9,
        roughness: 0.18,
      });

      // Part 1: Base Pedestal
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.25, 0.2, 32), bodyMat);
      base.position.y = 0.1;
      base.castShadow = true;
      base.receiveShadow = true;
      g.add(base);

      // Part 2: Base Decorative Ring
      const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.05, 12, 36), trimMat);
      baseRing.rotation.x = Math.PI / 2;
      baseRing.position.y = 0.2;
      g.add(baseRing);

      // Part 3: Main Bowl using Lathe
      const pts: THREE.Vector2[] = [];
      pts.push(new THREE.Vector2(0, 0.2));
      pts.push(new THREE.Vector2(0.8, 0.22));
      pts.push(new THREE.Vector2(1.4, 0.42));
      pts.push(new THREE.Vector2(1.72, 0.75));
      pts.push(new THREE.Vector2(1.65, 0.94));
      pts.push(new THREE.Vector2(1.5, 0.95));
      pts.push(new THREE.Vector2(1.25, 0.7));
      pts.push(new THREE.Vector2(0.7, 0.48));
      pts.push(new THREE.Vector2(0, 0.45));
      const bowl = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), bodyMat);
      bowl.castShadow = true;
      bowl.receiveShadow = true;
      g.add(bowl);

      // Part 4: Beaded Rim
      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.06, 12, 40), trimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.94;
      g.add(rim);

      // Part 5: Oil Reservoir
      const oil = new THREE.Mesh(
        new THREE.CylinderGeometry(1.25, 0.8, 0.06, 24),
        new THREE.MeshStandardMaterial({ color: 0x3d1704, metalness: 0.3, roughness: 0.08 })
      );
      oil.position.y = 0.62;
      g.add(oil);

      // Part 6: Cotton Wick
      const wickCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.4, 0.58, 0),
        new THREE.Vector3(0.15, 0.74, 0),
        new THREE.Vector3(0, 0.96, 0),
      ]);
      const wick = new THREE.Mesh(
        new THREE.TubeGeometry(wickCurve, 16, 0.045, 8, false),
        new THREE.MeshStandardMaterial({ color: 0x150b06, roughness: 0.9 })
      );
      g.add(wick);

      // Additional Distinct Details per model
      if (currentModel === 'lotus' || currentModel === 'floral') {
        const petalCount = 12;
        const petalGeo = new THREE.SphereGeometry(0.3, 12, 12);
        petalGeo.scale(0.6, 1.8, 0.2);
        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * Math.PI * 2;
          const petal = new THREE.Mesh(petalGeo, trimMat);
          petal.position.set(Math.cos(angle) * 1.5, 0.6, Math.sin(angle) * 1.5);
          petal.rotation.y = -angle;
          petal.rotation.z = 0.35;
          g.add(petal);
        }
      }

      if (currentModel === 'floating') {
        // Floating water pond ring
        const waterGeo = new THREE.RingGeometry(1.6, 2.8, 32);
        waterGeo.rotateX(-Math.PI / 2);
        const waterMat = new THREE.MeshStandardMaterial({
          color: 0x168b78,
          metalness: 0.4,
          roughness: 0.1,
          transparent: true,
          opacity: 0.7,
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.position.y = 0.05;
        g.add(water);
      }

      // Flame Assembly attached
      const flameGroup = new THREE.Group();
      flameGroup.name = 'flameGroup';
      flameGroup.position.set(0, 0.98, 0);

      const outerFlame = new THREE.Mesh(
        new THREE.ConeGeometry(0.28, 0.85, 20),
        new THREE.MeshBasicMaterial({
          color: 0xff5511,
          transparent: true,
          opacity: 0.65,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      outerFlame.position.y = 0.42;
      outerFlame.name = 'outerFlame';
      flameGroup.add(outerFlame);

      const innerFlame = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.68, 16),
        new THREE.MeshBasicMaterial({
          color: 0xffdd44,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      innerFlame.position.y = 0.34;
      innerFlame.name = 'innerFlame';
      flameGroup.add(innerFlame);

      const coreFlame = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })
      );
      coreFlame.position.y = 0.06;
      flameGroup.add(coreFlame);

      g.add(flameGroup);

      return g;
    };

    // Rebuild Diyas based on selection
    const rebuildDiyas = () => {
      while (diyasContainer.children.length > 0) {
        diyasContainer.remove(diyasContainer.children[0]);
      }

      const count = sceneStateRef.current.diyaCount;
      const curModel = sceneStateRef.current.model;

      if (count === 1) {
        const d = buildDiyaMesh(curModel);
        diyasContainer.add(d);
      } else if (count === 3) {
        [-1.8, 0, 1.8].forEach((xPos, idx) => {
          const d = buildDiyaMesh(curModel);
          d.position.set(xPos, 0, idx === 1 ? 0.3 : -0.3);
          d.scale.set(0.85, 0.85, 0.85);
          diyasContainer.add(d);
        });
      } else if (count === 5) {
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const d = buildDiyaMesh(curModel);
          d.position.set(Math.cos(angle) * 2.0, 0, Math.sin(angle) * 2.0);
          d.scale.set(0.72, 0.72, 0.72);
          diyasContainer.add(d);
        }
      }
    };

    rebuildDiyas();

    // Floating Golden Particles
    const sparkCount = 45;
    const sparkGeo = new THREE.SphereGeometry(0.028, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({
      color: 0xffc857,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const sparkMesh = new THREE.InstancedMesh(sparkGeo, sparkMat, sparkCount);
    const dummy = new THREE.Object3D();
    const sparks = Array.from({ length: sparkCount }, () => ({
      x: (Math.random() - 0.5) * 5.5,
      y: 0.6 + Math.random() * 3.5,
      z: (Math.random() - 0.5) * 5.5,
      speed: 0.3 + Math.random() * 0.7,
      offset: Math.random() * Math.PI * 2,
    }));
    sparkMesh.computeBoundingSphere();
    sparkMesh.frustumCulled = false;
    scene.add(sparkMesh);

    // Interactive Drag / Orbit rotation
    let isDragging = false;
    let previousPointerX = 0;
    let targetRotationY = 0;
    let currentRotationY = 0;
    let targetZoom = 6.2;
    let currentZoom = 6.2;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      previousPointerX = clientX;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - previousPointerX;
      previousPointerX = clientX;
      targetRotationY += deltaX * 0.008;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown);
    dom.addEventListener('touchmove', onPointerMove);
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

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
      const dt = clock.getDelta();
      const { isLit: currentIsLit, isAutoRotating: autoRotate, flameIntensity: intensity, flameStyle: fStyle } = sceneStateRef.current;

      // Smooth camera damping & rotation
      if (autoRotate && !isDragging) {
        targetRotationY += 0.005;
      }

      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 8, 0.016);
      stageGroup.rotation.y = currentRotationY;

      currentZoom = THREE.MathUtils.damp(currentZoom, targetZoom, 8, 0.016);
      camera.position.z = currentZoom;
      camera.lookAt(0, 0.8, 0);

      // Animate flames across all active diyas
      diyasContainer.children.forEach((diya) => {
        const fg = diya.getObjectByName('flameGroup');
        if (fg) {
          fg.visible = currentIsLit;
          if (currentIsLit) {
            const freqMultiplier = fStyle === 'steady' ? 0.4 : fStyle === 'radiant' ? 2.0 : 1.0;
            const flicker = Math.sin(elapsed * 12 * freqMultiplier) * 0.08 + Math.cos(elapsed * 17 * freqMultiplier) * 0.04;
            const intensityMultiplier = intensity / 75;

            const scaleY = (1.0 + flicker) * intensityMultiplier;
            const scaleXZ = (1.0 - flicker * 0.4) * intensityMultiplier;

            const outer = fg.getObjectByName('outerFlame');
            const inner = fg.getObjectByName('innerFlame');
            if (outer) outer.scale.set(scaleXZ, scaleY, scaleXZ);
            if (inner) inner.scale.set(scaleXZ * 0.95, scaleY * 1.02, scaleXZ * 0.95);
          }
        }
      });

      // Point Light dynamic flicker
      flamePointLight.intensity = currentIsLit ? (3.5 + Math.sin(elapsed * 14) * 0.6) * (intensity / 75) : 0;

      // Animate floating sparks
      sparks.forEach((spark, idx) => {
        const y = spark.y + Math.sin(elapsed * spark.speed + spark.offset) * 0.35;
        const x = spark.x + Math.cos(elapsed * 0.25 + spark.offset) * 0.25;
        const z = spark.z + Math.sin(elapsed * 0.25 + spark.offset) * 0.25;
        dummy.position.set(x, y, z);
        const s = 0.8 + Math.sin(elapsed * 2.5 + spark.offset) * 0.4;
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
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      dom.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [use2DFallback, model, diyaCount]);

  // Audio & Interaction handlers
  const handleToggleLight = () => {
    const nextState = !isLit;
    setIsLit(nextState);
    if (nextState && soundEnabled) {
      sound.playDiyaLight();
    }
  };

  const handleReset = () => {
    setIsLit(true);
    setModel('brass');
    setFlameStyle('gentle');
    setFlameIntensity(75);
    setDiyaCount(1);
    setIsAutoRotating(true);
    if (soundEnabled) sound.playTempleBell();
  };

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-4 md:px-8 flex flex-col items-center">
      {/* Header Introduction */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[#DDAA42] font-cinzel mb-2">
          ✦ The 3D Diya Experience ✦
        </p>
        <h1 className="text-3xl md:text-5xl font-playfair font-bold text-warm text-gold-gradient">
          A Little Light. An Infinite Feeling.
        </h1>
        <p className="mt-3 text-sm md:text-base text-[#D6BD8B]/80 leading-relaxed">
          Choose a sacred diya, adjust its living flame, and experience the quiet peace of the Festival of Lights in full three-dimensional realism.
        </p>
      </div>

      {/* Main 3D Viewport */}
      <div className="relative w-full max-w-5xl h-[520px] md:h-[620px] rounded-3xl overflow-hidden border border-[#DDAA42]/30 bg-gradient-to-b from-[#11152B]/80 to-[#080B1A] shadow-2xl flex items-center justify-center">
        {!use2DFallback ? (
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        ) : (
          /* 2D Fallback Mode */
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF8C24]/20 to-[#FFC857]/20 blur-xl animate-pulse" />
              <div className={`w-36 h-20 rounded-b-full bg-gradient-to-b from-[#FFE09B] to-[#9A3D18] border-2 border-[#DDAA42] flex items-center justify-center relative ${isLit ? 'shadow-[0_0_50px_#FF8C24]' : ''}`}>
                {isLit && (
                  <div className="absolute -top-14 w-10 h-16 rounded-[50%_50%_30%_30%] bg-gradient-to-t from-[#FF5B22] via-[#FFC857] to-white flame-animated" />
                )}
                <div className="w-1.5 h-6 bg-[#21143B] absolute -top-3" />
              </div>
            </div>
            <p className="text-lg font-cinzel text-gold-gradient mb-2">2D Traditional Diya View</p>
            <p className="text-xs text-[#D6BD8B]/70 max-w-sm">Light and gentle shadows optimized for low-power devices.</p>
          </div>
        )}

        {/* Viewport Overlay Controls (Top Floating Pill) */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-[#080B1A]/80 border border-[#DDAA42]/30 px-3 py-1.5 rounded-full text-xs font-cinzel text-[#D6BD8B]">
            <Flame className={`w-3.5 h-3.5 ${isLit ? 'text-[#FF8C24] animate-pulse' : 'text-gray-500'}`} />
            <span>{isLit ? 'Flame Lit' : 'Flame Unlit'}</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => {
                const nextMuted = sound.toggleMute();
                setSoundEnabled(!nextMuted);
              }}
              className="p-2 rounded-full bg-[#080B1A]/80 border border-[#DDAA42]/30 text-[#D6BD8B] hover:text-[#FFC857] transition"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setUse2DFallback(!use2DFallback)}
              className="px-3 py-1.5 rounded-full bg-[#080B1A]/80 border border-[#DDAA42]/30 text-xs font-cinzel text-[#D6BD8B] hover:text-[#FFC857] transition"
            >
              {use2DFallback ? '3D Experience' : '2D Fallback'}
            </button>
          </div>
        </div>

        {/* Interaction Hint */}
        <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 pointer-events-none text-[11px] text-[#D6BD8B]/60 tracking-wider font-cinzel uppercase bg-[#080B1A]/60 px-4 py-1 rounded-full border border-white/5">
          Drag to rotate • Scroll to zoom
        </div>

        {/* Collapsible Viewport Bottom Dock (Zero Viewport Occlusion) */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl transition-transform duration-300 z-20 ${
            isDockCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
          }`}
        >
          {/* Collapse Toggle Tab */}
          <div className="flex justify-center mb-1">
            <button
              onClick={() => setIsDockCollapsed(!isDockCollapsed)}
              className="flex items-center gap-1.5 px-4 py-1 rounded-t-xl bg-[#11152B] border-t border-x border-[#DDAA42]/40 text-xs font-cinzel text-[#FFC857] hover:bg-[#21143B] transition"
            >
              {isDockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" /> Show Controls
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" /> Collapse Dock
                </>
              )}
            </button>
          </div>

          {/* Unified Horizontal Control Dock */}
          <div className="p-4 rounded-2xl bg-[#080B1A]/95 border border-[#DDAA42]/40 shadow-2xl backdrop-blur-none text-xs text-[#F4EBDD]">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 items-center">
              {/* 1. Toggle Light */}
              <button
                onClick={handleToggleLight}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                  isLit
                    ? 'bg-gradient-to-r from-[#FF5B22] to-[#FF8C24] text-white shadow-[0_0_15px_#FF8C24]'
                    : 'bg-[#21143B] text-[#D6BD8B] border border-[#DDAA42]/30 hover:border-[#FFC857]'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>{isLit ? 'Extinguish' : 'Light Diya'}</span>
              </button>

              {/* 2. Diya Design Selector */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#D6BD8B]/80 mb-1">Design</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as DiyaModel)}
                  className="w-full bg-[#11152B] border border-[#DDAA42]/30 rounded-lg py-1.5 px-2 text-[#FFC857] text-xs font-medium focus:outline-none focus:border-[#FFC857]"
                >
                  <option value="brass">Traditional Brass</option>
                  <option value="gold">Decorative Gold</option>
                  <option value="floral">Floral Carved</option>
                  <option value="lotus">Lotus Blossom</option>
                  <option value="floating">Floating Water</option>
                </select>
              </div>

              {/* 3. Flame Style */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#D6BD8B]/80 mb-1">Flame Style</label>
                <div className="grid grid-cols-3 gap-1 bg-[#11152B] p-0.5 rounded-lg border border-[#DDAA42]/20">
                  {(['steady', 'gentle', 'radiant'] as FlameStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => setFlameStyle(style)}
                      className={`py-1 text-[10px] rounded capitalize ${
                        flameStyle === style ? 'bg-[#FF8C24] text-white font-bold' : 'text-[#D6BD8B]/70'
                      }`}
                    >
                      {style[0].toUpperCase() + style.slice(1, 4)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Flame Intensity */}
              <div>
                <div className="flex justify-between text-[10px] uppercase text-[#D6BD8B]/80 mb-1">
                  <span>Intensity</span>
                  <span className="text-[#FFC857]">{flameIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="125"
                  value={flameIntensity}
                  onChange={(e) => setFlameIntensity(Number(e.target.value))}
                  className="w-full accent-[#FF8C24] h-1.5 bg-[#21143B] rounded-lg"
                />
              </div>

              {/* 5. Arrangement */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#D6BD8B]/80 mb-1">Count</label>
                <div className="grid grid-cols-3 gap-1 bg-[#11152B] p-0.5 rounded-lg border border-[#DDAA42]/20">
                  {[1, 3, 5].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setDiyaCount(cnt)}
                      className={`py-1 text-[10px] rounded ${
                        diyaCount === cnt ? 'bg-[#DDAA42] text-[#080B1A] font-bold' : 'text-[#D6BD8B]/70'
                      }`}
                    >
                      {cnt === 1 ? 'Solo' : cnt === 3 ? 'Trio' : 'Circle'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Rotate & Reset */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center transition ${
                    isAutoRotating
                      ? 'border-[#FFC857] text-[#FFC857] bg-[#FFC857]/10'
                      : 'border-[#DDAA42]/30 text-[#D6BD8B]'
                  }`}
                  title="Toggle 3D Rotation"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg border border-[#DDAA42]/30 text-[#D6BD8B] hover:text-[#FFC857] transition"
                  title="Reset Scene"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cultural Wisdom & Five Forms Cards */}
      <div className="w-full max-w-5xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-[#DDAA42]/20">
          <div className="flex items-center gap-3 mb-3 text-[#FFC857]">
            <Sparkles className="w-5 h-5 text-[#FF8C24]" />
            <h3 className="font-cinzel text-base font-bold text-gold-gradient">The Sacred Symbolism</h3>
          </div>
          <p className="text-xs text-[#D6BD8B]/80 leading-relaxed">
            The clay or brass diya holds clarified ghee or mustard oil, representing our worldly attachments. The cotton wick represents our inner self (Atman), and the flame symbolizes the illumination of divine wisdom dispelling spiritual darkness.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-[#DDAA42]/20">
          <div className="flex items-center gap-3 mb-3 text-[#FFC857]">
            <Flame className="w-5 h-5 text-[#FF5B22]" />
            <h3 className="font-cinzel text-base font-bold text-gold-gradient">Five Timeless Forms</h3>
          </div>
          <p className="text-xs text-[#D6BD8B]/80 leading-relaxed">
            From the engraved temple brass diyas of Tamil Nadu and Gujarat to floating diyas gently placed upon the sacred Ganges in Varanasi, each form carries prayers for peace, wisdom, and auspicious beginnings.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-[#DDAA42]/20 flex flex-col justify-between">
          <div>
            <h3 className="font-cinzel text-base font-bold text-gold-gradient mb-2">Create Your Wish</h3>
            <p className="text-xs text-[#D6BD8B]/80 leading-relaxed">
              Now that your diya is glowing, turn this sacred energy into a personalized greeting for your family and friends.
            </p>
          </div>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('nav-tab', { detail: 'ecard' }));
            }}
            className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center justify-center gap-2 hover:opacity-95 transition"
          >
            Create Greeting E-Card ✦
          </button>
        </div>
      </div>
    </div>
  );
};
