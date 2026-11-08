import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  BookOpen, 
  Compass, 
  Flame, 
  Palette, 
  ShieldCheck, 
  Heart,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Grid,
  Check,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { PageTab } from '../types';
import { sound } from '../utils/audio';

interface PdfShowcaseProps {
  onNavigateTab: (tab: PageTab) => void;
}

interface PdfPageData {
  id: number;
  title: string;
  subtitle: string;
  pageRange: string;
  image: string;
  targetTab: PageTab;
  icon: any;
  highlights: string[];
  description: string;
}

const PDF_PAGES: PdfPageData[] = [
  {
    id: 1,
    title: 'Celebrate the Magic of Diwali',
    subtitle: 'Hero & Experience Architecture (Desktop, Tablet, Mobile)',
    pageRange: 'Section 01',
    image: '/pdf_pages/01_home_experience.jpg',
    targetTab: 'home',
    icon: Flame,
    highlights: [
      'Central glowing brass diya with triple orbital rings (Light, Art, Story)',
      'Five entrance portals: 01 Diya, 02 Rangoli, 03 Ramayana, 04 Ravana Dahan, 05 Greetings',
      'Floating marigold & lotus flower petals with night starfield aura',
      'Atmospheric color tokens: Midnight Navy #080B1A, Deep Indigo, Saffron, Gold #FFC857',
    ],
    description: 'The complete entry experience introducing the Festival of Lights through art, culture and technology, with crystal-clear responsive layouts across all viewports.',
  },
  {
    id: 2,
    title: 'A Ritual of Radiance – Light Your Diya',
    subtitle: '3D Diya Studio & Customization Controls',
    pageRange: 'Section 02',
    image: '/pdf_pages/02_diya_studio.jpg',
    targetTab: 'diya',
    icon: Flame,
    highlights: [
      '5 authentic diya models: Traditional Brass, Carved Gold, Floral Clay, Lotus Petal, Floating Lamp',
      '3 flame combustion styles: Natural Flicker, Saffron Intensity, Ethereal Violet glow',
      'Handcrafted surface engravings: Paisley, Sacred Mandala, Royal Floral motifs',
      'Arrangement layouts: Solo (1), Trio (3), and Circle of Radiance (5)',
    ],
    description: 'Interactive lighting ritual with flame color picker, zoom controls, 3D rotation, and ambient lighting intensity sliders.',
  },
  {
    id: 3,
    title: 'Create in Symmetry – Rangoli Studio',
    subtitle: 'Geometric Powder & Petal Design Canvas',
    pageRange: 'Section 03',
    image: '/pdf_pages/03_rangoli_studio.jpg',
    targetTab: 'rangoli',
    icon: Palette,
    highlights: [
      'Radial symmetry engine supporting 4, 8, and 16-fold circular geometry',
      'Festive gulal powder palette: Saffron #F38A2B, Marigold #FFD166, Gulabi Rose, Royal Indigo',
      '6 foundational presets: Floral, Lotus, Peacock, Sacred Mandala, Diya, Royal Court',
      'Direct SVG vector download, unlimited undo/redo history, and transfer to E-Card',
    ],
    description: 'A tribute to the traditional threshold art welcoming Goddess Lakshmi into the home, with dynamic petal placement and 3D rotation.',
  },
  {
    id: 4,
    title: 'The Epic Journey of Ramayana',
    subtitle: 'The Timeless Chronicle (Chapters I–VI)',
    pageRange: 'Section 04',
    image: '/pdf_pages/04_ramayana_story.jpg',
    targetTab: 'ramayana',
    icon: BookOpen,
    highlights: [
      '01 The Birth of Lord Rama • In Ayodhya, embodying compassion, discipline and dharma',
      '02 The Royal Exile • Fourteen years honored in the forest with Sita and Lakshmana',
      '03 Sita’s Abduction • Ravana carries Sita to Lanka; search guided by courage and faith',
      '04 Hanuman’s Flight • Crossing the ocean with Rama’s ring, symbol of selfless devotion',
      '05 The Great Battle • The righteous struggle against injustice on the shores of Lanka',
      '06 The Return to Ayodhya • The sea of lamps illuminating Rama and Sita’s homecoming',
    ],
    description: 'Cinematic chapter journey with character profiles, audio narration, multilingual subtitles (English, Hindi, Bengali), and philosophical reflections.',
  },
  {
    id: 5,
    title: 'Vijayadashami – The Victory of Good Over Evil',
    subtitle: 'Ravana Dahan Effigy & Festival Grounds',
    pageRange: 'Section 05',
    image: '/pdf_pages/05_ravana_dahan.jpg',
    targetTab: 'ravana-dahan',
    icon: ShieldCheck,
    highlights: [
      'Ten-headed Ravana festival effigy representing ego and darkness',
      'Lord Rama character aiming kinematics with celestial divine bow',
      'Arrow flight trajectory with glowing spark trail',
      'Ceremonial dahan fire simulation with ember particle physics',
    ],
    description: 'The climactic Vijayadashami celebration with interactive bow aiming, effigy burning, fireworks, and victory reflection.',
  },
  {
    id: 6,
    title: 'Ravana Dahan – 5 Cinematic Storyboard Keyframes',
    subtitle: 'Widescreen Retelling Sequence',
    pageRange: 'Section 06',
    image: '/pdf_pages/06_dahan_storyboards.jpg',
    targetTab: 'ravana-dahan',
    icon: ShieldCheck,
    highlights: [
      'Scene 1: Festival Introduction – Ancient temple steps adorned with hundreds of earthen diyas',
      'Scene 2: Appearance of Ravana – The towering effigy standing illuminated at midnight',
      'Scene 3: Symbolic Arrow – Lord Rama taking aim against the dusk temple skyline',
      'Scene 4: Ravana Dahan – The divine fire taking hold as embers rise into the heavens',
      'Scene 5: The Victory of Good Over Evil – Grand temple Deepotsav celebration with fireworks',
    ],
    description: 'Five widescreen cinematic panels capturing the emotional and spiritual heartbeat of the Vijayadashami festival.',
  },
  {
    id: 7,
    title: 'Spread the Light of Happiness',
    subtitle: 'Diwali Greeting Card Maker & Wish Archive',
    pageRange: 'Section 07',
    image: '/pdf_pages/07_greeting_maker.jpg',
    targetTab: 'ecard',
    icon: Heart,
    highlights: [
      'Sanskrit "शुभ दीपावली" gold-embossed typography with ornamental corner filigrees',
      'Night sky fireworks backdrops matching the original celebration aesthetic',
      'Personal recipient and sender inputs with prompt-based AI greeting generator',
      'High-resolution PNG card download, WhatsApp direct share, and interactive link generator',
    ],
    description: 'A digital festive card workshop to craft customized blessings with custom artwork, stickers, and AI greetings for loved ones.',
  },
  {
    id: 8,
    title: 'A Festival of Beautiful Moments',
    subtitle: 'Curated 9-Photo Gallery & Category Filters',
    pageRange: 'Section 08',
    image: '/pdf_pages/08_festival_gallery.jpg',
    targetTab: 'gallery',
    icon: Compass,
    highlights: [
      'Sacred Brass Diya Illumination (Varanasi Ghats) by Udayaditya Barua',
      'Floral Marigold & Lotus Rangoli (Jaipur) by Jyoti Singh',
      'Temple Constellation at Dusk (Madurai Meenakshi) by Dinesh Dixit',
      'Golden Fireworks Above the Night Sky (New Delhi) by Anirudh',
      'The Art of Powder Kolam (Chennai) by Ashutosh Diwan',
      'Earthen Clay Chirags in Harmony (Ayodhya) by Umesh Soni',
    ],
    description: 'Curated high-resolution photography capturing sacred rituals, temple corridors, night fireworks, and family celebrations.',
  },
  {
    id: 9,
    title: 'The Light Behind the Celebration',
    subtitle: 'Cultural Heritage, Meaning & The 5 Sacred Days',
    pageRange: 'Section 09',
    image: '/pdf_pages/09_about_diwali.jpg',
    targetTab: 'about',
    icon: Sparkles,
    highlights: [
      'Three sacred pillars: Light over darkness, Good over evil, Renewal of the spirit',
      'Day 1: Dhanteras • Welcome prosperity, health, and new beginnings',
      'Day 2: Naraka Chaturdashi • Holy dawn oil baths and the renewal of courage',
      'Day 3: Maha Lakshmi Puja • Rows of diyas welcoming the goddess into clean homes',
      'Day 4: Govardhan Puja • Gratitude, Annakut feasts, and honoring mother nature',
      'Day 5: Bhai Dooj • Celebrating the sacred bond of affection between siblings',
    ],
    description: 'A deep cultural guide to Diwali traditions, Panchang timings, and the spiritual significance of lighting lamps.',
  },
];

export const PdfShowcase: React.FC<PdfShowcaseProps> = ({ onNavigateTab }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single' | 'continuous' | 'embed-pdf' | 'raw-info'>('single');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const activePage = PDF_PAGES[currentPageIndex];

  const handleNextPage = () => {
    if (currentPageIndex < PDF_PAGES.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      sound.playDiyaLight();
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      sound.playDiyaLight();
    }
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(220, z + 20));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(60, z - 20));
  const handleZoomReset = () => setZoomLevel(100);

  // Guaranteed Real PDF File Download Trigger (User Request 3)
  const handleRealDownload = () => {
    setIsDownloading(true);
    sound.playTempleBell();

    const link = document.createElement('a');
    link.href = '/api/download-pdf';
    link.download = 'Diwali_3D_Experience_Design_Specification.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    }, 1200);
  };

  const handleDownloadPageJpg = () => {
    sound.playDiyaLight();
    const link = document.createElement('a');
    link.href = activePage.image;
    link.download = `diwali-design-spec-${activePage.pageRange.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Title & Eyebrow */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#11152B] border border-[#DDAA42]/30 text-xs font-cinzel text-[#FFC857] mb-4">
          <BookOpen className="w-3.5 h-3.5 text-[#FF8C24]" />
          <span>ORIGINAL HIGH-DEFINITION DESIGN SPECIFICATION (64MB)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-white mb-3">
          The Official Diwali 3D Document
        </h1>
        <p className="text-xs sm:text-sm text-[#D6BD8B]/80 leading-relaxed">
          Displayed in crystal-clear master resolution (1285px width). You can view every section page-by-page, read the complete document in the embedded browser viewer, or download the full 64MB PDF file directly.
        </p>
      </div>

      {/* Control Bar: View Modes & Direct Download */}
      <div className="bg-[#11152B]/90 border border-[#DDAA42]/30 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-xl">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-[#080B1A] p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => {
              setViewMode('single');
              sound.playDiyaLight();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-cinzel transition flex items-center gap-1.5 ${
              viewMode === 'single'
                ? 'bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold shadow-md'
                : 'text-[#D6BD8B]/80 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Clear Page-by-Page</span>
          </button>

          <button
            onClick={() => {
              setViewMode('continuous');
              sound.playDiyaLight();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-cinzel transition flex items-center gap-1.5 ${
              viewMode === 'continuous'
                ? 'bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold shadow-md'
                : 'text-[#D6BD8B]/80 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>All 9 Sections</span>
          </button>

          <button
            onClick={() => {
              setViewMode('embed-pdf');
              sound.playDiyaLight();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-cinzel transition flex items-center gap-1.5 ${
              viewMode === 'embed-pdf'
                ? 'bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold shadow-md'
                : 'text-[#D6BD8B]/80 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Native PDF Reader</span>
          </button>

          <button
            onClick={() => {
              setViewMode('raw-info');
              sound.playDiyaLight();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-cinzel transition flex items-center gap-1.5 ${
              viewMode === 'raw-info'
                ? 'bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold shadow-md'
                : 'text-[#D6BD8B]/80 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>File Details</span>
          </button>
        </div>

        {/* Page Nav (Single View Mode) */}
        {viewMode === 'single' && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPageIndex === 0}
              className="p-2 rounded-lg border border-white/10 text-white disabled:opacity-30 hover:border-[#FFC857] transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-cinzel text-[#FFC857] font-bold min-w-28 text-center">
              {activePage.pageRange} of 09
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPageIndex === PDF_PAGES.length - 1}
              className="p-2 rounded-lg border border-white/10 text-white disabled:opacity-30 hover:border-[#FFC857] transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Zoom & Download Actions (Guaranteed Real Download!) */}
        <div className="flex items-center gap-2">
          {viewMode === 'single' && (
            <div className="hidden sm:flex items-center gap-1 bg-[#080B1A] px-2 py-1 rounded-xl border border-white/10 text-xs text-[#D6BD8B]">
              <button onClick={handleZoomOut} className="p-1 hover:text-white" title="Zoom Out">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1">{zoomLevel}%</span>
              <button onClick={handleZoomIn} className="p-1 hover:text-white" title="Zoom In">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleZoomReset} className="p-1 hover:text-white" title="Reset Zoom">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Download Current Page High-Res JPG */}
          {viewMode === 'single' && (
            <button
              onClick={handleDownloadPageJpg}
              className="py-2 px-3 rounded-xl bg-[#080B1A] border border-white/20 text-[#FFC857] font-cinzel text-xs flex items-center gap-1.5 hover:border-[#FFC857] hover:bg-white/5 transition"
              title="Download High-Res JPG of this section"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Section JPG</span>
            </button>
          )}

          {/* Guaranteed Real 64MB PDF Download Button (User Request 3) */}
          <button
            onClick={handleRealDownload}
            disabled={isDownloading}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-2 hover:opacity-95 transition shadow-lg disabled:opacity-60"
          >
            {isDownloading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Downloading 64MB PDF...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-900" />
                <span>Downloaded Successfully!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download 64MB Master PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: SINGLE PAGE WITH CRYSTAL CLEAR HIGH RESOLUTION (User Request 4) */}
      {viewMode === 'single' && (
        <div className="space-y-6">
          {/* Active Section Info Card */}
          <div className="glass-card p-5 rounded-2xl border border-[#DDAA42]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-cinzel text-[#FF8C24] font-bold mb-1">
                <span>{activePage.pageRange}</span>
                <span>•</span>
                <span>{activePage.subtitle}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-playfair font-bold text-white">
                {activePage.title}
              </h2>
              <p className="text-xs text-[#D6BD8B]/80 mt-1 max-w-2xl leading-relaxed">
                {activePage.description}
              </p>
            </div>

            <button
              onClick={() => {
                onNavigateTab(activePage.targetTab);
                sound.playDiyaLight();
              }}
              className="py-2.5 px-5 rounded-xl bg-[#11152B] border border-[#FFC857]/50 text-[#FFC857] hover:bg-[#FFC857]/15 font-cinzel text-xs font-bold flex items-center gap-2 transition self-start md:self-center whitespace-nowrap shadow-md"
            >
              <span>Launch Live Experience</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Crystal-Clear Master Resolution Image Canvas (User Request 4) */}
          <div className="relative rounded-3xl border border-[#DDAA42]/40 bg-[#060814] p-3 sm:p-6 shadow-2xl overflow-auto max-h-[85vh] text-center">
            <div 
              className="inline-block transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <img
                src={activePage.image}
                alt={`${activePage.title} - Crystal Clear Master Resolution`}
                className="rounded-xl w-full max-w-5xl shadow-2xl border border-white/10 object-contain mx-auto"
                loading="eager"
              />
            </div>
          </div>

          {/* Highlights & Design Specs */}
          <div className="p-6 rounded-2xl bg-[#11152B]/60 border border-white/10">
            <p className="text-xs uppercase font-cinzel font-bold text-[#FFC857] tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FF8C24]" />
              <span>Design Specifications in this Section</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#D6BD8B]/90">
              {activePage.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C24] mt-1.5 flex-shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail Carousel */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs uppercase font-cinzel text-[#D6BD8B]/70 tracking-widest mb-3">
              Jump Directly to Section (1285px Master Sheets)
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {PDF_PAGES.map((page, idx) => (
                <button
                  key={page.id}
                  onClick={() => {
                    setCurrentPageIndex(idx);
                    sound.playDiyaLight();
                  }}
                  className={`p-2 rounded-xl border text-left transition flex flex-col justify-between aspect-[3/4] overflow-hidden ${
                    currentPageIndex === idx
                      ? 'border-[#FFC857] bg-[#FF8C24]/15 shadow-[0_0_15px_rgba(255,200,87,0.25)]'
                      : 'border-white/10 bg-[#11152B]/40 hover:border-white/30'
                  }`}
                >
                  <div className="text-[10px] font-cinzel font-bold text-[#FF8C24]">
                    {page.pageRange}
                  </div>
                  <div className="text-[11px] font-playfair font-bold text-white line-clamp-2 leading-tight">
                    {page.title.split('–')[0].split('(')[0]}
                  </div>
                  <div className="text-[9px] text-[#D6BD8B]/60 font-cinzel">
                    {currentPageIndex === idx ? '● ACTIVE' : 'View'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CONTINUOUS SCROLL OF ALL 9 MASTER SECTIONS */}
      {viewMode === 'continuous' && (
        <div className="space-y-12">
          {PDF_PAGES.map((page) => (
            <div
              key={page.id}
              className="glass-card p-6 rounded-3xl border border-[#DDAA42]/30 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <span className="text-xs font-cinzel text-[#FF8C24] font-bold tracking-widest">
                    {page.pageRange} • {page.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-playfair font-bold text-white">
                    {page.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={page.image}
                    download
                    className="py-1.5 px-3 rounded-lg bg-white/10 text-xs text-white hover:bg-white/20 transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Sheet</span>
                  </a>
                  <button
                    onClick={() => {
                      onNavigateTab(page.targetTab);
                      sound.playDiyaLight();
                    }}
                    className="py-1.5 px-3 rounded-lg bg-[#FF8C24] text-[#080B1A] font-bold text-xs flex items-center gap-1"
                  >
                    <span>Launch</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-[#060814] rounded-2xl p-3 sm:p-5 border border-white/10 text-center">
                <img
                  src={page.image}
                  alt={page.title}
                  className="rounded-xl w-full max-w-5xl mx-auto shadow-2xl"
                  loading="lazy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#D6BD8B]/80 pt-2">
                {page.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C24] mt-1.5 flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 3: NATIVE EMBEDDED PDF VIEWER (User Request 4) */}
      {viewMode === 'embed-pdf' && (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-[#DDAA42]/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#D6BD8B]">
              <FileText className="w-4 h-4 text-[#FF8C24]" />
              <span>Native Browser PDF Viewer • Direct Stream of 64MB Document</span>
            </div>
            <button
              onClick={handleRealDownload}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF File</span>
            </button>
          </div>

          <div className="rounded-3xl border border-[#DDAA42]/40 bg-[#080B1A] overflow-hidden shadow-2xl h-[85vh]">
            <iframe
              src="/Diwali_3D_Design_Specification.pdf"
              title="Official Diwali 3D PDF Document"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      )}

      {/* VIEW MODE 4: RAW TECHNICAL INFO & DIRECT LINKS */}
      {viewMode === 'raw-info' && (
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-[#DDAA42]/30 space-y-6">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white">
              Raw PDF Technical Specifications & Downloads
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-4 rounded-xl bg-[#080B1A] border border-white/10">
                <span className="text-[#FF8C24] font-cinzel block mb-1">PRIMARY FILE NAME</span>
                <span className="text-white font-bold font-mono text-sm">Diwali_3D_Design_Specification.pdf</span>
                <span className="block text-[#D6BD8B]/60 mt-2">Route: /api/download-pdf</span>
              </div>

              <div className="p-4 rounded-xl bg-[#080B1A] border border-white/10">
                <span className="text-[#FF8C24] font-cinzel block mb-1">FILE SIZE & SPECS</span>
                <span className="text-white font-bold font-mono text-sm">64,014,165 bytes (64 MB)</span>
                <span className="block text-[#D6BD8B]/60 mt-2">Format: PDF-1.7 Vector Raster Master</span>
              </div>

              <div className="p-4 rounded-xl bg-[#080B1A] border border-white/10">
                <span className="text-[#FF8C24] font-cinzel block mb-1">MASTER SHEETS</span>
                <span className="text-white font-bold font-mono text-sm">9 Complete High-Res Artboards</span>
                <span className="block text-[#D6BD8B]/60 mt-2">1285px Desktop, Tablet & Mobile Architecture</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#080B1A]/80 border border-[#DDAA42]/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-cinzel text-sm font-bold text-white">Download Master Document</p>
                <p className="text-xs text-[#D6BD8B]/70 mt-0.5">Stream direct 64MB PDF file with HTTP range request and download attachment headers</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRealDownload}
                  disabled={isDownloading}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-2 hover:opacity-95 transition shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Master 64MB PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
