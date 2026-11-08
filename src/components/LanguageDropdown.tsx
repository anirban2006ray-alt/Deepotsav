import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { ChevronDown, Check, Globe } from 'lucide-react';

export const FlagEN: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 60 36" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <clipPath id="uk-flag-clip">
      <rect width="60" height="36" rx="3" />
    </clipPath>
    <g clipPath="url(#uk-flag-clip)">
      <rect width="60" height="36" fill="#012169" />
      <path d="M0,0 L60,36 M60,0 L0,36" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0,0 L60,36 M60,0 L0,36" stroke="#C8102E" strokeWidth="2.5" />
      <path d="M30,0 v36 M0,18 h60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 v36 M0,18 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

export const FlagHI: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 60 36" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <clipPath id="hi-flag-clip">
      <rect width="60" height="36" rx="3" />
    </clipPath>
    <g clipPath="url(#hi-flag-clip)">
      {/* Top Saffron Band */}
      <rect width="60" height="12" fill="#FF9933" />
      {/* Middle White Band */}
      <rect y="12" width="60" height="12" fill="#FFFFFF" />
      {/* Bottom India Green Band */}
      <rect y="24" width="60" height="12" fill="#138808" />
      {/* Ashoka Chakra */}
      <circle cx="30" cy="18" r="4.6" fill="none" stroke="#000080" strokeWidth="0.8" />
      <circle cx="30" cy="18" r="1.1" fill="#000080" />
      {[0, 30, 60, 90, 120, 150].map((deg) => (
        <line
          key={deg}
          x1={30 - 4.2 * Math.cos((deg * Math.PI) / 180)}
          y1={18 - 4.2 * Math.sin((deg * Math.PI) / 180)}
          x2={30 + 4.2 * Math.cos((deg * Math.PI) / 180)}
          y2={18 + 4.2 * Math.sin((deg * Math.PI) / 180)}
          stroke="#000080"
          strokeWidth="0.45"
        />
      ))}
    </g>
  </svg>
);

export const FlagBN: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 60 36" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <clipPath id="bn-flag-clip">
      <rect width="60" height="36" rx="3" />
    </clipPath>
    <g clipPath="url(#bn-flag-clip)">
      {/* Saffron, White, Green Tricolor */}
      <rect width="60" height="12" fill="#FF9933" />
      <rect y="12" width="60" height="12" fill="#FFFFFF" />
      <rect y="24" width="60" height="12" fill="#138808" />
      {/* Ashoka Chakra */}
      <circle cx="30" cy="18" r="4.6" fill="none" stroke="#000080" strokeWidth="0.8" />
      <circle cx="30" cy="18" r="1.1" fill="#000080" />
      {[0, 30, 60, 90, 120, 150].map((deg) => (
        <line
          key={deg}
          x1={30 - 4.2 * Math.cos((deg * Math.PI) / 180)}
          y1={18 - 4.2 * Math.sin((deg * Math.PI) / 180)}
          x2={30 + 4.2 * Math.cos((deg * Math.PI) / 180)}
          y2={18 + 4.2 * Math.sin((deg * Math.PI) / 180)}
          stroke="#000080"
          strokeWidth="0.45"
        />
      ))}
      {/* Subtle regional crimson badge with Bengali script notation */}
      <path d="M46,0 L60,0 L60,14 Z" fill="#991B1B" />
      <text
        x="55"
        y="8.5"
        fill="#FFFFFF"
        fontSize="5.5"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
      >
        বা
      </text>
    </g>
  </svg>
);

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: React.ReactNode;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: <FlagEN />,
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: <FlagHI />,
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: <FlagBN />,
  },
];

interface LanguageDropdownProps {
  lang: Language;
  onSelectLang: (lang: Language) => void;
  className?: string;
  isMobileDrawer?: boolean;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  lang,
  onSelectLang,
  className = '',
  isMobileDrawer = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === lang) || LANGUAGE_OPTIONS[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation & Escape key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    onSelectLang(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select Language, currently ${activeOption.nativeName}`}
        className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-full border transition-all duration-200 ${
          isOpen
            ? 'bg-[#151A33] border-[#FFC857] text-[#FFC857] shadow-[0_0_15px_rgba(255,200,87,0.3)] ring-1 ring-[#FFC857]/40'
            : 'bg-[#11152B]/90 border-[#DDAA42]/30 text-[#F4EBDD] hover:border-[#FFC857]/70 hover:bg-[#151A33] shadow-sm'
        }`}
      >
        {/* Active Flag Icon */}
        <span
          className="w-5 h-3.5 rounded-sm overflow-hidden flex-shrink-0 shadow-sm border border-white/20 inline-flex items-center justify-center transform group-hover:scale-105 transition-transform"
          aria-hidden="true"
        >
          {activeOption.flag}
        </span>

        {/* Active Language Label */}
        <span className="hidden sm:inline text-xs font-cinzel font-semibold tracking-wide text-white group-hover:text-[#FFC857] transition-colors">
          {activeOption.nativeName}
        </span>

        {/* Animated Chevron Indicator */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#D6BD8B] group-hover:text-[#FFC857] transition-transform duration-200 ease-out ${
            isOpen ? 'rotate-180 text-[#FFC857]' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu with Subtle Fade-In and Slide-Down Animation */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Available Languages"
          className={`absolute mt-2 rounded-2xl bg-[#0E1328]/95 border border-[#DDAA42]/40 shadow-[0_16px_40px_rgba(0,0,0,0.75),0_0_24px_rgba(255,140,36,0.18)] backdrop-blur-xl p-1.5 z-50 animate-dropdown-slide-down ${
            isMobileDrawer ? 'left-0 w-60' : 'right-0 w-52'
          }`}
        >
          {/* Header */}
          <div className="px-3 py-1.5 text-[10px] uppercase font-cinzel font-bold tracking-wider text-[#D6BD8B]/70 border-b border-white/5 mb-1 flex items-center justify-between">
            <span>Select Language</span>
            <Globe className="w-3 h-3 text-[#FF8C24]" aria-hidden="true" />
          </div>

          {/* Language Options */}
          <div className="space-y-1">
            {LANGUAGE_OPTIONS.map((item) => {
              const isSelected = lang === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-150 group ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#FF8C24]/25 to-[#FFC857]/15 text-[#FFC857] border border-[#FF8C24]/30 font-bold shadow-sm'
                      : 'text-[#D6BD8B]/80 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Flag Icon */}
                    <span className="w-5 h-3.5 rounded-sm overflow-hidden flex-shrink-0 shadow-sm border border-white/20 inline-flex items-center justify-center group-hover:scale-105 transition-transform">
                      {item.flag}
                    </span>

                    {/* Language Names */}
                    <div>
                      <div
                        className={`text-xs font-cinzel tracking-wide ${
                          isSelected ? 'text-[#FFC857]' : 'text-white'
                        }`}
                      >
                        {item.nativeName}
                      </div>
                      <div className="text-[10px] text-[#D6BD8B]/60 tracking-wider">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isSelected && (
                    <Check
                      className="w-3.5 h-3.5 text-[#FFC857] flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
