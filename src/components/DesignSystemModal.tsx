import React, { useState } from 'react';
import { X, Sparkles, Flame, Check, Sliders, Copy } from 'lucide-react';

interface DesignSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignSystemModal: React.FC<DesignSystemProps> = ({ isOpen, onClose }) => {
  const [copiedColor, setCopiedColor] = useState<string>('');
  const [demoToggle, setDemoToggle] = useState<boolean>(true);
  const [demoSlider, setDemoSlider] = useState<number>(65);

  if (!isOpen) return null;

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(''), 2000);
  };

  const colors = [
    { name: 'Midnight Navy', hex: '#080B1A', group: 'Background' },
    { name: 'Deep Indigo', hex: '#11152B', group: 'Background' },
    { name: 'Royal Purple', hex: '#21143B', group: 'Background' },
    { name: 'Saffron', hex: '#FF8C24', group: 'Primary Accent' },
    { name: 'Festival Orange', hex: '#FF5B22', group: 'Primary Accent' },
    { name: 'Golden Yellow', hex: '#FFC857', group: 'Primary Accent' },
    { name: 'Royal Gold', hex: '#DDAA42', group: 'Primary Accent' },
    { name: 'Rose Pink', hex: '#F47AA5', group: 'Secondary Accent' },
    { name: 'Lotus Pink', hex: '#FFB4C8', group: 'Secondary Accent' },
    { name: 'Peacock Green', hex: '#168B78', group: 'Secondary Accent' },
    { name: 'Pure White', hex: '#FFFFFF', group: 'Text' },
    { name: 'Warm White', hex: '#F4EBDD', group: 'Text' },
    { name: 'Muted Gold', hex: '#D6BD8B', group: 'Text' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#080B1A]/95 backdrop-blur-xl p-4 md:p-10 overflow-y-auto flex justify-center animate-fadeIn">
      <div className="relative max-w-5xl w-full bg-[#11152B] border border-[#DDAA42]/40 rounded-3xl p-6 md:p-10 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-cinzel text-[#FF8C24] block mb-1">
              ✦ DIWALI 3D SPECIFICATION • PAGE 02 / 12 ✦
            </span>
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gold-gradient">
              Design System & Component Library
            </h2>
            <p className="text-xs text-[#D6BD8B]/80 mt-1">
              Standardized tokens, 8-point spacing grid, accessible contrast, and reusable festive UI components.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#080B1A] border border-white/20 text-white hover:bg-[#FF8C24] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section A: Colour Styles */}
        <div className="mb-10">
          <h3 className="font-cinzel text-base font-bold text-[#FFC857] mb-4 flex items-center gap-2">
            <span>A. Colour Styles & Palette Tokens</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {colors.map((c) => (
              <div
                key={c.name}
                onClick={() => copyToClipboard(c.hex)}
                className="p-3 rounded-2xl bg-[#080B1A] border border-white/10 hover:border-[#FFC857] cursor-pointer transition group"
              >
                <div
                  className="w-full h-12 rounded-xl mb-2.5 border border-white/15 transition-transform group-hover:scale-95"
                  style={{ backgroundColor: c.hex }}
                />
                <p className="text-xs font-bold text-white truncate">{c.name}</p>
                <p className="text-[10px] text-[#D6BD8B]/60 font-mono flex items-center justify-between mt-1">
                  <span>{c.hex}</span>
                  {copiedColor === c.hex ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100" />}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section B: Typography Scale */}
        <div className="mb-10 border-t border-white/10 pt-8">
          <h3 className="font-cinzel text-base font-bold text-[#FFC857] mb-4">
            B. Typography Scale & Fonts
          </h3>
          <div className="space-y-4 bg-[#080B1A] p-6 rounded-2xl border border-white/10">
            <div>
              <span className="text-[10px] uppercase font-cinzel text-[#FF8C24]">Display Heading / Cinzel 700</span>
              <p className="text-3xl md:text-4xl font-cinzel font-bold text-gold-gradient">
                Celebrate the Magic of Diwali
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-cinzel text-[#FF8C24]">H1 Section / Playfair Display Bold</span>
              <p className="text-2xl font-playfair font-bold text-white">
                An Epic Journey of Truth & Dharma
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-cinzel text-[#FF8C24]">Body Large / Plus Jakarta Sans</span>
              <p className="text-sm text-[#D6BD8B] leading-relaxed">
                Discover the beauty of traditions, the power of light and the joy of togetherness through an immersive digital celebration.
              </p>
            </div>
          </div>
        </div>

        {/* Section C: Reusable Button Variants */}
        <div className="mb-10 border-t border-white/10 pt-8">
          <h3 className="font-cinzel text-base font-bold text-[#FFC857] mb-4">
            C. Reusable Component Buttons
          </h3>
          <div className="flex flex-wrap gap-3 items-center">
            <button className="py-2.5 px-5 rounded-full bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs shadow-[0_0_15px_rgba(255,140,36,0.3)]">
              Primary Button
            </button>
            <button className="py-2.5 px-5 rounded-full bg-[#11152B] border border-[#DDAA42]/50 text-[#FFC857] font-bold font-cinzel text-xs hover:border-[#FFC857]">
              Secondary Button
            </button>
            <button className="py-2.5 px-5 rounded-full border border-white/20 text-[#D6BD8B] font-cinzel text-xs hover:bg-white/5">
              Outline Button
            </button>
            <button className="p-2.5 rounded-full bg-[#080B1A] border border-[#FF8C24]/40 text-[#FF8C24]">
              <Flame className="w-4 h-4" />
            </button>
            <button disabled className="py-2.5 px-5 rounded-full bg-white/5 border border-white/10 text-white/30 font-cinzel text-xs cursor-not-allowed">
              Disabled State
            </button>
          </div>
        </div>

        {/* Section D: Interactive Controls */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="font-cinzel text-base font-bold text-[#FFC857] mb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FF8C24]" /> D. Form Controls & Sliders
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#080B1A] p-6 rounded-2xl border border-white/10">
            {/* Toggle Switch */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-cinzel text-white">Atmospheric Ambient Light</p>
                <p className="text-[10px] text-[#D6BD8B]/70">PBR tone mapping and bloom reflection</p>
              </div>
              <button
                onClick={() => setDemoToggle(!demoToggle)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${
                  demoToggle ? 'bg-[#FF8C24]' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                    demoToggle ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Slider */}
            <div>
              <div className="flex justify-between text-xs font-cinzel text-white mb-2">
                <span>Radiance Intensity</span>
                <span className="text-[#FFC857]">{demoSlider}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={demoSlider}
                onChange={(e) => setDemoSlider(Number(e.target.value))}
                className="w-full accent-[#FF8C24] h-2 bg-[#21143B] rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
