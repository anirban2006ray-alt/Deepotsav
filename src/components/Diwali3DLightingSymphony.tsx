import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Flame, 
  Upload, 
  Music, 
  Globe 
} from 'lucide-react';
import { sound } from '../utils/audio';

// --- Multilingual Greetings Dataset (10 Languages) ---
export interface MultilingualGreeting {
  readonly scriptText: string;
  readonly languageLabel: string;
}

const DIWALI_GREETINGS: readonly MultilingualGreeting[] = [
  { scriptText: 'शुभ दीपावली', languageLabel: 'Hindi • हिन्दी' },
  { scriptText: 'Happy Diwali', languageLabel: 'English' },
  { scriptText: 'শুভ দীপাবলি', languageLabel: 'Bengali • বাংলা' },
  { scriptText: 'இனிய தீபாவளி நல்வாழ்த்துக்கள்', languageLabel: 'Tamil • தமிழ்' },
  { scriptText: 'దీపావళి శుభాకాంక్షలు', languageLabel: 'Telugu • తెలుగు' },
  { scriptText: 'दिवाळीच्या हार्दिक शुभेच्छा', languageLabel: 'Marathi • मराठी' },
  { scriptText: 'દિવાળીની હાર્દિક શુભકામના', languageLabel: 'Gujarati • ગુજરાતી' },
  { scriptText: 'ਦੀਵਾਲੀ ਦੀਆਂ ਮੁਬਾਰਕਾਂ', languageLabel: 'Punjabi • ਪੰਜਾਬੀ' },
  { scriptText: 'ദീപാവലി ആശംസകൾ', languageLabel: 'Malayalam • മലയാളം' },
  { scriptText: 'दीपावल्याः शुभाशयाः', languageLabel: 'Sanskrit • संस्कृतम्' },
];

// --- Time-Synced Lyrics Timeline Matching Audio (00:00 - 00:20) ---
export interface SyncedLyricSegment {
  readonly startTimeSec: number;
  readonly endTimeSec: number;
  readonly hindiLyric: string;
  readonly romanizedLyric: string;
}

const LYRIC_TIMELINE: readonly SyncedLyricSegment[] = [
  {
    startTimeSec: 0.0,
    endTimeSec: 6.5,
    hindiLyric: 'मेरे तुम्हारे सबके लिए, हैप्पी दिवाली! 🪔',
    romanizedLyric: 'Mere tumhare sabke liye, Happy Diwali!',
  },
  {
    startTimeSec: 6.5,
    endTimeSec: 12.5,
    hindiLyric: 'सारे सितारे उसके लिए, हैप्पी दिवाली! 🌟',
    romanizedLyric: 'Saare sitaare uske liye, Happy Diwali!',
  },
  {
    startTimeSec: 12.5,
    endTimeSec: 20.0,
    hindiLyric: 'मेरे तुम्हारे सबके लिए, हैप्पी दिवाली... दिवाली! 🎆',
    romanizedLyric: 'Mere tumhare sabke liye, Happy Diwali... Diwali!',
  },
];

// --- GLSL Shaders for 3D Audio-Reactive Flame ---
const FLAME_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uBeatIntensity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    float wave = sin(uTime * 13.0 + transformed.y * 4.5) * 0.08 * transformed.y;
    transformed.x += wave;
    transformed.y *= (1.0 + uBeatIntensity * 0.45);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const FLAME_FRAGMENT_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vec3 coreColor  = vec3(1.0, 0.98, 0.78);
    vec3 midColor   = vec3(1.0, 0.58, 0.05);
    vec3 outerColor = vec3(0.95, 0.12, 0.0);

    float gradient = smoothstep(0.0, 1.0, vUv.y);
    vec3 finalColor = mix(coreColor, midColor, gradient);
    finalColor = mix(finalColor, outerColor, pow(gradient, 2.0));

    float alpha = (1.0 - pow(vUv.y, 1.55)) * 0.95;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

interface SkyLanternEntity {
  readonly mesh: THREE.Mesh;
  readonly riseSpeed: number;
  readonly swayPhase: number;
}

interface FireworkBurst {
  readonly points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  readonly velocities: THREE.Vector3[];
  lifeRemaining: number;
}

export const Diwali3DLightingSymphony: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState<number>(0);
  const [activeLyric, setActiveLyric] = useState<SyncedLyricSegment>(LYRIC_TIMELINE[0]);

  // Audio analysis refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frequencyDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  // Three.js refs for interaction
  const sceneRef = useRef<THREE.Scene | null>(null);
  const activeFireworksRef = useRef<FireworkBurst[]>([]);

  // Function to manually burst a firework
  const triggerFirework = () => {
    sound.playFirework();
    const scene = sceneRef.current;
    if (!scene) return;

    const particleCount = 160;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];

    const origin = new THREE.Vector3(
      (Math.random() - 0.5) * 22,
      5 + Math.random() * 8,
      -3 - Math.random() * 10
    );

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = origin.x;
      positions[i * 3 + 1] = origin.y;
      positions[i * 3 + 2] = origin.z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.08 + Math.random() * 0.20;

      velocities.push(
        new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed
        )
      );
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size: 0.32,
      color: new THREE.Color().setHSL(Math.random(), 1.0, 0.65),
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    activeFireworksRef.current.push({ points, velocities, lifeRemaining: 1.0 });
  };

  // Multilingual greeting rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentGreetingIndex((prev) => (prev + 1) % DIWALI_GREETINGS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x090117, 0.016);

    const camera = new THREE.PerspectiveCamera(
      58,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 6.5, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient and Point Lighting
    const ambientLight = new THREE.AmbientLight(0x4c1d95, 0.9);
    scene.add(ambientLight);

    const flameLight = new THREE.PointLight(0xff9900, 3.8, 38);
    flameLight.position.set(0, 2.7, 0);
    scene.add(flameLight);

    // Flame Shader Material
    const flameUniforms = {
      uTime: { value: 0 },
      uBeatIntensity: { value: 0 },
    };

    const flameMaterial = new THREE.ShaderMaterial({
      vertexShader: FLAME_VERTEX_SHADER,
      fragmentShader: FLAME_FRAGMENT_SHADER,
      uniforms: flameUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Helper: Create 3D Diya Mesh
    const createDiyaMesh = (scale: number): THREE.Group => {
      const group = new THREE.Group();

      const lathePoints: THREE.Vector2[] = [];
      for (let i = 0; i <= 10; i++) {
        const radius = Math.sin(i * 0.15) * 1.6;
        const height = (i - 5) * 0.14;
        lathePoints.push(new THREE.Vector2(radius, height));
      }

      const bowlGeo = new THREE.LatheGeometry(lathePoints, 32);
      const bowlMat = new THREE.MeshStandardMaterial({
        color: 0xb5451b,
        roughness: 0.42,
        metalness: 0.28,
        emissive: 0x3b0764,
        emissiveIntensity: 0.18,
      });
      group.add(new THREE.Mesh(bowlGeo, bowlMat));

      const rimGeo = new THREE.TorusGeometry(1.52, 0.08, 16, 48);
      rimGeo.rotateX(Math.PI / 2);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0xff8800,
        emissiveIntensity: 0.35,
      });
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);
      rimMesh.position.y = 0.68;
      group.add(rimMesh);

      const flameGeo = new THREE.ConeGeometry(0.38, 1.48, 24, 16);
      flameGeo.translate(0, 0.74, 0);
      const flameMesh = new THREE.Mesh(flameGeo, flameMaterial);
      flameMesh.position.set(0, 0.55, 0);
      group.add(flameMesh);

      group.scale.setScalar(scale);
      return group;
    };

    // Central Grand Diya
    const mainDiyaGroup = createDiyaMesh(1.45);
    scene.add(mainDiyaGroup);

    // Orbiting Diya Ring
    const orbitingDiyaRing = new THREE.Group();
    const count = 12;
    const ringRadius = 6.6;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const smallDiya = createDiyaMesh(0.55);
      smallDiya.position.set(
        Math.cos(angle) * ringRadius,
        -0.5,
        Math.sin(angle) * ringRadius
      );
      smallDiya.lookAt(0, -0.5, 0);
      orbitingDiyaRing.add(smallDiya);
    }
    scene.add(orbitingDiyaRing);

    // Concentric Glowing Rangoli Rings
    const rangoliFloorGroup = new THREE.Group();
    [3.2, 5.0, 6.8, 8.6].forEach((r, idx) => {
      const geo = new THREE.TorusGeometry(r, 0.045, 12, 80);
      geo.rotateX(Math.PI / 2);
      const mat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0xffbe0b : 0xff006e,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.position.y = -1.2;
      rangoliFloorGroup.add(ring);
    });
    scene.add(rangoliFloorGroup);

    // Floating Sky Lanterns (Aakash Kandil)
    const skyLanterns: SkyLanternEntity[] = [];
    const lanternGeo = new THREE.CylinderGeometry(0.35, 0.25, 0.9, 12);
    for (let i = 0; i < 45; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.06 + Math.random() * 0.08, 1.0, 0.6),
      });
      const mesh = new THREE.Mesh(lanternGeo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 45,
        Math.random() * 25 - 4,
        (Math.random() - 0.5) * 35 - 8
      );
      scene.add(mesh);
      skyLanterns.push({
        mesh,
        riseSpeed: 0.015 + Math.random() * 0.025,
        swayPhase: Math.random() * Math.PI * 2,
      });
    }

    // Initialize Audio Track
    const audio = new Audio('/assets/aistudio/whatsapp-theme-song.mpeg');
    audio.loop = true;
    audioRef.current = audio;

    let isAudioCtxConnected = false;
    const initAudioGraph = () => {
      if (isAudioCtxConnected) return;
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyserRef.current = analyser;
        frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount);

        const source = ctx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        isAudioCtxConnected = true;
      } catch (e) {
        console.warn('Audio graph initialization deferred:', e);
      }
    };

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let lastFireworkTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Compute beat intensity from real audio analyser (or fallback sine rhythm)
      let beat = 0;
      if (
        analyserRef.current &&
        frequencyDataRef.current &&
        audioRef.current &&
        !audioRef.current.paused
      ) {
        analyserRef.current.getByteFrequencyData(frequencyDataRef.current as any);
        let sum = 0;
        const bins = 16;
        for (let i = 0; i < bins; i++) {
          sum += frequencyDataRef.current[i];
        }
        beat = sum / bins / 255;
      } else {
        beat = Math.pow(Math.max(0, Math.sin(elapsed * 6.5)), 4) * 0.65;
      }

      // Update Synced Lyrics
      const playbackTime =
        audioRef.current && !audioRef.current.paused
          ? audioRef.current.currentTime
          : elapsed;
      const cycleTime = playbackTime % 19.8;
      const currentSeg =
        LYRIC_TIMELINE.find(
          (s) => cycleTime >= s.startTimeSec && cycleTime < s.endTimeSec
        ) || LYRIC_TIMELINE[0];
      setActiveLyric(currentSeg);

      // Update Flame Shader & Light
      flameUniforms.uTime.value = elapsed;
      flameUniforms.uBeatIntensity.value = beat;
      flameLight.intensity = 3.2 + beat * 3.5;
      mainDiyaGroup.scale.setScalar(1.45 + beat * 0.14);

      // Rotate Diyas & Rangoli Floor
      orbitingDiyaRing.rotation.y = elapsed * 0.35;
      rangoliFloorGroup.rotation.y = -elapsed * 0.2;

      // Update Sky Lanterns
      for (const lantern of skyLanterns) {
        lantern.mesh.position.y += lantern.riseSpeed * (1 + beat);
        lantern.mesh.position.x += Math.sin(elapsed + lantern.swayPhase) * 0.01;
        if (lantern.mesh.position.y > 22) {
          lantern.mesh.position.y = -4;
        }
      }

      // Auto-launch fireworks on beat drops
      if (elapsed - lastFireworkTime > 1.2 - beat * 0.5) {
        triggerFirework();
        lastFireworkTime = elapsed;
      }

      // Update Active Fireworks
      const fireworks = activeFireworksRef.current;
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        const posAttr = fw.points.geometry.getAttribute('position') as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        for (let j = 0; j < fw.velocities.length; j++) {
          posArray[j * 3] += fw.velocities[j].x;
          posArray[j * 3 + 1] += fw.velocities[j].y;
          posArray[j * 3 + 2] += fw.velocities[j].z;
          fw.velocities[j].y -= 0.0022; // gravity
        }

        posAttr.needsUpdate = true;
        fw.lifeRemaining -= 0.016;
        fw.points.material.opacity = Math.max(0, fw.lifeRemaining);

        if (fw.lifeRemaining <= 0) {
          scene.remove(fw.points);
          fw.points.geometry.dispose();
          fw.points.material.dispose();
          fireworks.splice(i, 1);
        }
      }

      // Smooth Gentle Camera Orbit
      camera.position.x = Math.sin(elapsed * 0.25) * 4.5;
      camera.position.y = 6.0 + Math.sin(elapsed * 0.4) * 1.2;
      camera.lookAt(0, 1.2, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleTogglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Audio play failed, triggering fireworks instead:', err);
        triggerFirework();
      }
    }
    sound.playDiyaLight();
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && audioRef.current) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      audioRef.current.play().then(() => setIsPlaying(true));
      sound.playTempleBell();
    }
  };

  const currentGreeting = DIWALI_GREETINGS[currentGreetingIndex];

  return (
    <section className="relative w-full rounded-3xl overflow-hidden border border-[#DDAA42]/40 bg-gradient-to-b from-[#110526] via-[#080B1A] to-[#140A26] shadow-[0_0_50px_rgba(255,140,36,0.25)] my-12">
      {/* Three.js Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-[520px] sm:h-[620px] relative cursor-grab active:cursor-grabbing"
      />

      {/* Decorative Gold Border Frame */}
      <div className="absolute inset-0 pointer-events-none border border-[#FFC857]/30 rounded-3xl shadow-inner" />

      {/* Top HUD: Multilingual Luminous Greetings Header */}
      <div className="absolute top-5 inset-x-0 flex flex-col items-center justify-center text-center pointer-events-none z-20 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080B1A]/80 border border-[#FFC857]/40 backdrop-blur-md mb-2 shadow-lg">
          <Flame className="w-3.5 h-3.5 text-[#FF8C24] animate-pulse" />
          <span className="font-cinzel text-[11px] font-bold text-[#FFC857] tracking-wider uppercase">
            3D Audio-Reactive Lighting & Flame Shader
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-black text-gold-gradient drop-shadow-[0_0_25px_rgba(255,183,3,0.8)] transition-all duration-500">
          {currentGreeting.scriptText}
        </h2>
        <p className="text-xs sm:text-sm font-cinzel text-[#FFD166] tracking-[0.25em] uppercase mt-1 drop-shadow">
          {currentGreeting.languageLabel}
        </p>
      </div>

      {/* Bottom HUD: Synced Hindi & Romanized Lyrics + Interactive Sound Bar */}
      <div className="absolute bottom-6 inset-x-0 flex flex-col items-center justify-center pointer-events-auto z-20 px-4 gap-3">
        {/* Karaoke Lyrics Floating Capsule */}
        <div className="max-w-xl w-full text-center px-6 py-3 rounded-full bg-[#0E0624]/85 border border-[#FFB703]/50 backdrop-blur-md shadow-[0_0_30px_rgba(255,140,0,0.35)] transition-all">
          <div className="text-base sm:text-xl font-bold text-[#FFE066] drop-shadow-[0_0_12px_#FF6D00] transition-all">
            {activeLyric.hindiLyric}
          </div>
          <div className="text-xs sm:text-sm text-[#FFD6A5] font-sans mt-0.5 opacity-90">
            {activeLyric.romanizedLyric}
          </div>
        </div>

        {/* Player & Pyrotechnic Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-[#0A031A]/90 border border-[#DDAA42]/50 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md">
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF8C24] to-[#FF5B22] text-[#080B1A] font-bold font-cinzel text-xs hover:opacity-95 transition shadow-[0_0_15px_rgba(255,140,36,0.5)]"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-[#080B1A]" />
                <span>Pause Theme</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-[#080B1A]" />
                <span>Play Theme Song</span>
              </>
            )}
          </button>

          <button
            onClick={handleToggleMute}
            className="p-2 rounded-full border border-white/20 text-[#D6BD8B] hover:text-[#FFC857] hover:border-[#FFC857] transition"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={triggerFirework}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#FFC857]/50 bg-[#FFC857]/10 text-[#FFC857] font-cinzel text-xs hover:bg-[#FFC857]/20 transition shadow-[0_0_15px_rgba(255,200,87,0.25)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF8C24]" />
            <span>Launch Firework</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/20 text-[#D6BD8B] hover:text-white hover:border-white/40 cursor-pointer font-cinzel text-xs transition">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Load Audio</span>
            <input 
              type="file" 
              accept="audio/*,video/*" 
              onChange={handleCustomAudioUpload} 
              className="hidden" 
            />
          </label>
        </div>
      </div>
    </section>
  );
};
