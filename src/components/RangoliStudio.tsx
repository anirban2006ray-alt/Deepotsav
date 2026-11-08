import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sound } from '../utils/audio';
import { 
  Palette, 
  RotateCw, 
  Undo, 
  Redo, 
  Download, 
  Trash2, 
  Sparkles, 
  Send,
  Eye,
  Layers,
  Check,
  Bookmark,
  X
} from 'lucide-react';
import { useAuth, SavedRangoliItem } from '../context/AuthContext';
import {
  getRandomPrompt,
  synthesizeRangoliFromPrompt,
  GeneratedRangoliCard,
} from '../utils/aiRangoli';

export interface RangoliStudioProps {
  onOpenProfile?: () => void;
  initialRangoli?: SavedRangoliItem | null;
}

interface RangoliElement {
  type: 'flower' | 'diya' | 'lotus' | 'peacock' | 'dot' | 'mandala';
  x: number; // distance from center (0 to 1)
  y: number; // angle in radians
  size: number;
  color: string;
}

const PALETTE = [
  { name: 'Saffron', hex: '#FF8C24' },
  { name: 'Festival Orange', hex: '#FF5B22' },
  { name: 'Golden Yellow', hex: '#FFC857' },
  { name: 'Royal Gold', hex: '#DDAA42' },
  { name: 'Rose Pink', hex: '#F47AA5' },
  { name: 'Lotus Pink', hex: '#FFB4C8' },
  { name: 'Peacock Green', hex: '#168B78' },
  { name: 'Royal Purple', hex: '#8B48B8' },
  { name: 'Deep Crimson', hex: '#C22D30' },
  { name: 'Warm Ivory', hex: '#F4EBDD' },
];

const PRESETS = [
  {
    id: 'floral',
    name: 'Traditional Floral',
    desc: 'Golden marigold petals and concentric floral rings',
    color: '#FF8C24',
    symmetry: 8,
    elements: [
      { type: 'lotus' as const, x: 0.2, y: 0, size: 28, color: '#F47AA5' },
      { type: 'flower' as const, x: 0.45, y: 0.2, size: 22, color: '#FFC857' },
      { type: 'diya' as const, x: 0.75, y: 0, size: 20, color: '#FF8C24' },
      { type: 'dot' as const, x: 0.9, y: 0.1, size: 8, color: '#DDAA42' },
    ],
  },
  {
    id: 'lotus',
    name: 'Sacred Lotus',
    desc: 'Graceful lotus blooms symbolizing purity and Goddess Lakshmi',
    color: '#F47AA5',
    symmetry: 8,
    elements: [
      { type: 'lotus' as const, x: 0.15, y: 0, size: 35, color: '#FFB4C8' },
      { type: 'lotus' as const, x: 0.45, y: 0.35, size: 26, color: '#F47AA5' },
      { type: 'dot' as const, x: 0.7, y: 0, size: 10, color: '#FFC857' },
      { type: 'diya' as const, x: 0.85, y: 0.35, size: 18, color: '#FF8C24' },
    ],
  },
  {
    id: 'peacock',
    name: 'Royal Peacock',
    desc: 'Vibrant peacock plumage in emerald green and cobalt blue',
    color: '#168B78',
    symmetry: 12,
    elements: [
      { type: 'peacock' as const, x: 0.3, y: 0, size: 26, color: '#168B78' },
      { type: 'flower' as const, x: 0.55, y: 0.15, size: 20, color: '#FFC857' },
      { type: 'dot' as const, x: 0.78, y: 0, size: 12, color: '#8B48B8' },
      { type: 'diya' as const, x: 0.9, y: 0.15, size: 16, color: '#FF8C24' },
    ],
  },
  {
    id: 'mandala',
    name: 'Geometric Mandala',
    desc: 'Infinite sacred geometric balance and harmonious lines',
    color: '#DDAA42',
    symmetry: 16,
    elements: [
      { type: 'mandala' as const, x: 0.25, y: 0, size: 30, color: '#DDAA42' },
      { type: 'dot' as const, x: 0.5, y: 0.1, size: 9, color: '#FF8C24' },
      { type: 'mandala' as const, x: 0.7, y: 0, size: 24, color: '#FFC857' },
      { type: 'dot' as const, x: 0.88, y: 0.1, size: 12, color: '#F4EBDD' },
    ],
  },
  {
    id: 'diya',
    name: 'Diwali Diya Circle',
    desc: 'A luminous ring of glowing oil lamps welcoming auspicious light',
    color: '#FFC857',
    symmetry: 8,
    elements: [
      { type: 'diya' as const, x: 0.2, y: 0, size: 24, color: '#FF8C24' },
      { type: 'flower' as const, x: 0.5, y: 0.25, size: 24, color: '#FFC857' },
      { type: 'diya' as const, x: 0.8, y: 0, size: 26, color: '#FF5B22' },
    ],
  },
  {
    id: 'royal',
    name: 'Royal Indian Durbar',
    desc: 'An ornate palace pattern infused with deep crimson and pure gold',
    color: '#C22D30',
    symmetry: 12,
    elements: [
      { type: 'mandala' as const, x: 0.2, y: 0, size: 30, color: '#DDAA42' },
      { type: 'lotus' as const, x: 0.45, y: 0.2, size: 24, color: '#C22D30' },
      { type: 'peacock' as const, x: 0.7, y: 0, size: 22, color: '#168B78' },
      { type: 'diya' as const, x: 0.88, y: 0.2, size: 18, color: '#FFC857' },
    ],
  },
];

export const RangoliStudio: React.FC<RangoliStudioProps> = ({
  onOpenProfile,
  initialRangoli,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user, saveRangoli } = useAuth();
  
  // Customization state
  const [selectedTool, setSelectedTool] = useState<RangoliElement['type']>('lotus');
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE[0].hex);
  const [symmetry, setSymmetry] = useState<number>(8);
  const [brushSize, setBrushSize] = useState<number>(24);
  const [bgColor, setBgColor] = useState<string>('#080B1A');
  const [isRotating3D, setIsRotating3D] = useState<boolean>(false);
  const [view3D, setView3D] = useState<boolean>(false);
  const [isSavingToProfile, setIsSavingToProfile] = useState<boolean>(false);

  // Rangoli elements & undo/redo history
  const [elements, setElements] = useState<RangoliElement[]>(PRESETS[0].elements);
  const [history, setHistory] = useState<RangoliElement[][]>([]);
  const [future, setFuture] = useState<RangoliElement[][]>([]);
  const [activePreset, setActivePreset] = useState<string>('floral');
  const [savedNotification, setSavedNotification] = useState<string>('');

  // AI Generation State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [generatedCard, setGeneratedCard] = useState<GeneratedRangoliCard | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);

  // If initialRangoli was passed from profile, load it
  useEffect(() => {
    if (initialRangoli) {
      try {
        const parsed = JSON.parse(initialRangoli.elementsJson);
        if (Array.isArray(parsed)) {
          setElements(parsed);
          setSymmetry(initialRangoli.symmetry || 8);
          if (initialRangoli.color) setSelectedColor(initialRangoli.color);
          setSavedNotification(`Loaded "${initialRangoli.title}" from your profile!`);
          sound.playTempleBell();
          setTimeout(() => setSavedNotification(''), 4000);
        }
      } catch (e) {
        console.error('Failed to parse initial rangoli:', e);
      }
    }
  }, [initialRangoli]);

  const saveHistorySnapshot = useCallback(() => {
    setHistory((prev) => [...prev.slice(-15), elements]);
    setFuture([]);
  }, [elements]);

  const handleSaveToProfile = async () => {
    if (!user) {
      if (onOpenProfile) {
        onOpenProfile();
      } else {
        setSavedNotification('Please sign in to save your design to your profile.');
        setTimeout(() => setSavedNotification(''), 4000);
      }
      return;
    }

    try {
      setIsSavingToProfile(true);
      const canvas = canvasRef.current;
      const thumbnail = canvas ? canvas.toDataURL('image/jpeg', 0.6) : '';
      
      const title = `Diwali Mandala ${symmetry}-Fold (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
      await saveRangoli({
        title,
        symmetry,
        color: selectedColor,
        elementsJson: JSON.stringify(elements),
        thumbnailUrl: thumbnail,
      });

      sound.playTempleBell();
      setSavedNotification('Rangoli saved to your personal profile!');
      setTimeout(() => setSavedNotification(''), 4000);
    } catch (err: any) {
      console.error('Failed to save Rangoli to profile:', err);
      setSavedNotification('Failed to save design. Please try again.');
      setTimeout(() => setSavedNotification(''), 4000);
    } finally {
      setIsSavingToProfile(false);
    }
  };

  // Canvas drawing routine
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = width * 0.45;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Outer decorative border ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(221, 170, 66, 0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius - 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 200, 87, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Center lotus core
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#DDAA42';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#21143B';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#FFC857';
    ctx.fill();

    // Draw symmetrical elements
    elements.forEach((elem) => {
      const radius = elem.x * maxRadius;
      for (let s = 0; s < symmetry; s++) {
        const angle = elem.y + (s * Math.PI * 2) / symmetry;
        const px = centerX + Math.cos(angle) * radius;
        const py = centerY + Math.sin(angle) * radius;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle + Math.PI / 2);

        // Render based on motif type
        if (elem.type === 'lotus') {
          // 3-petal lotus motif
          ctx.beginPath();
          ctx.ellipse(0, -elem.size * 0.4, elem.size * 0.35, elem.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = elem.color;
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(-elem.size * 0.35, -elem.size * 0.2, elem.size * 0.25, elem.size * 0.6, -0.4, 0, Math.PI * 2);
          ctx.fillStyle = elem.color;
          ctx.globalAlpha = 0.85;
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(elem.size * 0.35, -elem.size * 0.2, elem.size * 0.25, elem.size * 0.6, 0.4, 0, Math.PI * 2);
          ctx.fill();
        } else if (elem.type === 'flower') {
          // Round petal flower
          for (let p = 0; p < 6; p++) {
            const pAngle = (p * Math.PI) / 3;
            ctx.beginPath();
            ctx.arc(Math.cos(pAngle) * elem.size * 0.4, Math.sin(pAngle) * elem.size * 0.4, elem.size * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = elem.color;
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(0, 0, elem.size * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        } else if (elem.type === 'diya') {
          // Diya motif with flame
          ctx.beginPath();
          ctx.arc(0, 0, elem.size * 0.5, 0, Math.PI);
          ctx.fillStyle = '#DDAA42';
          ctx.fill();
          // Flame
          ctx.beginPath();
          ctx.moveTo(0, -elem.size * 0.7);
          ctx.quadraticCurveTo(elem.size * 0.3, -elem.size * 0.2, 0, 0);
          ctx.quadraticCurveTo(-elem.size * 0.3, -elem.size * 0.2, 0, -elem.size * 0.7);
          ctx.fillStyle = '#FF5B22';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, -elem.size * 0.25, elem.size * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = '#FFC857';
          ctx.fill();
        } else if (elem.type === 'peacock') {
          // Feather motif
          ctx.beginPath();
          ctx.ellipse(0, 0, elem.size * 0.4, elem.size * 0.9, 0, 0, Math.PI * 2);
          ctx.fillStyle = elem.color;
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(0, -elem.size * 0.2, elem.size * 0.2, elem.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#080B1A';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, -elem.size * 0.2, elem.size * 0.12, 0, Math.PI * 2);
          ctx.fillStyle = '#FFC857';
          ctx.fill();
        } else if (elem.type === 'dot') {
          ctx.beginPath();
          ctx.arc(0, 0, elem.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = elem.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = elem.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (elem.type === 'mandala') {
          // Intricate diamond star
          ctx.beginPath();
          ctx.moveTo(0, -elem.size * 0.8);
          ctx.lineTo(elem.size * 0.5, 0);
          ctx.lineTo(0, elem.size * 0.8);
          ctx.lineTo(-elem.size * 0.5, 0);
          ctx.closePath();
          ctx.strokeStyle = elem.color;
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, elem.size * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = elem.color;
          ctx.fill();
        }

        ctx.restore();
      }
    });
  }, [elements, symmetry, bgColor]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Handle clicking or dragging on the canvas
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = width * 0.45;

    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    const actualX = (x * scaleX) - centerX;
    const actualY = (y * scaleY) - centerY;

    const dist = Math.sqrt(actualX * actualX + actualY * actualY);
    if (dist > maxRadius) return; // outside ring

    const normRadius = dist / maxRadius;
    const angle = Math.atan2(actualY, actualX);

    saveHistorySnapshot();

    const newElement: RangoliElement = {
      type: selectedTool,
      x: normRadius,
      y: angle,
      size: brushSize,
      color: selectedColor,
    };

    setElements((prev) => [...prev, newElement]);
    sound.playTempleBell();
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    saveHistorySnapshot();
    setActivePreset(preset.id);
    setSymmetry(preset.symmetry);
    setElements(preset.elements);
    sound.playDiyaLight();
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture((prev) => [elements, ...prev]);
    setHistory((prev) => prev.slice(0, -1));
    setElements(previous);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((prev) => [...prev, elements]);
    setFuture((prev) => prev.slice(1));
    setElements(next);
  };

  const handleClear = () => {
    saveHistorySnapshot();
    setElements([]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `diwali-3d-rangoli-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setSavedNotification('Rangoli downloaded in high resolution!');
    setTimeout(() => setSavedNotification(''), 3000);
  };

  const handleSendToECard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    // Store in localStorage & dispatch custom event for E-Card page
    localStorage.setItem('diwali_custom_rangoli', dataUrl);
    window.dispatchEvent(new CustomEvent('nav-tab', { detail: 'ecard' }));
  };

  const handleGenerateAi = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || aiPrompt || getRandomPrompt();
    setAiPrompt(promptToUse);
    setIsGeneratingAi(true);
    sound.playTempleBell();

    try {
      const res = await fetch('/api/gemini/generate-rangoli-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          recipient: user?.displayName ? `${user.displayName} & Family` : 'Meera & Family',
          sender: user?.displayName || 'Anirban Ray',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        saveHistorySnapshot();
        setElements(json.data.elements);
        setSymmetry(json.data.symmetry);
        setGeneratedCard(json.data);
        setIsCardModalOpen(true);
        sound.playFirework();
        setSavedNotification(`✨ Generated "${json.data.title}" Rangoli & Wish Card!`);
        setTimeout(() => setSavedNotification(''), 4000);
      }
    } catch (_e) {
      // Fallback synthesis
      const fallback = synthesizeRangoliFromPrompt(promptToUse);
      saveHistorySnapshot();
      setElements(fallback.elements);
      setSymmetry(fallback.symmetry);
      setGeneratedCard(fallback);
      setIsCardModalOpen(true);
      sound.playFirework();
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleDownloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas || !generatedCard) return;

    // Create an offscreen card canvas
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 1200;
    cardCanvas.height = 800;
    const ctx = cardCanvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#0D1126');
    bgGrad.addColorStop(0.5, '#1E1435');
    bgGrad.addColorStop(1, '#080B1A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Decorative border
    ctx.strokeStyle = '#DDAA42';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, 1120, 720);
    ctx.strokeStyle = '#FF8C24';
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, 1104, 704);

    // Draw Headline
    ctx.fillStyle = '#FFC857';
    ctx.font = 'bold 38px serif';
    ctx.textAlign = 'center';
    ctx.fillText(generatedCard.cardHeadline, 600, 120);

    // Subtitle
    ctx.fillStyle = '#D6BD8B';
    ctx.font = '16px sans-serif';
    ctx.fillText('A MAGICAL CELEBRATION OF LIGHT', 600, 155);

    // Draw Rangoli in center left
    ctx.drawImage(canvas, 100, 220, 360, 360);

    // Draw Recipient & Wish in right area
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px serif';
    ctx.textAlign = 'left';
    ctx.fillText(`To ${generatedCard.recipient},`, 520, 260);

    ctx.fillStyle = '#F4EBDD';
    ctx.font = 'italic 20px serif';
    // Multi-line wish
    const words = generatedCard.cardWish.split(' ');
    let line = '';
    let y = 320;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 560 && n > 0) {
        ctx.fillText(line, 520, y);
        line = words[n] + ' ';
        y += 34;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 520, y);

    // Sender
    ctx.fillStyle = '#FFC857';
    ctx.font = 'bold 22px serif';
    ctx.fillText(`With love & warm wishes, ${generatedCard.sender}`, 520, y + 60);

    const link = document.createElement('a');
    link.download = `diwali-wish-card-${Date.now()}.png`;
    link.href = cardCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#DDAA42] font-cinzel mb-2">
          ✦ 3D Rangoli Studio ✦
        </p>
        <h1 className="text-3xl md:text-5xl font-playfair font-bold text-gold-gradient">
          Colour is a Celebration
        </h1>
        <p className="mt-3 text-sm md:text-base text-[#D6BD8B]/80 leading-relaxed">
          Craft harmonious mandala patterns inspired by flowers, sacred geometry, and vibrant festive powders. Seamlessly transfer your custom rangoli into your personalized Diwali E-Cards.
        </p>
      </div>

      {/* AI Rangoli & Wish Card Generator Studio Card */}
      <div className="w-full glass-card p-6 md:p-8 rounded-3xl border-2 border-[#FFC857]/40 shadow-2xl mb-8 bg-gradient-to-r from-[#1E1235] via-[#11152B] to-[#251528]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#FFC857] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#FF8C24] animate-spin" />
              <span>AI Rangoli & Wish Card Creator</span>
            </div>
            <h2 className="text-xl md:text-2xl font-playfair font-bold text-white">
              Generate Custom Rangolis & Diwali Wish Cards with AI
            </h2>
          </div>

          <button
            onClick={() => handleGenerateAi(getRandomPrompt(aiPrompt))}
            className="px-4 py-2 rounded-xl bg-[#11152B] border border-[#FFC857]/40 text-[#FFC857] hover:border-[#FF8C24] hover:bg-[#FF8C24]/10 text-xs font-cinzel flex items-center gap-2 transition"
          >
            <span>🎲</span>
            <span>Surprise Prompt</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. Royal peacock feather mandala in emerald powder, sacred lotus with gold diyas..."
            className="flex-1 bg-[#080B1A] border border-[#DDAA42]/30 rounded-xl px-4 py-2.5 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#FFC857]"
          />
          <button
            onClick={() => handleGenerateAi()}
            disabled={isGeneratingAi}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8C24] via-[#FFC857] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-50 whitespace-nowrap shadow-[0_0_20px_rgba(255,140,36,0.4)]"
          >
            {isGeneratingAi ? <span className="animate-spin">✦</span> : <Sparkles className="w-4 h-4" />}
            <span>{isGeneratingAi ? 'Generating AI Rangoli & Card…' : 'Generate AI Rangoli & Card'}</span>
          </button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-cinzel text-[#D6BD8B]/70 uppercase tracking-wider">
            Quick Prompts:
          </span>
          {[
            'Royal peacock feather mandala with emerald & gold',
            'Sacred 8-fold lotus blossom in rose pink & saffron',
            'Cosmic 16-fold sunburst with glowing earthen diyas',
            'Temple Kolam geometric rice powder & ruby vermillion',
          ].map((promptChip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setAiPrompt(promptChip);
                handleGenerateAi(promptChip);
              }}
              className="text-xs px-3 py-1 rounded-full bg-[#11152B] border border-white/10 text-[#D6BD8B] hover:border-[#FFC857] hover:text-[#FFC857] transition"
            >
              ✦ {promptChip}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-6 items-start">
        {/* Left Sidebar: Motifs & Design Tools */}
        <aside className="glass-card p-5 rounded-2xl flex flex-col gap-5 border border-[#DDAA42]/20 order-2 lg:order-1">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#D6BD8B] font-cinzel mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF8C24]" /> Select Motif
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'lotus' as const, label: 'Lotus Bloom', icon: '🪷' },
                { type: 'flower' as const, label: 'Marigold', icon: '🌸' },
                { type: 'diya' as const, label: 'Sacred Diya', icon: '🪔' },
                { type: 'peacock' as const, label: 'Peacock', icon: '🦚' },
                { type: 'mandala' as const, label: 'Star Mandala', icon: '✦' },
                { type: 'dot' as const, label: 'Glow Dot', icon: '●' },
              ].map((tool) => (
                <button
                  key={tool.type}
                  onClick={() => setSelectedTool(tool.type)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs ${
                    selectedTool === tool.type
                      ? 'border-[#FFC857] bg-[#FF8C24]/15 text-[#FFC857] font-bold shadow-[0_0_15px_rgba(255,140,36,0.2)]'
                      : 'border-white/10 hover:border-white/20 text-[#D6BD8B]/80'
                  }`}
                >
                  <span className="text-xl">{tool.icon}</span>
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-[#D6BD8B] font-cinzel mb-2 flex items-center justify-between">
              <span>Motif Size</span>
              <span className="text-[#FFC857] font-mono">{brushSize}px</span>
            </p>
            <input
              type="range"
              min="12"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full accent-[#FF8C24] h-2 bg-[#21143B] rounded-lg"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-[#D6BD8B] font-cinzel mb-2 flex items-center justify-between">
              <span>Symmetry Fold</span>
              <span className="text-[#FFC857] font-mono">{symmetry}-fold</span>
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {[4, 6, 8, 12, 16].map((s) => (
                <button
                  key={s}
                  onClick={() => setSymmetry(s)}
                  className={`py-1.5 rounded-lg text-xs font-cinzel border transition ${
                    symmetry === s
                      ? 'border-[#DDAA42] bg-[#DDAA42]/20 text-[#FFC857] font-bold'
                      : 'border-white/10 text-[#D6BD8B]/70 hover:border-white/25'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={handleClear}
              className="w-full py-2 rounded-xl border border-red-500/30 text-red-300 hover:bg-red-500/10 text-xs flex items-center justify-center gap-2 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Canvas
            </button>
          </div>
        </aside>

        {/* Center Canvas Stage */}
        <div className="flex flex-col items-center order-1 lg:order-2">
          {/* Top Canvas Controls Bar */}
          <div className="w-full flex items-center justify-between px-3 py-2 bg-[#11152B]/80 border border-[#DDAA42]/30 rounded-t-2xl text-xs text-[#D6BD8B]">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="p-1.5 rounded hover:bg-white/10 disabled:opacity-40 transition"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={future.length === 0}
                className="p-1.5 rounded hover:bg-white/10 disabled:opacity-40 transition"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
              <span className="h-4 w-px bg-white/20" />
              <button
                onClick={() => setView3D(!view3D)}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition ${
                  view3D ? 'bg-[#FF8C24] text-white font-bold' : 'hover:bg-white/10 text-[#D6BD8B]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{view3D ? '2D Flat View' : '3D Perspective'}</span>
              </button>
              <button
                onClick={() => setIsRotating3D(!isRotating3D)}
                className={`p-1.5 rounded hover:bg-white/10 transition ${
                  isRotating3D ? 'text-[#FFC857] bg-white/10' : ''
                }`}
                title="Rotate Pattern"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToProfile}
                disabled={isSavingToProfile}
                className="px-3 py-1 rounded-lg bg-[#FFC857]/15 border border-[#FFC857]/40 text-[#FFC857] hover:bg-[#FFC857]/25 transition flex items-center gap-1.5 disabled:opacity-50"
                title={user ? 'Save design to your profile' : 'Sign in & save design'}
              >
                <Bookmark className="w-3.5 h-3.5 text-[#FF8C24]" />
                <span>{isSavingToProfile ? 'Saving...' : 'Save to Profile'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1 rounded-lg bg-[#21143B] border border-[#DDAA42]/30 text-[#FFC857] hover:border-[#FFC857] transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
              <button
                onClick={handleSendToECard}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold hover:opacity-90 transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,140,36,0.3)]"
              >
                <Send className="w-3.5 h-3.5" /> Use in E-Card
              </button>
            </div>
          </div>

          {/* Interactive Rangoli Surface */}
          <div
            className={`relative w-full aspect-square max-w-[560px] bg-gradient-to-b from-[#11152B] to-[#080B1A] border-x border-b border-[#DDAA42]/30 rounded-b-2xl p-4 flex items-center justify-center overflow-hidden transition-all duration-700 ${
              view3D ? '[perspective:1000px]' : ''
            }`}
          >
            {/* Corner Decorative Brass Diyas */}
            <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-gradient-to-t from-[#DDAA42] to-[#FF8C24] shadow-[0_0_15px_#FF8C24] animate-pulse" />
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gradient-to-t from-[#DDAA42] to-[#FF8C24] shadow-[0_0_15px_#FF8C24] animate-pulse" />
            <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full bg-gradient-to-t from-[#DDAA42] to-[#FF8C24] shadow-[0_0_15px_#FF8C24] animate-pulse" />
            <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-gradient-to-t from-[#DDAA42] to-[#FF8C24] shadow-[0_0_15px_#FF8C24] animate-pulse" />

            <canvas
              ref={canvasRef}
              width={700}
              height={700}
              onClick={handleCanvasInteraction}
              className={`w-full h-full max-w-[500px] max-h-[500px] rounded-full cursor-crosshair shadow-2xl transition-transform duration-700 ${
                view3D ? '[transform:rotateX(55deg)_scale(0.9)]' : ''
              } ${isRotating3D ? 'animate-[spinSlow_30s_linear_infinite]' : ''}`}
            />

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-[11px] text-[#D6BD8B]/60 tracking-wider font-cinzel uppercase bg-[#080B1A]/80 px-4 py-1 rounded-full border border-white/5">
              Tap anywhere inside the circular ring to place motifs
            </div>
          </div>

          {savedNotification && (
            <div className="mt-3 text-xs text-[#FFC857] bg-[#11152B] border border-[#FFC857]/40 px-4 py-1.5 rounded-full flex items-center gap-2 animate-bounce">
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span>{savedNotification}</span>
            </div>
          )}
        </div>

        {/* Right Sidebar: Colors, Presets & Background */}
        <aside className="glass-card p-5 rounded-2xl flex flex-col gap-5 border border-[#DDAA42]/20 order-3">
          {/* Color Powder Palette */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#D6BD8B] font-cinzel mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#FFC857]" /> Festive Powders
            </p>
            <div className="grid grid-cols-5 gap-2">
              {PALETTE.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setSelectedColor(c.hex)}
                  className={`w-9 h-9 rounded-full border-2 transition relative flex items-center justify-center ${
                    selectedColor === c.hex ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,200,87,0.5)]' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor === c.hex && <span className="w-2 h-2 rounded-full bg-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Background Selection */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#D6BD8B] font-cinzel mb-2">Canvas Courtyard</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Midnight', hex: '#080B1A' },
                { label: 'Royal Purple', hex: '#21143B' },
                { label: 'Temple Stone', hex: '#161A28' },
                { label: 'Warm Terracotta', hex: '#3B1812' },
              ].map((bg) => (
                <button
                  key={bg.hex}
                  onClick={() => setBgColor(bg.hex)}
                  className={`py-2 px-3 rounded-lg border text-left flex items-center gap-2 transition ${
                    bgColor === bg.hex ? 'border-[#FFC857] text-[#FFC857]' : 'border-white/10 text-[#D6BD8B]/70'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: bg.hex }} />
                  <span>{bg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Starting Foundation Presets */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#D6BD8B] font-cinzel mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#168B78]" /> Starter Templates
            </p>
            <div className="flex flex-col gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-3 ${
                    activePreset === preset.id
                      ? 'border-[#FFC857] bg-[#FF8C24]/10 text-white shadow-sm'
                      : 'border-white/10 text-[#D6BD8B]/80 hover:border-white/20'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: preset.color }}
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold font-cinzel truncate">{preset.name}</p>
                    <p className="text-[10px] text-[#D6BD8B]/60 truncate">{preset.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* AI Generated Diwali Wish Card Preview Modal */}
      {isCardModalOpen && generatedCard && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 md:p-8 flex items-center justify-center animate-fadeIn"
          onClick={() => setIsCardModalOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full glass-card p-6 md:p-8 rounded-3xl border-2 border-[#FFC857]/50 shadow-[0_0_50px_rgba(255,140,36,0.35)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsCardModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#D6BD8B] hover:text-white transition"
              aria-label="Close Wish Card modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#FFC857] text-xs font-cinzel font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-[#FF8C24]" />
              <span>AI Generated Diwali Wish Card</span>
            </div>

            {/* Generated Card Visual Box */}
            <div className="relative rounded-2xl p-6 md:p-8 border-2 border-[#DDAA42]/50 bg-gradient-to-b from-[#161B3D] via-[#21143B] to-[#0A0D1E] shadow-2xl my-4 text-center overflow-hidden">
              {/* Corner Ornaments */}
              <div className="absolute top-3 left-3 text-sm text-[#FFC857]">✦</div>
              <div className="absolute top-3 right-3 text-sm text-[#FFC857]">✦</div>
              <div className="absolute bottom-3 left-3 text-sm text-[#FFC857]">✦</div>
              <div className="absolute bottom-3 right-3 text-sm text-[#FFC857]">✦</div>

              {/* Sanskrit Headline */}
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gold-gradient mb-1">
                {generatedCard.cardHeadline}
              </h2>
              <p className="text-[10px] uppercase font-cinzel text-[#D6BD8B]/80 tracking-[0.25em] mb-4">
                A MAGICAL CELEBRATION OF LIGHT
              </p>

              {/* Rendered Rangoli Mandala Image */}
              <div className="w-40 h-40 mx-auto my-3 rounded-full border border-[#DDAA42]/30 p-1 bg-[#080B1A]/80 shadow-[0_0_25px_rgba(255,200,87,0.3)]">
                {canvasRef.current && (
                  <img
                    src={canvasRef.current.toDataURL('image/png')}
                    alt={generatedCard.title}
                    className="w-full h-full rounded-full object-contain"
                  />
                )}
              </div>

              {/* Recipient */}
              <p className="text-lg md:text-xl font-playfair font-bold text-white mb-2">
                To {generatedCard.recipient},
              </p>

              {/* Poetic Wish */}
              <p className="text-xs md:text-sm font-playfair italic text-[#F4EBDD] leading-relaxed max-w-md mx-auto mb-4">
                &ldquo;{generatedCard.cardWish}&rdquo;
              </p>

              {/* Sender Signature */}
              <p className="text-xs font-cinzel font-bold text-[#FFC857] tracking-wider uppercase">
                With love & warm wishes, {generatedCard.sender}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={handleDownloadCard}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8C24] via-[#FFC857] to-[#DDAA42] text-[#080B1A] font-cinzel font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download Wish Card (PNG)</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleSendToECard}
                  className="px-4 py-2.5 rounded-xl bg-[#21143B] border border-[#FFC857]/40 text-[#FFC857] hover:border-[#FF8C24] text-xs font-cinzel flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Customize in E-Card Studio</span>
                </button>
                <button
                  onClick={handleSaveToProfile}
                  className="px-4 py-2.5 rounded-xl bg-[#11152B] border border-white/20 text-[#D6BD8B] hover:text-white text-xs font-cinzel flex items-center gap-1.5 transition"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#FF8C24]" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
