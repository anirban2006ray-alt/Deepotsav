import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { 
  Sparkles, 
  Flame, 
  Crown, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight
} from 'lucide-react';

interface ReturnStage {
  id: number;
  title: string;
  sanskrit: string;
  subtitle: string;
  description: string;
  visualFocus: string;
}

const STAGES: ReturnStage[] = [
  {
    id: 1,
    title: 'The City of Ayodhya Prepares',
    sanskrit: 'अयोध्या नगरी दीपोत्सव सज्ज',
    subtitle: 'Cleansing the Thresholds on Amavasya',
    description: 'News arrives that Lord Rama’s fourteen years of exile have concluded. The citizens clean their courtyards, drape marigold garlands across every palace gate, and prepare millions of earthen lamps to conquer the pitch-black moonless night.',
    visualFocus: 'Ancient temple silhouettes, flower garlands, and rows of clay diyas along the river ghats.',
  },
  {
    id: 2,
    title: 'Arrival of the Pushpaka Vimana',
    sanskrit: 'पुष्पक विमान आगमन',
    subtitle: 'Descending from the Heavens',
    description: 'As twilight falls, the celestial Pushpaka Vimana arrives above the sacred Sarayu river. Seated upon the swan-crafted chariot, Lord Rama, Goddess Sita, Lakshmana, Lord Hanuman, and Sugriva gaze down at the luminous constellation of their homeland.',
    visualFocus: 'The glowing celestial chariot sailing peacefully through the starlit sky.',
  },
  {
    id: 3,
    title: 'Bharata’s Joyful Reunion',
    sanskrit: 'भरत मिलाप व पादुका समर्पण',
    subtitle: 'Loyalty & Love Crowned in Tears of Joy',
    description: 'Prince Bharata rushes to Nandigram, shedding tears of devotion. Placing Lord Rama’s sacred wooden sandals back at his feet, Bharata embraces his elder brother as the citizens erupt in heartfelt cheer.',
    visualFocus: 'The royal brothers embracing in sacred brotherhood, surrounded by royal priests and vanaras.',
  },
  {
    id: 4,
    title: 'A Sea of Millions of Diyas',
    sanskrit: 'अमावस्या की रात्रि में प्रकाश का उत्सव',
    subtitle: 'The Historic Birth of Diwali Night',
    description: 'To ensure the dark Amavasya night cannot touch their prince, every citizen lights clay lamps. Rooftops, verandas, trees, and stone steps become a boundless constellation of warm golden flame—giving birth to Deepavali.',
    visualFocus: 'Thousands of glowing points of light transforming darkness into an ocean of gold.',
  },
  {
    id: 5,
    title: 'The Divine Coronation & Ramrajya',
    sanskrit: 'श्री राम राज्याभिषेक',
    subtitle: 'The Dawn of Peace, Virtue and Abundance',
    description: 'Surrounded by Sages Vasishtha, Gautama, and Jabali, Rama and Sita are crowned on the golden throne of Ayodhya. The bells chime, conches blow, and the golden age of Ramrajya begins—where truth, justice, and compassion guide all life.',
    visualFocus: 'The golden throne of Ayodhya with Lord Rama, Goddess Sita, and the sacred coronation crown.',
  },
];

export const DiwaliReturnScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const stage = STAGES[currentStageIdx];

  // Trigger celebration on Stage 5
  useEffect(() => {
    if (stage.id === 5) {
      if (soundEnabled) {
        sound.playTempleBell();
        sound.playFirework();
      }
      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFC857', '#FF8C24', '#DDAA42', '#F47AA5', '#168B78', '#FFFFFF'],
      });
    }
  }, [currentStageIdx, stage.id, soundEnabled]);

  // Three.js Ayodhya Panorama Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

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
    scene.background = new THREE.Color(0x0a0614);
    scene.fog = new THREE.FogExp2(0x0a0614, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4.8, 12);
    camera.lookAt(0, 1.5, 0);

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
    container.appendChild(renderer.domElement);

    // Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    const moonlight = new THREE.DirectionalLight(0xffe8ba, 2.4);
    moonlight.position.set(5, 12, 6);
    scene.add(moonlight);

    const ambientFill = new THREE.HemisphereLight(0x522d7a, 0x120822, 1.4);
    scene.add(ambientFill);

    // Sarayu River Ghats & Ground
    const riverGeo = new THREE.PlaneGeometry(35, 14);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x091c28,
      metalness: 0.6,
      roughness: 0.15,
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, -0.05, 4);
    scene.add(river);

    // Stone Steps (Ghats)
    const ghatMat = new THREE.MeshStandardMaterial({ color: 0x221830, roughness: 0.8 });
    for (let step = 0; step < 5; step++) {
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(28, 0.25, 1.2), ghatMat);
      stepMesh.position.set(0, step * 0.22, -step * 1.0);
      scene.add(stepMesh);
    }

    // Thousands of Glowing Diyas along Ghats & Temples (InstancedMesh)
    const diyaCount = 120;
    const diyaGeo = new THREE.SphereGeometry(0.065, 8, 8);
    const diyaMat = new THREE.MeshBasicMaterial({
      color: 0xffaa22,
    });
    const diyasMesh = new THREE.InstancedMesh(diyaGeo, diyaMat, diyaCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < diyaCount; i++) {
      const stepIdx = i % 5;
      const x = (Math.random() - 0.5) * 26;
      const y = stepIdx * 0.22 + 0.15;
      const z = -stepIdx * 1.0 + (Math.random() - 0.5) * 0.8;
      dummy.position.set(x, y, z);
      dummy.scale.set(1, 1.2, 1);
      dummy.updateMatrix();
      diyasMesh.setMatrixAt(i, dummy.matrix);
    }
    diyasMesh.computeBoundingSphere();
    scene.add(diyasMesh);

    // Ancient Ayodhya Palace & Temple Pillars in background
    const palaceGroup = new THREE.Group();
    palaceGroup.position.set(0, 1.2, -6.5);
    scene.add(palaceGroup);

    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x3d274c, roughness: 0.7, metalness: 0.2 });
    const goldDomeMat = new THREE.MeshStandardMaterial({ color: 0xffc857, metalness: 0.9, roughness: 0.15 });

    // Center Palace Shikhara (Temple Tower)
    const tower = new THREE.Mesh(new THREE.ConeGeometry(2.5, 6.5, 16), pillarMat);
    tower.position.set(0, 3.2, 0);
    palaceGroup.add(tower);

    const kalasha = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), goldDomeMat);
    kalasha.position.set(0, 6.6, 0);
    palaceGroup.add(kalasha);

    // Left and Right Flanking Pillars
    [-4.5, -2.2, 2.2, 4.5].forEach((px) => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 4.2, 12), pillarMat);
      pillar.position.set(px, 2.1, 0);
      palaceGroup.add(pillar);

      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), goldDomeMat);
      dome.position.set(px, 4.3, 0);
      palaceGroup.add(dome);
    });

    // Pushpaka Vimana Celestial Chariot (descending from the sky)
    const vimanaGroup = new THREE.Group();
    vimanaGroup.position.set(0, 5.5, -2);
    scene.add(vimanaGroup);

    // Swan-shaped celestial boat hull
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xffe28c, metalness: 0.9, roughness: 0.12 });
    const hull = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.8, 16), hullMat);
    hull.rotation.z = Math.PI / 2;
    vimanaGroup.add(hull);

    const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.8, 12), goldDomeMat);
    canopy.position.set(0, 1.2, 0);
    vimanaGroup.add(canopy);

    const vimanaLight = new THREE.PointLight(0xffdf88, 3.5, 12);
    vimanaLight.position.set(0, 1.0, 0);
    vimanaGroup.add(vimanaLight);

    // Floating festive flower petals / sparkles
    const sparkCount = 45;
    const sparkGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.85,
    });
    const sparks = new THREE.InstancedMesh(sparkGeo, sparkMat, sparkCount);
    const sDummy = new THREE.Object3D();
    const sparkData = Array.from({ length: sparkCount }, () => ({
      x: (Math.random() - 0.5) * 18,
      y: Math.random() * 8,
      z: (Math.random() - 0.5) * 10,
      speed: 0.8 + Math.random() * 1.5,
    }));
    sparks.computeBoundingSphere();
    scene.add(sparks);

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

      // Pushpaka Vimana gentle celestial floating
      vimanaGroup.position.y = 5.2 + Math.sin(elapsed * 1.5) * 0.35;
      vimanaGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.12;

      // Diya flicker
      vimanaLight.intensity = 3.2 + Math.sin(elapsed * 12) * 0.6;

      // Floating celebratory petals & embers
      sparkData.forEach((sp, idx) => {
        sp.y = (sp.y - 0.02 * sp.speed) < 0 ? 8 : sp.y - 0.02 * sp.speed;
        sDummy.position.set(sp.x + Math.sin(elapsed + idx) * 0.2, sp.y, sp.z);
        sDummy.updateMatrix();
        sparks.setMatrixAt(idx, sDummy.matrix);
      });
      sparks.instanceMatrix.needsUpdate = true;

      // Camera slow panorama drift
      camera.position.x = Math.sin(elapsed * 0.15) * 1.2;
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

  const handleNextStage = () => {
    if (currentStageIdx < STAGES.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
      sound.playDiyaLight();
    }
  };

  const handlePrevStage = () => {
    if (currentStageIdx > 0) {
      setCurrentStageIdx((prev) => prev - 1);
      sound.playDiyaLight();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#DDAA42] font-cinzel mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFC857]" />
          <span>SPECIAL DIWALI STORY EXPERIENCE</span>
        </p>
        <h1 className="text-3xl md:text-5xl font-playfair font-bold text-gold-gradient">
          The Return of Lord Rama to Ayodhya
        </h1>
        <p className="mt-2 text-xs md:text-sm text-[#FF8C24] font-cinzel font-bold tracking-widest uppercase">
          DIWALI – THE LIGHT OF HOPE, PEACE AND THE VICTORY OF GOOD
        </p>
        <p className="mt-3 text-xs md:text-sm text-[#D6BD8B]/80 leading-relaxed font-light">
          Step into the historic coronation night that gave birth to Diwali. Experience ancient Ayodhya illuminated by millions of glowing clay diyas as citizens welcome their beloved king and queen after fourteen years of forest exile.
        </p>
      </div>

      {/* 3D Panoramic Ayodhya Canvas */}
      <div className="relative w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden border border-[#DDAA42]/30 bg-gradient-to-b from-[#11091a] to-[#080B1A] shadow-2xl flex items-center justify-center mb-10">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="bg-[#080B1A]/85 border border-[#DDAA42]/40 px-3.5 py-1.5 rounded-full text-xs font-cinzel text-[#FFC857] flex items-center gap-2 pointer-events-auto shadow-lg">
            <Crown className="w-4 h-4 text-[#FF8C24]" />
            <span>Ayodhya Deepotsav • Stage {stage.id} of 05</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-full bg-[#080B1A]/85 border border-[#DDAA42]/40 text-[#D6BD8B] hover:text-[#FFC857] transition"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setCurrentStageIdx(0)}
              className="px-3.5 py-2 rounded-full bg-[#080B1A]/85 border border-[#DDAA42]/40 text-xs font-cinzel text-[#D6BD8B] hover:text-[#FFC857] transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Replay
            </button>
          </div>
        </div>

        {/* Bottom Narrative Banner Overlay */}
        <div className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 glass-card p-5 md:p-6 rounded-2xl border border-[#DDAA42]/30 pointer-events-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[10px] md:text-xs font-cinzel text-[#FF8C24] uppercase tracking-widest mb-1">
              {stage.subtitle} • {stage.sanskrit}
            </p>
            <h3 className="text-xl md:text-2xl font-playfair font-bold text-white mb-1.5">
              {stage.title}
            </h3>
            <p className="text-xs md:text-sm text-[#D6BD8B]/80 leading-relaxed">
              {stage.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={handlePrevStage}
              disabled={currentStageIdx === 0}
              className="p-3 rounded-xl bg-[#080B1A] border border-[#DDAA42]/30 text-white disabled:opacity-30 hover:border-[#FFC857] transition"
              title="Previous Stage"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {currentStageIdx < STAGES.length - 1 ? (
              <button
                onClick={handleNextStage}
                className="py-3 px-5 rounded-xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-2 hover:opacity-95 transition shadow-[0_0_20px_rgba(255,140,36,0.3)]"
              >
                <span>Continue Homecoming</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentStageIdx(0)}
                className="py-3 px-5 rounded-xl bg-gradient-to-r from-[#DDAA42] to-[#FFC857] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-2 hover:opacity-95 transition shadow-lg"
              >
                <span>Celebrate Again</span>
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5-Stage Storyboard Navigation Strip */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {STAGES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentStageIdx(idx)}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
              currentStageIdx === idx
                ? 'border-[#FFC857] bg-[#FF8C24]/15 text-white shadow-lg'
                : 'border-white/10 glass-card text-[#D6BD8B]/70 hover:border-white/20'
            }`}
          >
            <div>
              <p className="text-[10px] uppercase tracking-wider font-cinzel text-[#FF8C24] mb-1">
                Stage 0{s.id}
              </p>
              <p className="text-xs font-bold font-playfair truncate">{s.title}</p>
            </div>
            <div className={`h-1 w-full rounded-full mt-3 ${currentStageIdx === idx ? 'bg-[#FFC857]' : 'bg-white/10'}`} />
          </button>
        ))}
      </div>
    </div>
  );
};
