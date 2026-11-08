import React from 'react';
import { PageTab } from '../types';
import { Flame, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: PageTab) => void;
  onOpenDesignSystem: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenDesignSystem }) => {
  return (
    <footer className="border-t border-[#DDAA42]/20 bg-[#080B1A] text-[#D6BD8B] py-12 px-4 md:px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Col 1: Brand Info */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5B22] to-[#FFC857] p-0.5 shadow-[0_0_15px_rgba(255,140,36,0.3)]">
              <div className="w-full h-full rounded-full bg-[#080B1A] flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-[#FFC857]" />
              </div>
            </div>
            <span className="font-cinzel text-lg font-bold text-gold-gradient">
              DIWALI <span className="text-[#FF8C24]">3D</span>
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#D6BD8B]/80 max-w-md leading-relaxed mb-4">
            An immersive digital celebration bridging Indian heritage, timeless mythology, 3D WebGL technology, and creative personal expression.
          </p>
          <p className="text-[11px] text-[#D6BD8B]/60 font-cinzel">
            Tagline: "Experience the Festival of Lights Through Art, Culture and Technology."
          </p>
        </div>

        {/* Col 2: Experiences */}
        <div>
          <p className="text-xs font-cinzel font-bold uppercase tracking-widest text-white mb-3">
            Interactive Experiences
          </p>
          <ul className="space-y-2 text-xs font-cinzel">
            <li>
              <button onClick={() => onSelectTab('diya')} className="hover:text-[#FFC857] transition">
                3D Diya Experience
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('rangoli')} className="hover:text-[#FFC857] transition">
                3D Rangoli Studio
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('ramayana')} className="hover:text-[#FFC857] transition">
                Ramayana Chronicle (7 Kandas)
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('ravana-dahan')} className="hover:text-[#FFC857] transition">
                The Grand Ravana Dahan 3D
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('diwali-return')} className="hover:text-[#FFC857] transition">
                The Return to Ayodhya Deepotsav
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('theater')} className="hover:text-[#FFC857] transition text-[#FF8C24]">
                🎬 3D Cinema & Cartoons
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Community & Craft */}
        <div>
          <p className="text-xs font-cinzel font-bold uppercase tracking-widest text-white mb-3">
            Culture & Greetings
          </p>
          <ul className="space-y-2 text-xs font-cinzel">
            <li>
              <button onClick={() => onSelectTab('ecard')} className="hover:text-[#FFC857] transition">
                Personalized E-Cards
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('gallery')} className="hover:text-[#FFC857] transition">
                Festival Moments Gallery
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('about')} className="hover:text-[#FFC857] transition">
                The 5 Days & Traditions
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('pdf-showcase')} className="hover:text-[#FFC857] transition text-[#FFC857] font-bold">
                📖 Original Design PDF
              </button>
            </li>
            <li>
              <button onClick={onOpenDesignSystem} className="hover:text-[#FFC857] transition">
                Design System & Tokens
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#D6BD8B]/60 gap-4">
        <p>© DIWALI 3D • Art, heritage & digital craft. Created with reverence for the diverse traditions of the festival.</p>
        <p className="flex items-center gap-1.5 font-cinzel">
          <span>Light, Culture & Code</span>
          <Sparkles className="w-3.5 h-3.5 text-[#FF8C24]" />
        </p>
      </div>
    </footer>
  );
};
