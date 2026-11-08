import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { 
  Sparkles, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Wand2, 
  Upload, 
  Image as ImageIcon, 
  Heart, 
  Plus, 
  Trash2, 
  Bookmark,
  Send,
  RefreshCw,
  Compass,
  Flame,
  Star
} from 'lucide-react';
import { useAuth, SavedECardItem } from '../context/AuthContext';

export interface ECardGeneratorProps {
  onOpenProfile?: () => void;
  initialCard?: SavedECardItem | null;
}

interface StickerItem {
  id: string;
  emoji: string;
  name: string;
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  size: number;
}

const STICKER_LIBRARY = [
  { emoji: '🪔', name: 'Diya' },
  { emoji: '✨', name: 'Sparkles' },
  { emoji: '🎆', name: 'Firework' },
  { emoji: '🌸', name: 'Marigold' },
  { emoji: '🪷', name: 'Lotus' },
  { emoji: '🕉️', name: 'Om' },
  { emoji: '卐', name: 'Swastika' },
  { emoji: '🍬', name: 'Sweets' },
  { emoji: '🐘', name: 'Elephant' },
];

const PRE_WRITTEN_WISHES = [
  {
    category: 'First Picture Classic',
    text: 'One flame can illuminate a thousand dark paths. May this Diwali kindle your boldest ambitions, creative brilliance, and joyous togetherness.',
  },
  {
    category: 'Heartfelt & Family',
    text: 'May the divine light of Diwali illuminate your home with boundless prosperity, sound health, and eternal happiness. Wishing you and your family a luminous festival of lights!',
  },
  {
    category: 'Joy & Friendship',
    text: 'May this festival of lights burn away all sorrows and brighten your life with warmth, laughter, and extraordinary new beginnings. Happy Diwali!',
  },
  {
    category: 'Peace & Spirituality',
    text: 'तमसो मा ज्योतिर्गमय — From darkness unto light, from ignorance unto truth. May Goddess Lakshmi and Lord Ganesha bless you with inner radiance, peace, and abundance.',
  },
  {
    category: 'Triumph & Wisdom',
    text: 'Just as the earthen diya fearlessly embraces the night, may your inner courage conquer every uncertainty. Wishing you victorious joy this Deepotsav!',
  },
];

export interface BackdropOption {
  id: string;
  name: string;
  url: string;
  borderColor: string;
  innerBorderColor: string;
  cornerColor: string;
}

const BACKDROP_PRESETS: BackdropOption[] = [
  {
    id: 'city-fireworks',
    name: 'Night City Fireworks (First Picture Aesthetic)',
    url: '/assets/aistudio/image_376c0228.png',
    borderColor: '#1D5C4E',
    innerBorderColor: 'rgba(255, 200, 87, 0.4)',
    cornerColor: '#FFC857',
  },
  {
    id: 'ayodhya-deepotsav',
    name: 'Ayodhya Saryu Ghat (Floating Lamps)',
    url: 'https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?auto=format&fit=crop&w=1200&q=85',
    borderColor: '#DDAA42',
    innerBorderColor: 'rgba(255, 140, 36, 0.4)',
    cornerColor: '#FF8C24',
  },
  {
    id: 'golden-sky-fireworks',
    name: 'Golden Aerial Sky Burst',
    url: 'https://images.unsplash.com/photo-1699854227507-4b9ff940652a?auto=format&fit=crop&w=1200&q=85',
    borderColor: '#FF8C24',
    innerBorderColor: 'rgba(255, 200, 87, 0.4)',
    cornerColor: '#FFC857',
  },
  {
    id: 'varanasi-brass',
    name: 'Sacred Varanasi Brass Diyas',
    url: 'https://images.unsplash.com/photo-1577083753695-e010191bacb5?auto=format&fit=crop&w=1200&q=85',
    borderColor: '#FFC857',
    innerBorderColor: 'rgba(221, 170, 66, 0.4)',
    cornerColor: '#FF8C24',
  },
  {
    id: 'pure-midnight',
    name: 'Royal Midnight Velvet (Minimalist)',
    url: '',
    borderColor: '#DDAA42',
    innerBorderColor: 'rgba(255, 200, 87, 0.3)',
    cornerColor: '#FFC857',
  },
];

const PROMPT_SUGGESTIONS = [
  'A warm Diwali card for my grandparents in Jaipur with blessings for good health and peaceful days',
  'Card for my childhood friend Priya reminiscing about making rangoli and lighting anars together',
  'Energetic, celebratory greeting for my startup team celebrating our achievements and future growth',
  'Heartfelt blessings for Meera & Family with prosperity, joyous laughter, and sweet beginnings',
];

export const ECardGenerator: React.FC<ECardGeneratorProps> = ({
  onOpenProfile,
  initialCard,
}) => {
  const cardPreviewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, saveECard } = useAuth();

  // Form details
  const [recipient, setRecipient] = useState<string>('Meera & Family');
  const [sender, setSender] = useState<string>('Anirban Ray');
  const [headline, setHeadline] = useState<string>('शुभ दीपावली');
  const [message, setMessage] = useState<string>(PRE_WRITTEN_WISHES[0].text);
  const [selectedBackdropId, setSelectedBackdropId] = useState<string>('city-fireworks');

  // AI Prompt Generation State
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [isGeneratingWithAi, setIsGeneratingWithAi] = useState<boolean>(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string>('');

  // Custom Uploaded or Rangoli Studio background
  const [customRangoliDataUrl, setCustomRangoliDataUrl] = useState<string | null>(null);
  const [backdropDarkness, setBackdropDarkness] = useState<number>(45);

  // Festive stickers on the card
  const [stickers, setStickers] = useState<StickerItem[]>([
    { id: '1', emoji: '🪔', name: 'Diya', x: 19, y: 16, size: 40 },
    { id: '2', emoji: '✨', name: 'Sparkles', x: 81, y: 16, size: 36 },
  ]);

  const [isSavingToProfile, setIsSavingToProfile] = useState<boolean>(false);
  const [shareStatus, setShareStatus] = useState<string>('');

  // Check URL query parameters and localStorage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('to')) setRecipient(params.get('to')!);
    if (params.get('from')) setSender(params.get('from')!);
    if (params.get('wish')) setMessage(params.get('wish')!);

    const storedRangoli = localStorage.getItem('diwali_custom_rangoli');
    if (storedRangoli) {
      setCustomRangoliDataUrl(storedRangoli);
    }
  }, []);

  // If initialCard passed from user profile, populate it
  useEffect(() => {
    if (initialCard) {
      setRecipient(initialCard.recipient);
      setSender(initialCard.sender);
      setMessage(initialCard.message);
      setShareStatus(`Loaded card for "${initialCard.recipient}" from your profile!`);
      sound.playTempleBell();
      setTimeout(() => setShareStatus(''), 4000);
    }
  }, [initialCard]);

  const currentBackdrop = BACKDROP_PRESETS.find((b) => b.id === selectedBackdropId) || BACKDROP_PRESETS[0];

  // AI Prompt-to-Card Full Generation
  const handleGenerateCardFromPrompt = async (promptTextOverride?: string) => {
    const promptToUse = promptTextOverride || userPrompt;
    if (!promptToUse.trim()) {
      setShareStatus('Please type a prompt describing who the card is for or its mood.');
      setTimeout(() => setShareStatus(''), 3000);
      return;
    }

    setIsGeneratingWithAi(true);
    setAiSuccessMessage('');
    try {
      const response = await fetch('/api/gemini/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          recipient,
          sender,
        }),
      });

      const data = await response.json();
      if (data.card) {
        if (data.card.recipient) setRecipient(data.card.recipient);
        if (data.card.sender) setSender(data.card.sender);
        if (data.card.headline) setHeadline(data.card.headline);
        if (data.card.wish) setMessage(data.card.wish);

        // Map suggested backdrop
        if (data.card.backdrop) {
          const match = BACKDROP_PRESETS.find((b) => b.id.includes(data.card.backdrop) || data.card.backdrop.includes(b.id));
          if (match) setSelectedBackdropId(match.id);
        }

        // Apply suggested stickers if provided
        if (Array.isArray(data.card.stickerEmojis) && data.card.stickerEmojis.length > 0) {
          const newStickers: StickerItem[] = [
            { id: `st-left-${Date.now()}`, emoji: data.card.stickerEmojis[0] || '🪔', name: 'Sticker 1', x: 19, y: 16, size: 40 },
            { id: `st-right-${Date.now()}`, emoji: data.card.stickerEmojis[1] || '✨', name: 'Sticker 2', x: 81, y: 16, size: 36 },
          ];
          setStickers(newStickers);
        }

        sound.playTempleBell();
        sound.playFirework();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFC857', '#FF8C24', '#168B78', '#FFFFFF'],
        });

        setAiSuccessMessage(`✨ Designed complete card based on: "${promptToUse.slice(0, 40)}..."`);
        setTimeout(() => setAiSuccessMessage(''), 5000);
      }
    } catch (err) {
      console.error('Failed to generate card with AI:', err);
      setShareStatus('Could not reach AI generator. Using authentic fallback wish.');
      setTimeout(() => setShareStatus(''), 4000);
    } finally {
      setIsGeneratingWithAi(false);
    }
  };

  const handleSaveToProfile = async () => {
    if (!user) {
      if (onOpenProfile) {
        onOpenProfile();
      } else {
        setShareStatus('Please sign in with Google to save your E-Cards.');
        setTimeout(() => setShareStatus(''), 4000);
      }
      return;
    }

    try {
      setIsSavingToProfile(true);
      await saveECard({
        recipient,
        sender,
        message,
        theme: selectedBackdropId,
      });

      sound.playTempleBell();
      setShareStatus('E-Card saved to your personal profile account!');
      setTimeout(() => setShareStatus(''), 4000);
    } catch (err: any) {
      console.error('Failed to save e-card to profile:', err);
      setShareStatus('Could not save card. Please try again.');
      setTimeout(() => setShareStatus(''), 4000);
    } finally {
      setIsSavingToProfile(false);
    }
  };

  const addSticker = (emoji: string, name: string) => {
    const newSticker: StickerItem = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      name,
      x: 35 + Math.random() * 30,
      y: 70 + Math.random() * 15,
      size: 34,
    };
    setStickers((prev) => [...prev, newSticker]);
    sound.playDiyaLight();
  };

  const removeSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomRangoliDataUrl(event.target.result as string);
          sound.playTempleBell();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // High-Resolution PNG Download matching the First Picture exact visual aesthetic
  const handleDownloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderCardOnCanvas = (bgImg?: HTMLImageElement | null) => {
      // 1. Draw Background Image or Fallback Gradient
      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, 1200, 800);
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
        bgGrad.addColorStop(0, '#080B1A');
        bgGrad.addColorStop(0.5, '#121A30');
        bgGrad.addColorStop(1, '#050711');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1200, 800);
      }

      // 2. Dark Atmospheric Tint Overlay for High-Contrast Glow (matches First Picture)
      ctx.fillStyle = `rgba(5, 10, 20, ${backdropDarkness / 100})`;
      ctx.fillRect(0, 0, 1200, 800);

      // 3. Double Ornate Borders with Subtle Rounded Inset
      ctx.strokeStyle = currentBackdrop.borderColor;
      ctx.lineWidth = 3.5;
      ctx.strokeRect(36, 36, 1128, 728);

      ctx.strokeStyle = currentBackdrop.innerBorderColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(48, 48, 1104, 704);

      // 4. Four 4-Pointed Golden Star Corner Ornaments (✦) matching First Picture!
      const drawFourPointStar = (cx: number, cy: number, size: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.fillStyle = currentBackdrop.cornerColor;
        ctx.shadowColor = 'rgba(255, 200, 87, 0.9)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.quadraticCurveTo(0, 0, size, 0);
        ctx.quadraticCurveTo(0, 0, 0, size);
        ctx.quadraticCurveTo(0, 0, -size, 0);
        ctx.quadraticCurveTo(0, 0, 0, -size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      drawFourPointStar(48, 48, 12);
      drawFourPointStar(1152, 48, 12);
      drawFourPointStar(48, 752, 12);
      drawFourPointStar(1152, 752, 12);

      // 5. Centered Glowing Sanskrit / Hindi Headline
      ctx.save();
      ctx.shadowColor = 'rgba(255, 200, 87, 0.85)';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#FFC857';
      ctx.font = 'bold 58px "Noto Sans Devanagari", "Tiro Devanagari Hindi", serif';
      ctx.textAlign = 'center';
      ctx.fillText(headline || 'शुभ दीपावली', 600, 170);
      ctx.restore();

      // 6. Subtitle Tracked Uppercase
      ctx.font = 'bold 18px Cinzel, serif';
      ctx.fillStyle = '#D6BD8B';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '4px';
      ctx.fillText('A MAGICAL CELEBRATION OF LIGHT', 600, 218);
      ctx.letterSpacing = '0px';

      // 7. Recipient (Exact format from picture: DEAR MEERA & FAMILY,)
      const recText = `DEAR ${recipient.toUpperCase() || 'LOVED ONES'},`;
      ctx.font = 'bold 32px Georgia, serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '1.5px';
      ctx.fillText(recText, 600, 340);
      ctx.letterSpacing = '0px';

      // 8. Message Body in Elegant Italic Quotes
      ctx.font = 'italic 26px Georgia, serif';
      ctx.fillStyle = '#F4EBDD';
      const cleanMsg = message.replace(/^["“”]/, '').replace(/["“”]$/, '');
      const fullQuotedMsg = `"${cleanMsg}"`;
      
      const words = fullQuotedMsg.split(' ');
      let line = '';
      let y = 415;
      words.forEach((w) => {
        const testLine = `${line}${w} `;
        if (ctx.measureText(testLine).width > 880) {
          ctx.fillText(line.trim(), 600, y);
          line = `${w} `;
          y += 44;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line.trim(), 600, y);

      // 9. Bottom Footer Bar (DIWALI 3D on bottom left, WITH LOVE, <SENDER> on bottom right)
      ctx.font = 'bold 18px Cinzel, serif';
      ctx.fillStyle = '#D6BD8B';
      ctx.textAlign = 'left';
      ctx.fillText('DIWALI 3D', 90, 715);

      ctx.font = 'bold 22px Georgia, serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'right';
      const senderSignature = `WITH LOVE, ${sender.toUpperCase() || 'A FRIEND'}`;
      ctx.fillText(senderSignature, 1110, 715);

      // 10. Stickers placed on card
      stickers.forEach((st) => {
        ctx.font = `${st.size * 1.5}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(st.emoji, (st.x / 100) * 1200, (st.y / 100) * 800);
      });

      // 11. Trigger PNG File Download
      const link = document.createElement('a');
      link.download = `diwali-ecard-for-${(recipient || 'family').toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      sound.playTempleBell();
      setShareStatus('Card downloaded in crystal-clear high resolution!');
      setTimeout(() => setShareStatus(''), 4000);
    };

    // Load selected backdrop image
    const targetUrl = customRangoliDataUrl || currentBackdrop.url;
    if (targetUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => renderCardOnCanvas(img);
      img.onerror = () => renderCardOnCanvas(null);
      img.src = targetUrl;
    } else {
      renderCardOnCanvas(null);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `🪔 *${headline}*\n\nDear ${recipient},\n\n"${message}"\n\n— With love, ${sender}\n\nCelebrate Diwali in 3D: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('to', recipient);
    url.searchParams.set('from', sender);
    url.searchParams.set('wish', message);
    navigator.clipboard.writeText(url.toString());
    setShareStatus('Personalized greeting link copied to clipboard!');
    sound.playDiyaLight();
    setTimeout(() => setShareStatus(''), 4000);
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#11152B] border border-[#DDAA42]/30 text-xs font-cinzel text-[#FFC857] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#FF8C24]" />
          <span>DIGITAL DIWALI E-CARD STUDIO & AI DESIGNER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-white mb-3">
          Spread the Light of Happiness
        </h1>
        <p className="text-xs sm:text-sm text-[#D6BD8B]/80 leading-relaxed">
          Create a personalized, luminous Diwali greeting card. Use our Prompt-to-Card AI engine, choose classic night-sky fireworks backdrops, and share with loved ones worldwide.
        </p>
      </div>

      {/* ✦ PROMPT-TO-CARD AI STUDIO (User Request 2) ✦ */}
      <div className="mb-10 p-5 md:p-7 rounded-3xl bg-gradient-to-r from-[#141933] via-[#101326] to-[#24130A] border-2 border-[#FFC857]/50 shadow-[0_0_30px_rgba(255,200,87,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF8C24]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF8C24] to-[#DDAA42] flex items-center justify-center text-[#080B1A] font-bold shadow-md">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-playfair text-lg md:text-xl font-bold text-white">
                Prompt-to-Card AI Designer
              </h2>
              <p className="text-xs text-[#D6BD8B]/80">
                Describe who you're making the card for and the tone you want. Gemini AI will craft the blessing, theme, and ornaments instantly!
              </p>
            </div>
          </div>
        </div>

        {/* Prompt Input Field */}
        <div className="flex flex-col sm:flex-row gap-3 relative z-10 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerateCardFromPrompt();
              }}
              placeholder="e.g. A warm, nostalgic card for my sister Priya in London, recalling our childhood memories of making sweets and lighting diyas together..."
              className="w-full py-3.5 px-4 pl-11 rounded-2xl bg-[#080B1A]/90 border border-[#DDAA42]/40 text-sm text-white placeholder-[#D6BD8B]/50 focus:border-[#FFC857] focus:outline-none focus:ring-2 focus:ring-[#FFC857]/30 transition"
            />
            <Sparkles className="w-4 h-4 text-[#FF8C24] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={() => handleGenerateCardFromPrompt()}
            disabled={isGeneratingWithAi}
            className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-cinzel font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition shadow-[0_0_20px_rgba(255,140,36,0.4)] disabled:opacity-50 shrink-0"
          >
            {isGeneratingWithAi ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#080B1A]" />
                <span>Designing Card...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-[#080B1A]" />
                <span>Generate Card with AI</span>
              </>
            )}
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 flex-wrap relative z-10">
          <span className="text-[11px] font-cinzel text-[#D6BD8B]/70 shrink-0">Try Prompts:</span>
          {PROMPT_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUserPrompt(sug);
                handleGenerateCardFromPrompt(sug);
              }}
              className="text-[11px] py-1 px-2.5 rounded-full bg-white/5 border border-white/10 text-[#D6BD8B] hover:text-white hover:border-[#FFC857] hover:bg-white/10 transition truncate max-w-xs"
            >
              {sug}
            </button>
          ))}
        </div>

        {aiSuccessMessage && (
          <div className="mt-3 text-xs text-[#FFC857] font-cinzel flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-3.5 h-3.5 text-green-400" />
            <span>{aiSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Main Designer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Controls & Customization */}
        <div className="lg:col-span-5 bg-[#11152B]/80 border border-[#DDAA42]/30 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-6">
          <div>
            <h2 className="font-playfair text-xl font-bold text-white mb-1">
              Personalize Your Card
            </h2>
            <p className="text-xs text-[#D6BD8B]/80">
              Customize the recipient, heartfelt message, backdrop, and festive ornamentation.
            </p>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D6BD8B] font-cinzel mb-1.5">
                Recipient Name
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Meera & Family"
                className="w-full p-3 rounded-xl bg-[#080B1A] border border-white/10 text-white text-sm focus:border-[#FFC857] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D6BD8B] font-cinzel mb-1.5">
                Sender Name
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. Anirban Ray"
                className="w-full p-3 rounded-xl bg-[#080B1A] border border-white/10 text-white text-sm focus:border-[#FFC857] focus:outline-none"
              />
            </div>
          </div>

          {/* Headline Invocation */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D6BD8B] font-cinzel mb-1.5">
              Card Headline / Invocation
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. शुभ दीपावली"
              className="w-full p-3 rounded-xl bg-[#080B1A] border border-white/10 text-[#FFC857] font-serif text-base focus:border-[#FFC857] focus:outline-none"
            />
          </div>

          {/* Backdrop Presets (Crucial for User Request 1) */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D6BD8B] font-cinzel mb-2">
              Festival Backdrop (Matches Picture 1)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {BACKDROP_PRESETS.map((bp) => {
                const isSelected = selectedBackdropId === bp.id;
                return (
                  <button
                    key={bp.id}
                    onClick={() => {
                      setSelectedBackdropId(bp.id);
                      setCustomRangoliDataUrl(null);
                      sound.playDiyaLight();
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1A1F3C] border-[#FFC857] text-white shadow-md'
                        : 'bg-[#080B1A] border-white/10 text-[#D6BD8B]/80 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg border border-white/20 bg-cover bg-center shrink-0"
                        style={{
                          backgroundImage: bp.url ? `url(${bp.url})` : 'none',
                          backgroundColor: '#080B1A',
                        }}
                      />
                      <span className="font-cinzel truncate">{bp.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#FFC857] shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Background Upload / Opacity */}
            <div className="mt-3 flex items-center justify-between gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-1.5 px-3 rounded-lg bg-[#080B1A] border border-white/10 text-xs text-[#D6BD8B] hover:text-white hover:border-[#FFC857] transition flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Image</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-[#D6BD8B]">
                <span>Vignette:</span>
                <input
                  type="range"
                  min="20"
                  max="70"
                  value={backdropDarkness}
                  onChange={(e) => setBackdropDarkness(Number(e.target.value))}
                  className="w-20 accent-[#FF8C24] h-1"
                />
              </div>
            </div>
          </div>

          {/* Message Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs uppercase tracking-wider text-[#D6BD8B] font-cinzel">
                Your Diwali Message
              </label>
              <button
                onClick={() => handleGenerateCardFromPrompt(`Warm heartfelt blessing for ${recipient}`)}
                className="text-xs text-[#FFC857] hover:underline flex items-center gap-1 font-cinzel"
              >
                <Wand2 className="w-3 h-3 text-[#FF8C24]" />
                <span>Quick AI Wish</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#080B1A] border border-white/10 text-white text-sm focus:border-[#FFC857] focus:outline-none leading-relaxed italic font-serif"
            />

            {/* Pre-written wish shortcuts */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRE_WRITTEN_WISHES.map((w) => (
                <button
                  key={w.category}
                  onClick={() => {
                    setMessage(w.text);
                    sound.playDiyaLight();
                  }}
                  className="text-[11px] py-1 px-2.5 rounded-lg bg-[#080B1A] border border-white/10 text-[#D6BD8B]/80 hover:text-white hover:border-[#FFC857] transition"
                >
                  {w.category}
                </button>
              ))}
            </div>
          </div>

          {/* Festive Stickers Tray */}
          <div className="border-t border-white/10 pt-4">
            <label className="block text-xs uppercase tracking-wider text-[#D6BD8B] font-cinzel mb-2">
              Add Festive Stickers (Drag / Click to Place)
            </label>
            <div className="flex flex-wrap gap-2">
              {STICKER_LIBRARY.map((st) => (
                <button
                  key={st.name}
                  onClick={() => addSticker(st.emoji, st.name)}
                  className="px-3 py-1.5 rounded-xl bg-[#080B1A] border border-white/10 hover:border-[#FFC857] flex items-center gap-1.5 text-xs text-[#F4EBDD] transition hover:scale-105"
                >
                  <span className="text-base">{st.emoji}</span>
                  <span>{st.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Live E-Card Preview (Identical to First Picture!) */}
        <div className="lg:col-span-7 flex flex-col items-center gap-5 sticky top-24">
          <div className="text-xs uppercase tracking-widest text-[#FFC857] font-cinzel flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8C24]" />
            <span>Real-Time E-Card Live Preview (Matches First Picture)</span>
          </div>

          {/* ✦ THE CARD (Styled exactly like image_376c0228.png) ✦ */}
          <div
            ref={cardPreviewRef}
            className="relative w-full aspect-[4/3] rounded-3xl p-6 md:p-10 border-2 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col justify-between text-center select-none"
            style={{
              borderColor: currentBackdrop.borderColor,
              backgroundColor: '#080B1A',
            }}
          >
            {/* Photographic Background (Night City Fireworks) */}
            {(customRangoliDataUrl || currentBackdrop.url) && (
              <img
                src={customRangoliDataUrl || currentBackdrop.url}
                alt="Diwali Backdrop"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            )}

            {/* Dark Vignette Overlay for High Legibility & Glow */}
            <div
              className="absolute inset-0 pointer-events-none transition-colors"
              style={{ backgroundColor: `rgba(5, 10, 20, ${backdropDarkness / 100})` }}
            />

            {/* Double Border matching the first picture */}
            <div
              className="absolute inset-3 rounded-2xl border pointer-events-none"
              style={{ borderColor: currentBackdrop.innerBorderColor }}
            />
            <div
              className="absolute inset-4 rounded-xl border border-white/10 pointer-events-none"
            />

            {/* Four 4-Pointed Golden Star Corner Ornaments (✦) */}
            <div className="absolute top-4 left-4 text-[#FFC857] text-base drop-shadow-[0_0_8px_rgba(255,200,87,0.9)] pointer-events-none">
              ✦
            </div>
            <div className="absolute top-4 right-4 text-[#FFC857] text-base drop-shadow-[0_0_8px_rgba(255,200,87,0.9)] pointer-events-none">
              ✦
            </div>
            <div className="absolute bottom-4 left-4 text-[#FFC857] text-base drop-shadow-[0_0_8px_rgba(255,200,87,0.9)] pointer-events-none">
              ✦
            </div>
            <div className="absolute bottom-4 right-4 text-[#FFC857] text-base drop-shadow-[0_0_8px_rgba(255,200,87,0.9)] pointer-events-none">
              ✦
            </div>

            {/* Placed Stickers on the card */}
            {stickers.map((st) => (
              <div
                key={st.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                style={{
                  left: `${st.x}%`,
                  top: `${st.y}%`,
                  fontSize: `${st.size}px`,
                }}
                onClick={() => removeSticker(st.id)}
                title="Click to remove sticker"
              >
                <span className="drop-shadow-lg filter">{st.emoji}</span>
                <span className="opacity-0 group-hover:opacity-100 absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] bg-red-600 text-white px-1 rounded transition">
                  ×
                </span>
              </div>
            ))}

            {/* Header: Glowing Devanagari Headline + Diya & Star */}
            <div className="relative z-10 pt-2">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#FFC857] drop-shadow-[0_0_20px_rgba(255,200,87,0.85)] tracking-wide">
                {headline || 'शुभ दीपावली'}
              </h2>
              <p className="text-[10px] md:text-xs font-cinzel text-[#D6BD8B] tracking-[0.28em] uppercase mt-1 drop-shadow-md">
                A Magical Celebration of Light
              </p>
            </div>

            {/* Body: Recipient & Quoted Message (Exact First Picture typography) */}
            <div className="relative z-10 px-4 md:px-8 my-auto">
              <p className="text-base sm:text-lg md:text-xl font-bold font-serif text-white tracking-wider uppercase mb-3 drop-shadow-md">
                DEAR {recipient || 'MEERA & FAMILY'},
              </p>
              <p className="text-xs sm:text-sm md:text-base font-serif italic text-[#F4EBDD] leading-relaxed max-w-xl mx-auto drop-shadow-md">
                "{message.replace(/^["“”]/, '').replace(/["“”]$/, '')}"
              </p>
            </div>

            {/* Bottom Row: DIWALI 3D on bottom left, WITH LOVE, <SENDER> on bottom right */}
            <div className="relative z-10 border-t border-white/10 pt-3 flex items-center justify-between text-xs md:text-sm font-serif">
              <span className="font-cinzel text-xs text-[#D6BD8B] tracking-wider">
                DIWALI 3D
              </span>
              <span className="font-bold text-white tracking-wider uppercase drop-shadow-md">
                WITH LOVE, {sender || 'ANIRBAN RAY'}
              </span>
            </div>
          </div>

          {/* Status Message */}
          {shareStatus && (
            <div className="w-full text-center py-2 px-4 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-xs font-cinzel flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>{shareStatus}</span>
            </div>
          )}

          {/* Save to Personal Profile Account */}
          <button
            onClick={handleSaveToProfile}
            disabled={isSavingToProfile}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FFC857]/20 to-[#FF8C24]/20 border border-[#FFC857]/50 text-[#FFC857] hover:bg-[#FFC857]/30 font-bold font-cinzel text-xs flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
          >
            <Bookmark className="w-4 h-4 text-[#FF8C24]" />
            <span>
              {isSavingToProfile
                ? 'Saving to Profile...'
                : user
                ? 'Save E-Card to My Profile Account'
                : 'Sign In & Save E-Card to Profile'}
            </span>
          </button>

          {/* Action Sharing Buttons */}
          <div className="w-full grid grid-cols-3 gap-3">
            <button
              onClick={handleDownloadCard}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center justify-center gap-2 hover:opacity-95 transition shadow-[0_0_20px_rgba(255,140,36,0.3)]"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="py-3 px-4 rounded-2xl bg-[#168B78] text-white font-bold font-cinzel text-xs flex items-center justify-center gap-2 hover:bg-[#127263] transition shadow-lg"
            >
              <Share2 className="w-4 h-4" /> WhatsApp
            </button>
            <button
              onClick={handleCopyLink}
              className="py-3 px-4 rounded-2xl bg-[#11152B] border border-[#DDAA42]/40 text-[#FFC857] font-bold font-cinzel text-xs flex items-center justify-center gap-2 hover:border-[#FFC857] transition"
            >
              <Copy className="w-4 h-4" /> Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
