import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX, 
  Flame, 
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

type DahanPhase = 'Idle' | 'Aim' | 'Release' | 'Hit' | 'Dahan' | 'Celebration';

interface StoryScene {
  id: number;
  label: string;
  subhead: string;
  title: string;
  description: string;
  phaseTrigger: DahanPhase;
}

const STORY_SCENES: StoryScene[] = [
  {
    id: 1,
    label: 'Scene 01 / 06',
    subhead: 'FESTIVAL GROUNDS AT DUSK',
    title: 'The Gathering of Devotees',
    description: 'Under the twilight sky, thousands of families gather behind safety barricades. The ceremonial stage is illuminated with festive lanterns and strings of lights in shared anticipation.',
    phaseTrigger: 'Idle',
  },
  {
    id: 2,
    label: 'Scene 02 / 06',
    subhead: 'THE TEN-HEADED SYMBOL',
    title: 'Appearance of Ravana',
    description: 'Standing tall on the festival stage, the handcrafted colossal ten-headed effigy looms large. Crafted from bamboo, colorful paper, and royal ornaments, it represents ego, arrogance, and injustice to be conquered by wisdom.',
    phaseTrigger: 'Idle',
  },
  {
    id: 3,
    label: 'Scene 03 / 06',
    subhead: 'COURAGE GUIDED BY DHARMA',
    title: 'Lord Rama Prepares His Celestial Bow',
    description: 'Lord Rama steps forward in golden royal attire and celestial mukut. With calm grace, he raises the sacred bow, draws the bowstring in slow motion, and nocks an arrow of concentrated radiant light.',
    phaseTrigger: 'Aim',
  },
  {
    id: 4,
    label: 'Scene 04 / 06',
    subhead: 'THE ARROW OF TRUTH',
    title: 'Release of the Flaming Arrow',
    description: 'With a breath of focus, Lord Rama releases the celestial arrow. The golden arrow arcs across the Dussehra sky, trailing sparks and celestial brilliance toward the effigy.',
    phaseTrigger: 'Release',
  },
  {
    id: 5,
    label: 'Scene 05 / 06',
    subhead: 'CEREMONIAL IGNITION',
    title: 'Ravana Dahan Ceremony',
    description: 'The arrow strikes the effigy! Crackling fireworks ignite, and controlled stylized orange flames gradually consume the bamboo and paper effigy as plumes of smoke and golden embers rise into the night sky.',
    phaseTrigger: 'Dahan',
  },
  {
    id: 6,
    label: 'Scene 06 / 06',
    subhead: 'VICTORY CELEBRATION',
    title: 'Truth Always Triumphs Over Evil',
    description: 'Dazzling fireworks burst across the heavens and flower petals shower the festival ground. May truth, humility, and righteousness illuminate every heart and every home!',
    phaseTrigger: 'Celebration',
  },
];

export const RavanaDahanCinematic: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  // Animation State Machine
  const [phase, setPhase] = useState<DahanPhase>('Idle');
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const phaseRef = useRef<DahanPhase>(phase);
  const isPausedRef = useRef<boolean>(isPaused);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Three.js Scene Setup & Kinematics
  useEffect(() => {
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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0714);
    scene.fog = new THREE.FogExp2(0x0a0714, 0.035);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 12);
    camera.lookAt(0, 2.0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting Rig
    const directionalKey = new THREE.DirectionalLight(0xffe5ad, 2.6);
    directionalKey.position.set(6, 10, 8);
    directionalKey.castShadow = !isSoftwareGl;
    if (directionalKey.castShadow) {
      directionalKey.shadow.mapSize.width = 1024;
      directionalKey.shadow.mapSize.height = 1024;
      directionalKey.shadow.bias = -0.0005;
      directionalKey.shadow.normalBias = 0.02;
    }
    scene.add(directionalKey);

    const sunsetFill = new THREE.HemisphereLight(0x783260, 0x120a1c, 1.4);
    scene.add(sunsetFill);

    const dahanFireLight = new THREE.PointLight(0xff5511, 0, 20, 1.8);
    dahanFireLight.position.set(3.4, 3.0, 0);
    scene.add(dahanFireLight);

    // Festival Ground Platform
    const groundGeo = new THREE.CylinderGeometry(14, 15, 0.4, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x181022,
      roughness: 0.85,
      metalness: 0.15,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Ground Edge Decorative Oil Lamps
    const lampCount = 28;
    const lampGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xffaa22 });
    for (let i = 0; i < lampCount; i++) {
      const angle = (i / lampCount) * Math.PI * 2;
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.set(Math.cos(angle) * 13.8, 0.05, Math.sin(angle) * 13.8);
      scene.add(lamp);
    }

    // Safety Barricades & Crowd Silhouettes in distance
    const barricadeGeo = new THREE.TorusGeometry(12.5, 0.04, 8, 48, Math.PI);
    barricadeGeo.rotateX(Math.PI / 2);
    const barricadeMat = new THREE.MeshStandardMaterial({ color: 0xba8a38, metalness: 0.8, roughness: 0.3 });
    const barricade = new THREE.Mesh(barricadeGeo, barricadeMat);
    barricade.position.set(0, 0.6, 2.5);
    scene.add(barricade);

    // Crowd Silhouettes
    const crowdGroup = new THREE.Group();
    const crowdMat = new THREE.MeshBasicMaterial({ color: 0x07040d });
    for (let c = 0; c < 35; c++) {
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18 + Math.random() * 0.06, 8, 8), crowdMat);
      const angle = Math.PI * 0.2 + (c / 35) * Math.PI * 0.6;
      head.position.set(Math.cos(angle) * 14.2, 0.9 + Math.random() * 0.3, Math.sin(angle) * 14.2);
      crowdGroup.add(head);
    }
    scene.add(crowdGroup);

    // ─────────────────────────────────────────────────────────────
    // 1. PROCEDURAL 3D ANIME/CARTOON LORD RAMA CHARACTER
    // ─────────────────────────────────────────────────────────────
    const ramaGroup = new THREE.Group();
    ramaGroup.position.set(-3.2, 0, 0);
    scene.add(ramaGroup);

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0x90c4de, // Soft sacred Neelamegha shyam (cerulean blue) divine complexion
      roughness: 0.45,
      metalness: 0.05,
    });
    const pitambaraMat = new THREE.MeshStandardMaterial({
      color: 0xffb822, // Rich golden-yellow pitambara dhoti
      roughness: 0.5,
      metalness: 0.2,
    });
    const goldArmorMat = new THREE.MeshStandardMaterial({
      color: 0xffd166, // Ornate royal gold ornaments
      roughness: 0.18,
      metalness: 0.85,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x100b14,
      roughness: 0.7,
    });

    // Legs / Dhoti
    const dhotiGeo = new THREE.CylinderGeometry(0.35, 0.45, 1.4, 16);
    const dhoti = new THREE.Mesh(dhotiGeo, pitambaraMat);
    dhoti.position.y = 0.7;
    dhoti.castShadow = true;
    ramaGroup.add(dhoti);

    // Torso (Upper body & royal angavastram sash)
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.32, 1.1, 16);
    const torso = new THREE.Mesh(torsoGeo, skinMat);
    torso.position.y = 1.85;
    torso.castShadow = true;
    ramaGroup.add(torso);

    // Royal Gold Chest Armor / Necklace (Kantha Mala)
    const armorGeo = new THREE.TorusGeometry(0.36, 0.06, 12, 24);
    armorGeo.rotateX(Math.PI / 3);
    const armor = new THREE.Mesh(armorGeo, goldArmorMat);
    armor.position.y = 2.15;
    ramaGroup.add(armor);

    // Head
    const headGeo = new THREE.SphereGeometry(0.28, 20, 20);
    headGeo.scale(1, 1.15, 1);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 2.65;
    head.castShadow = true;
    ramaGroup.add(head);

    // Sacred Tilak on forehead
    const tilakGeo = new THREE.PlaneGeometry(0.04, 0.12);
    const tilakMat = new THREE.MeshBasicMaterial({ color: 0xff3b20, side: THREE.DoubleSide });
    const tilak = new THREE.Mesh(tilakGeo, tilakMat);
    tilak.position.set(0.26, 2.76, 0);
    tilak.rotation.y = Math.PI / 2;
    ramaGroup.add(tilak);

    // Royal Crown / Mukut
    const crownGeo = new THREE.ConeGeometry(0.26, 0.55, 16);
    const crown = new THREE.Mesh(crownGeo, goldArmorMat);
    crown.position.y = 3.12;
    ramaGroup.add(crown);

    // Quiver with Arrows on back
    const quiverGeo = new THREE.CylinderGeometry(0.12, 0.1, 1.2, 12);
    const quiverMat = new THREE.MeshStandardMaterial({ color: 0x6e3d16, roughness: 0.6 });
    const quiver = new THREE.Mesh(quiverGeo, quiverMat);
    quiver.position.set(-0.25, 2.0, -0.2);
    quiver.rotation.z = 0.3;
    ramaGroup.add(quiver);

    // Right Arm (Drawing bowstring)
    const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.8, 12);
    armGeo.translate(0, -0.4, 0);

    const rightArm = new THREE.Mesh(armGeo, skinMat);
    rightArm.position.set(0.35, 2.25, 0.15);
    ramaGroup.add(rightArm);

    // Left Arm (Holding Celestial Bow)
    const leftArm = new THREE.Mesh(armGeo, skinMat);
    leftArm.position.set(0.35, 2.25, -0.15);
    ramaGroup.add(leftArm);

    // Celestial Golden Bow (Kodanda)
    const bowCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.7, 1.2, -0.2),
      new THREE.Vector3(1.1, 2.2, -0.2),
      new THREE.Vector3(0.7, 3.2, -0.2),
    ]);
    const bowGeo = new THREE.TubeGeometry(bowCurve, 24, 0.045, 8, false);
    const bow = new THREE.Mesh(bowGeo, goldArmorMat);
    ramaGroup.add(bow);

    // ─────────────────────────────────────────────────────────────
    // 2. PROCEDURAL 3D RAVANA EFFIGY (TEN-HEADED FESTIVAL EFFIGY)
    // ─────────────────────────────────────────────────────────────
    const effigyGroup = new THREE.Group();
    effigyGroup.position.set(3.4, 0, 0);
    scene.add(effigyGroup);

    // Ceremonial Wooden Stage Base
    const baseStage = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.6, 0.4, 32),
      new THREE.MeshStandardMaterial({ color: 0x3d2015, roughness: 0.7 })
    );
    baseStage.position.y = 0.2;
    baseStage.receiveShadow = true;
    effigyGroup.add(baseStage);

    // Effigy Skirt / Traditional Robes (Bamboo/Paper)
    const skirtGeo = new THREE.ConeGeometry(1.6, 2.6, 16);
    skirtGeo.translate(0, 1.3, 0);
    const skirtMat = new THREE.MeshStandardMaterial({
      color: 0x9b2a1a,
      roughness: 0.6,
      metalness: 0.25,
    });
    const skirt = new THREE.Mesh(skirtGeo, skirtMat);
    skirt.position.y = 0.4;
    skirt.castShadow = true;
    effigyGroup.add(skirt);

    // Effigy Torso
    const eTorsoGeo = new THREE.CylinderGeometry(0.85, 0.95, 2.2, 16);
    const eTorsoMat = new THREE.MeshStandardMaterial({
      color: 0xd95a28,
      roughness: 0.55,
      metalness: 0.35,
    });
    const eTorso = new THREE.Mesh(eTorsoGeo, eTorsoMat);
    eTorso.position.y = 2.6;
    eTorso.castShadow = true;
    effigyGroup.add(eTorso);

    // Ten Heads Arc
    const headsContainer = new THREE.Group();
    headsContainer.position.set(0, 4.0, 0);
    effigyGroup.add(headsContainer);

    const eHeadGeo = new THREE.SphereGeometry(0.26, 16, 16);
    const eHeadMat = new THREE.MeshStandardMaterial({ color: 0x8a2414, roughness: 0.5 });
    const eCrownGeo = new THREE.ConeGeometry(0.2, 0.45, 12);
    const eCrownMat = new THREE.MeshStandardMaterial({ color: 0xffc857, metalness: 0.85, roughness: 0.2 });

    for (let h = 0; h < 10; h++) {
      const singleHead = new THREE.Group();
      const xOffset = (h - 4.5) * 0.48;
      const yOffset = -Math.abs(xOffset) * 0.12;
      const zOffset = -Math.abs(xOffset) * 0.18;
      singleHead.position.set(xOffset, yOffset, zOffset);

      const headMesh = new THREE.Mesh(eHeadGeo, eHeadMat);
      singleHead.add(headMesh);

      const crownMesh = new THREE.Mesh(eCrownGeo, eCrownMat);
      crownMesh.position.y = 0.35;
      singleHead.add(crownMesh);

      headsContainer.add(singleHead);
    }

    // Effigy Flames container
    const fireGroup = new THREE.Group();
    fireGroup.position.set(0, 2.2, 0);
    fireGroup.visible = false;
    effigyGroup.add(fireGroup);

    const flameMeshes: THREE.Mesh[] = [];
    for (let f = 0; f < 16; f++) {
      const fGeo = new THREE.ConeGeometry(0.4, 2.2, 12);
      const fMat = new THREE.MeshBasicMaterial({
        color: f % 2 === 0 ? 0xff5b22 : 0xffc857,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const fMesh = new THREE.Mesh(fGeo, fMat);
      fMesh.position.set((Math.random() - 0.5) * 2.2, Math.random() * 2.5, (Math.random() - 0.5) * 1.5);
      fireGroup.add(fMesh);
      flameMeshes.push(fMesh);
    }

    // ─────────────────────────────────────────────────────────────
    // 3. ARROW FLIGHT TRAJECTORY
    // ─────────────────────────────────────────────────────────────
    const arrowGroup = new THREE.Group();
    arrowGroup.position.set(-2.2, 2.2, 0);
    arrowGroup.visible = false;
    scene.add(arrowGroup);

    // Arrow Shaft
    const arrowShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.8, roughness: 0.2 })
    );
    arrowShaft.rotation.z = -Math.PI / 2;
    arrowGroup.add(arrowShaft);

    // Radiant Arrowhead
    const arrowhead = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.3, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    arrowhead.rotation.z = -Math.PI / 2;
    arrowhead.position.x = 0.75;
    arrowGroup.add(arrowhead);

    // Floating Sparks & Embers InstancedMesh
    const sparkCount = 80;
    const sparkGeo = new THREE.SphereGeometry(0.032, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({
      color: 0xffc857,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const sparks = new THREE.InstancedMesh(sparkGeo, sparkMat, sparkCount);
    const dummy = new THREE.Object3D();
    const sparkData = Array.from({ length: sparkCount }, () => ({
      x: (Math.random() - 0.5) * 5,
      y: Math.random() * 6,
      z: (Math.random() - 0.5) * 4,
      speed: 1.2 + Math.random() * 2.2,
      active: false,
    }));
    sparks.computeBoundingSphere();
    sparks.frustumCulled = false;
    scene.add(sparks);

    // ─────────────────────────────────────────────────────────────
    // 4. ANIMATION & KINEMATICS LOOP
    // ─────────────────────────────────────────────────────────────
    let frameId = 0;
    let arrowProgress = 0;
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
      if (!isPausedRef.current) {
        const elapsed = clock.getElapsedTime();
        const delta = clock.getDelta();
        const curPhase = phaseRef.current;

        // Kinematics for Lord Rama based on phase
        if (curPhase === 'Idle') {
          // Calm breathing
          rightArm.rotation.set(0, 0, 0.2 + Math.sin(elapsed * 2) * 0.05);
          leftArm.rotation.set(0, 0, -0.2 - Math.sin(elapsed * 2) * 0.05);
          arrowGroup.visible = false;
          fireGroup.visible = false;
          dahanFireLight.intensity = 0;
          effigyGroup.position.y = 0;
          camera.position.set(0, 4.2, 12);
        } else if (curPhase === 'Aim') {
          // Raising bow and drawing arrow
          rightArm.rotation.set(0, 0, -1.2);
          leftArm.rotation.set(0, 0, 1.2);
          arrowGroup.visible = true;
          arrowGroup.position.set(-2.0, 2.25, 0);
          arrowProgress = 0;
          camera.position.set(-1.8, 3.2, 7.5);
        } else if (curPhase === 'Release') {
          // Arm releases, arrow travels across grounds
          rightArm.rotation.set(0, 0, 0.1);
          leftArm.rotation.set(0, 0, 1.1);
          arrowGroup.visible = true;

          arrowProgress = Math.min(arrowProgress + 0.028, 1);
          arrowGroup.position.x = -2.0 + arrowProgress * 5.4;
          arrowGroup.position.y = 2.25 + Math.sin(arrowProgress * Math.PI) * 0.4;

          camera.position.set(0.5, 3.8, 8.8);

          if (arrowProgress >= 1) {
            setPhase('Dahan');
            sound.playFirework();
          }
        } else if (curPhase === 'Dahan') {
          // Arrow struck, fire engulfs effigy
          arrowGroup.visible = false;
          fireGroup.visible = true;
          dahanFireLight.intensity = 6.0 + Math.sin(elapsed * 16) * 2.5;

          flameMeshes.forEach((fl, idx) => {
            fl.scale.y = 1.0 + Math.sin(elapsed * 10 + idx) * 0.6;
            fl.scale.x = 0.8 + Math.cos(elapsed * 8 + idx) * 0.4;
          });

          // Effigy slightly tilts / dissolves
          effigyGroup.position.y = Math.max(-0.8, -elapsed * 0.05);
          camera.position.set(2.2, 3.6, 7.8);
        } else if (curPhase === 'Celebration') {
          // Effigy peacefully consumed, fireworks & golden particles
          arrowGroup.visible = false;
          fireGroup.visible = false;
          dahanFireLight.intensity = 1.5;
          effigyGroup.position.y = -1.2;
          camera.position.set(0, 4.0, 11);
        }

        // Rising embers animation
        sparkData.forEach((sp, idx) => {
          if (curPhase === 'Dahan' || curPhase === 'Celebration') {
            sp.y = (sp.y + 0.04 * sp.speed) % 6.0;
            dummy.position.set(3.4 + sp.x * 0.8, sp.y, sp.z * 0.8);
            dummy.updateMatrix();
            sparks.setMatrixAt(idx, dummy.matrix);
          }
        });
        sparks.instanceMatrix.needsUpdate = true;
      }

      camera.lookAt(0, 2.0, 0);
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
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Controls Handlers
  const startDahan = () => {
    setIsPaused(false);
    setPhase('Aim');
    setCurrentSceneIdx(2);
    if (soundEnabled) sound.playTempleBell();

    setTimeout(() => {
      setPhase('Release');
      setCurrentSceneIdx(3);
      if (soundEnabled) sound.playArrowWhoosh();
    }, 1200);

    setTimeout(() => {
      setPhase('Dahan');
      setCurrentSceneIdx(4);
      if (soundEnabled) sound.playFirework();
    }, 2800);

    setTimeout(() => {
      setPhase('Celebration');
      setCurrentSceneIdx(5);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#FFC857', '#FF8C24', '#FF5B22', '#F47AA5', '#168B78'],
      });
    }, 5500);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetScene = () => {
    setIsPaused(false);
    setPhase('Idle');
    setCurrentSceneIdx(0);
    if (soundEnabled) sound.playTempleBell();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const currentScene = STORY_SCENES[currentSceneIdx];

  return (
    <div ref={containerRef} className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[#FF8C24] font-cinzel mb-2 flex items-center justify-center gap-2">
          <Flame className="w-4 h-4 text-[#FF5B22] animate-pulse" />
          <span>VIJAYADASHAMI • THE GRAND FESTIVAL EFFIGY CEREMONY</span>
        </p>
        <h1 className="text-3xl md:text-5xl font-playfair font-bold text-saffron-gradient">
          The Grand Ravana Dahan
        </h1>
        <p className="mt-2 text-sm text-[#D6BD8B]/80 font-cinzel">
          Witness the timeless symbolic victory of truth, courage, and righteousness.
        </p>
      </div>

      {/* 3D Cinematic Canvas Container */}
      <div className="relative w-full h-[540px] md:h-[640px] rounded-3xl overflow-hidden border border-[#FF8C24]/30 bg-gradient-to-b from-[#11091a] to-[#080B1A] shadow-2xl flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top Floating Badges & Action Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="bg-[#080B1A]/85 border border-[#FF8C24]/40 px-3.5 py-1.5 rounded-full text-xs font-cinzel text-[#FFC857] flex items-center gap-2 pointer-events-auto shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#FF5B22] animate-ping" />
            <span>Phase: {phase.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-full bg-[#080B1A]/85 border border-[#FF8C24]/40 text-[#D6BD8B] hover:text-[#FFC857] transition"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-full bg-[#080B1A]/85 border border-[#FF8C24]/40 text-[#D6BD8B] hover:text-[#FFC857] transition"
              title="Full Screen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
            <button
              onClick={resetScene}
              className="px-3.5 py-2 rounded-full bg-[#080B1A]/85 border border-[#FF8C24]/40 text-xs font-cinzel text-[#D6BD8B] hover:text-[#FFC857] transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Bottom Cinematic Story Banner Overlay */}
        <div className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 glass-card p-5 md:p-6 rounded-2xl border border-[#FF8C24]/30 pointer-events-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[10px] md:text-xs font-cinzel text-[#FF8C24] uppercase tracking-widest mb-1">
              {currentScene.subhead} • {currentScene.label}
            </p>
            <h3 className="text-xl md:text-2xl font-playfair font-bold text-white mb-1.5">
              {currentScene.title}
            </h3>
            <p className="text-xs md:text-sm text-[#D6BD8B]/80 leading-relaxed">
              {currentScene.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
            {phase === 'Idle' ? (
              <button
                onClick={startDahan}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF5B22] to-[#FF8C24] text-white font-bold font-cinzel text-xs flex items-center gap-2 hover:opacity-95 transition shadow-[0_0_25px_rgba(255,91,34,0.4)] animate-pulse"
              >
                <Play className="w-4 h-4" />
                <span>START RAVANA DAHAN</span>
              </button>
            ) : (
              <>
                <button
                  onClick={togglePause}
                  className="py-3 px-4 rounded-xl bg-[#080B1A] border border-[#FF8C24]/40 text-xs font-cinzel text-[#FFC857] hover:border-[#FFC857] transition flex items-center gap-1.5"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                <button
                  onClick={resetScene}
                  className="py-3 px-5 rounded-xl bg-gradient-to-r from-[#DDAA42] to-[#FFC857] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-2 hover:opacity-95 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grand Victory Message Banner on Phase Celebration */}
      {phase === 'Celebration' && (
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[#FF5B22]/20 via-[#DDAA42]/20 to-[#FF8C24]/20 border border-[#FFC857]/60 text-center max-w-2xl animate-fadeIn">
          <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-gold-gradient tracking-wider mb-2">
            TRUTH ALWAYS TRIUMPHS OVER EVIL
          </h2>
          <p className="text-xs md:text-sm text-[#D6BD8B]/90 leading-relaxed">
            May truth always conquer darkness, and may happiness, virtue, and peace illuminate every life.
          </p>
        </div>
      )}

      {/* Storyboard 6-Stage Timeline Tabs */}
      <div className="w-full mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {STORY_SCENES.map((scene, idx) => (
          <button
            key={scene.id}
            onClick={() => {
              setCurrentSceneIdx(idx);
              setPhase(scene.phaseTrigger);
            }}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
              currentSceneIdx === idx
                ? 'border-[#FF8C24] bg-[#FF8C24]/15 text-white shadow-lg'
                : 'border-white/10 glass-card text-[#D6BD8B]/70 hover:border-white/20'
            }`}
          >
            <div>
              <p className="text-[10px] uppercase tracking-wider font-cinzel text-[#FF8C24] mb-1">
                Stage {scene.id}
              </p>
              <p className="text-xs font-bold font-playfair truncate">{scene.title}</p>
            </div>
            <div className={`h-1 w-full rounded-full mt-3 ${currentSceneIdx === idx ? 'bg-[#FF8C24]' : 'bg-white/10'}`} />
          </button>
        ))}
      </div>
    </div>
  );
};
