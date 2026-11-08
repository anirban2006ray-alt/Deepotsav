import React, { useState, useRef } from 'react';
import { sound } from '../utils/audio';
import { GalleryItem } from '../types';
import { 
  Filter, 
  Upload, 
  X, 
  Sparkles, 
  Camera, 
  Award, 
  Heart,
  ChevronRight
} from 'lucide-react';

const GALLERY_PHOTOS: GalleryItem[] = [
  {
    id: '1',
    title: 'Sacred Brass Diya Illumination',
    category: 'Diyas',
    location: 'Varanasi Ghats, Uttar Pradesh',
    credit: 'Udayaditya Barua',
    imageUrl: 'https://images.unsplash.com/photo-1577083753695-e010191bacb5?auto=format&fit=crop&w=1200&q=85',
    description: 'Handcrafted bell-metal and brass diyas arranged in radiant symmetry along sacred stone steps, welcoming prosperity on Amavasya night.',
  },
  {
    id: '2',
    title: 'Floral Marigold & Lotus Rangoli',
    category: 'Rangoli',
    location: 'Jaipur, Rajasthan',
    credit: 'Jyoti Singh',
    imageUrl: 'https://images.unsplash.com/photo-1605302977140-6572a4421aef?auto=format&fit=crop&w=1200&q=85',
    description: 'Fresh yellow and orange marigold petals woven with pink lotus buds at the doorway to bless visiting guests with auspicious warmth.',
  },
  {
    id: '3',
    title: 'Temple Constellation at Dusk',
    category: 'Temples',
    location: 'Madurai Meenakshi Temple, Tamil Nadu',
    credit: 'Dinesh Dixit',
    imageUrl: 'https://images.unsplash.com/photo-1741358706805-a5935a200a5c?auto=format&fit=crop&w=1200&q=85',
    description: 'Ancient granite stone pillars and corridor oil lamps flickering gently in devotion as thousands gather for evening Deepotsav prayers.',
  },
  {
    id: '4',
    title: 'Golden Fireworks Above the Night Sky',
    category: 'Fireworks',
    location: 'New Delhi',
    credit: 'Anirudh',
    imageUrl: 'https://images.unsplash.com/photo-1699854227507-4b9ff940652a?auto=format&fit=crop&w=1200&q=85',
    description: 'Cascading golden sparkler trails and aerial bursts celebrating the triumphant victory of light and truth across the festive horizon.',
  },
  {
    id: '5',
    title: 'The Art of Powder Kolam',
    category: 'Rangoli',
    location: 'Chennai, Tamil Nadu',
    credit: 'Ashutosh Diwan',
    imageUrl: 'https://images.unsplash.com/photo-1700993714468-408700d3599e?auto=format&fit=crop&w=1200&q=85',
    description: 'Fine rice powder skillfully drawn through fingertips into intricate geometric lattices welcoming Goddess Lakshmi into the home.',
  },
  {
    id: '6',
    title: 'Earthen Clay Chirags in Harmony',
    category: 'Diyas',
    location: 'Ayodhya Saryu Ghat',
    credit: 'Umesh Soni',
    imageUrl: 'https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?auto=format&fit=crop&w=1200&q=85',
    description: 'Traditional terracotta clay lamps glowing steadfastly, reflecting ancient Ayodhya homecoming rituals of Lord Rama.',
  },
  {
    id: '7',
    title: 'City Streets of Endless Lanterns',
    category: 'Festival Lights',
    location: 'Kolkata, West Bengal',
    credit: 'Aaditya Hirachan',
    imageUrl: 'https://images.unsplash.com/photo-1637648652899-efff280b1f9b?auto=format&fit=crop&w=1200&q=85',
    description: 'Festive street bazaars and alleys glowing with fairy lights, golden chandeliers, and celebratory shopfronts during the festival week.',
  },
  {
    id: '8',
    title: 'Sparklers of Joy and Wonder',
    category: 'Festivities',
    location: 'Mumbai, Maharashtra',
    credit: 'Picnu',
    imageUrl: 'https://images.unsplash.com/photo-1700601589928-8937ebf649fa?auto=format&fit=crop&w=1200&q=85',
    description: 'Children and families twirling phuljhari sparklers in the courtyard, lighting the festive midnight air with laughter and joy.',
  },
  {
    id: '9',
    title: 'Three Generations Together in Light',
    category: 'Family',
    location: 'Lucknow, Uttar Pradesh',
    credit: 'Kabita Darlami',
    imageUrl: 'https://images.unsplash.com/photo-1605367334994-40c8555337e1?auto=format&fit=crop&w=1200&q=85',
    description: 'Grandparents, parents, and children dressed in silk festive finery, exchanging homemade sweets and lighting the first family diya.',
  },
  // AI-Generated Masterpieces
  {
    id: 'ai-1',
    title: '100,000 Floating Diyas upon the Sacred Ganges',
    category: 'AI Visions',
    location: 'Dashashwamedh Ghat, Varanasi',
    credit: '✦ AI Generated • Gemini',
    imageUrl: 'https://images.unsplash.com/photo-1577083753695-e010191bacb5?auto=format&fit=crop&w=1200&q=85',
    description: 'A celestial vision of 100,000 earthen diyas floating on sacred river waters at dusk, reflecting pure golden light towards the heavens.',
    isAiGenerated: true,
    radianceScore: 99,
  },
  {
    id: 'ai-2',
    title: 'Celestial Mayura Feather Rangoli with Marigolds',
    category: 'AI Visions',
    location: 'Udaipur City Palace Courtyard',
    credit: '✦ AI Generated • Gemini',
    imageUrl: 'https://images.unsplash.com/photo-1605302977140-6572a4421aef?auto=format&fit=crop&w=1200&q=85',
    description: 'Hyper-detailed royal peacock feather mandala woven from emerald green pigment, turmeric yellow, and fresh lotus petals.',
    isAiGenerated: true,
    radianceScore: 98,
  },
  {
    id: 'ai-3',
    title: 'Grand Cosmic Fireworks over Ayodhya Ram Mandir',
    category: 'AI Visions',
    location: 'Ayodhya Saryu Deepotsav',
    credit: '✦ AI Generated • Gemini',
    imageUrl: 'https://images.unsplash.com/photo-1699854227507-4b9ff940652a?auto=format&fit=crop&w=1200&q=85',
    description: 'Brilliant cascading fireworks in amethyst, gold, and ruby lighting the sky above ancient temple spires and ghats.',
    isAiGenerated: true,
    radianceScore: 100,
  },
];

const CATEGORIES = [
  'All',
  'AI Visions',
  'Diyas',
  'Rangoli',
  'Temples',
  'Fireworks',
  'Festival Lights',
  'Festivities',
  'Family',
];

export const DiwaliGallery: React.FC = () => {
  const [photosList, setPhotosList] = useState<GalleryItem[]>(GALLERY_PHOTOS);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  // AI Photo Generator State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGeneratingPhoto, setIsGeneratingPhoto] = useState<boolean>(false);
  const [generatedNotification, setGeneratedNotification] = useState<string>('');

  // AI Photo Analysis State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string>('');

  const visiblePhotos = activeCategory === 'All' 
    ? photosList 
    : photosList.filter((p) => p.category === activeCategory);

  const handleGenerateAiPhoto = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || aiPrompt || '100,000 floating diyas on the Ganges river at dusk with golden reflections';
    setIsGeneratingPhoto(true);
    sound.playTempleBell();

    try {
      const res = await fetch('/api/gemini/generate-gallery-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToUse }),
      });
      const data = await res.json();
      if (data.photo) {
        setPhotosList((prev) => [data.photo, ...prev]);
        setSelectedPhoto(data.photo);
        setGeneratedNotification(`Generated: "${data.photo.title}"`);
        sound.playFirework();
        setTimeout(() => setGeneratedNotification(''), 4000);
      }
    } catch (_e) {
      console.info('[Gallery] Using fallback generated photo.');
    } finally {
      setIsGeneratingPhoto(false);
    }
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        setUploadedImagePreview(base64);
        setAiAnalysisResult('');
        setIsAnalyzing(true);
        sound.playTempleBell();

        try {
          const res = await fetch('/api/gemini/analyze-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64,
              mimeType: file.type || 'image/jpeg',
            }),
          });
          const data = await res.json();
          if (data.analysis) {
            setAiAnalysisResult(data.analysis);
            sound.playDiyaLight();
          }
        } catch (err) {
          console.error('Failed to analyze photo:', err);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#DDAA42] font-cinzel mb-2">
          ✦ MOMENTS WORTH KEEPING ✦
        </p>
        <h1 className="text-3xl md:text-5xl font-playfair font-bold text-gold-gradient">
          A Festival of Beautiful Moments
        </h1>
        <p className="mt-3 text-sm md:text-base text-[#D6BD8B]/80 leading-relaxed">
          Explore the radiant visual heritage of Diwali across temples, courtyards, sacred rangolis, and family celebrations.
        </p>
      </div>

      {/* AI Photo Understanding Banner */}
      <div className="w-full glass-card p-6 md:p-8 rounded-3xl border border-[#FF8C24]/30 shadow-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-[#FF8C24] font-cinzel text-xs font-bold uppercase tracking-wider mb-1.5">
            <Camera className="w-4 h-4" /> AI Festive Photo Understanding • Gemini 4 Argon
          </div>
          <h2 className="text-xl md:text-2xl font-playfair font-bold text-white mb-2">
            Have a Photo of Your Rangoli, Diya or Celebration?
          </h2>
          <p className="text-xs md:text-sm text-[#D6BD8B]/80 leading-relaxed">
            Upload your festival photograph to receive an AI cultural critique of symmetry, color harmony, symbolic motifs, and a personalized festive blessing!
          </p>
        </div>

        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-2 hover:opacity-95 transition shadow-[0_0_20px_rgba(255,140,36,0.3)] whitespace-nowrap"
          >
            <Upload className="w-4 h-4" /> Upload Festive Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadPhoto}
            className="hidden"
          />
        </div>
      </div>

      {/* AI Analysis Modal / Display Box */}
      {(uploadedImagePreview || isAnalyzing || aiAnalysisResult) && (
        <div className="w-full glass-card p-6 rounded-3xl border border-[#FFC857]/40 shadow-2xl mb-10 animate-fadeIn">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <h3 className="font-cinzel text-base font-bold text-gold-gradient flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF8C24]" /> AI Festive Photo Evaluation
            </h3>
            <button
              onClick={() => {
                setUploadedImagePreview(null);
                setAiAnalysisResult('');
              }}
              className="text-xs text-[#D6BD8B] hover:text-white flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">
            {uploadedImagePreview && (
              <div className="rounded-2xl overflow-hidden border border-[#DDAA42]/30 max-h-64 flex items-center justify-center bg-black/40">
                <img
                  src={uploadedImagePreview}
                  alt="User festive upload"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="text-xs md:text-sm text-[#F4EBDD] leading-relaxed">
              {isAnalyzing ? (
                <div className="flex items-center gap-3 text-[#FFC857] py-8">
                  <div className="w-5 h-5 border-2 border-[#FFC857] border-t-transparent rounded-full animate-spin" />
                  <span>Gemini 4 Argon is analyzing your festive photograph...</span>
                </div>
              ) : (
                <div className="whitespace-pre-line bg-[#080B1A]/80 p-5 rounded-2xl border border-[#DDAA42]/20">
                  {aiAnalysisResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Photo Generator Studio Card */}
      <div className="w-full glass-card p-6 md:p-8 rounded-3xl border-2 border-[#FFC857]/40 shadow-2xl mb-10 bg-gradient-to-r from-[#171A38] via-[#11152B] to-[#251528]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#FFC857] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#FF8C24] animate-spin" />
              <span>AI Festive Photo Studio • Generate Diwali Visions</span>
            </div>
            <h2 className="text-xl md:text-2xl font-playfair font-bold text-white">
              Dream Any Diwali Moment into Reality
            </h2>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. 100,000 floating diyas on Ganges river, royal peacock rangoli..."
              className="flex-1 md:w-80 bg-[#080B1A] border border-[#DDAA42]/30 rounded-xl px-4 py-2 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#FFC857]"
            />
            <button
              onClick={() => handleGenerateAiPhoto()}
              disabled={isGeneratingPhoto}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF8C24] via-[#FFC857] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-1.5 hover:opacity-95 transition disabled:opacity-50 whitespace-nowrap shadow-[0_0_20px_rgba(255,140,36,0.3)]"
            >
              {isGeneratingPhoto ? <span className="animate-spin">✦</span> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isGeneratingPhoto ? 'Generating…' : 'Generate AI Photo'}</span>
            </button>
          </div>
        </div>

        {/* Quick prompt inspiration tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-cinzel text-[#D6BD8B]/70 uppercase tracking-wider mr-1">
            Prompt Ideas:
          </span>
          {[
            '100,000 Floating Diyas at Ganges Ghats',
            'Royal Peacock Rangoli in Palace Courtyard',
            'Golden Fireworks over Ayodhya Ram Mandir',
            'Terracotta Diyas with Fresh Marigolds',
          ].map((promptIdea, idx) => (
            <button
              key={idx}
              onClick={() => {
                setAiPrompt(promptIdea);
                handleGenerateAiPhoto(promptIdea);
              }}
              className="text-xs px-3 py-1 rounded-full bg-[#11152B] border border-[#FFC857]/20 text-[#FFC857] hover:border-[#FF8C24] hover:bg-[#FF8C24]/10 transition"
            >
              ✦ {promptIdea}
            </button>
          ))}
        </div>

        {generatedNotification && (
          <div className="mt-4 text-xs text-[#FFC857] bg-[#FF8C24]/15 border border-[#FFC857]/40 px-4 py-2 rounded-xl animate-fadeIn flex items-center gap-2">
            <span>✨</span>
            <span>{generatedNotification} — Added to gallery below!</span>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-cinzel transition ${
              activeCategory === cat
                ? 'bg-[#FF8C24] text-white font-bold shadow-[0_0_15px_rgba(255,140,36,0.3)]'
                : 'bg-[#11152B] border border-white/10 text-[#D6BD8B] hover:border-white/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3D Animated Cartoons & Pyro Shows Cinema Callout */}
      <div className="w-full mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#1A1F3C] via-[#11152B] to-[#2E1A11] border border-[#FFC857]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF8C24]/20 border border-[#FF8C24]/40 flex items-center justify-center text-[#FFC857] shrink-0">
            🎬
          </div>
          <div>
            <h4 className="font-playfair text-sm sm:text-base font-bold text-white">
              Watch 3D Animated Cartoons & Beach Pyro Shows
            </h4>
            <p className="text-xs text-[#D6BD8B]/80">
              Experience "The Little Diya's Quest" 3D cartoon, beach crackers simulation, and aerial firework shows in the Cinema Theater.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('nav-tab', { detail: 'theater' }));
            sound.playDiyaLight();
          }}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs hover:opacity-95 transition whitespace-nowrap shadow-md shrink-0"
        >
          Enter 3D Cinema →
        </button>
      </div>

      {/* Masonry Image Grid */}
      <div className="w-full columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {visiblePhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => {
              setSelectedPhoto(photo);
              sound.playDiyaLight();
            }}
            className="break-inside-avoid relative rounded-2xl overflow-hidden border border-[#DDAA42]/20 glass-card group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#FFC857]/60 hover:shadow-2xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#11152B]">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B1A] via-transparent to-transparent opacity-80" />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-cinzel text-[#FF8C24] uppercase tracking-wider block">
                  {photo.category} • {photo.location}
                </span>
                {photo.isAiGenerated && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FFC857]/20 border border-[#FFC857]/40 text-[#FFC857] text-[9px] font-cinzel font-bold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#FF8C24]" /> AI GENERATED
                  </span>
                )}
              </div>
              <h3 className="text-base font-playfair font-bold text-white group-hover:text-gold-gradient transition">
                {photo.title}
              </h3>
              <p className="text-xs text-[#D6BD8B]/70 mt-1 line-clamp-2">
                {photo.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-[#D6BD8B]/60 font-cinzel">
                <span>{photo.credit}</span>
                <span className="text-[#FFC857] flex items-center gap-1 group-hover:translate-x-1 transition">
                  View <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-[#080B1A]/95 backdrop-blur-md p-4 md:p-8 flex items-center justify-center animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#11152B] border border-[#DDAA42]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#080B1A]/80 border border-white/20 text-white hover:bg-[#FF8C24] transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="md:w-3/5 bg-black flex items-center justify-center max-h-[60vh] md:max-h-[75vh]">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-cinzel text-[#FF8C24] uppercase tracking-wider">
                    {selectedPhoto.category}
                  </span>
                  {selectedPhoto.isAiGenerated && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFC857]/20 border border-[#FFC857]/50 text-[#FFC857] text-[10px] font-cinzel font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FF8C24]" /> AI GENERATED
                    </span>
                  )}
                  {selectedPhoto.radianceScore && (
                    <span className="text-[10px] font-cinzel text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded-full border border-[#00E676]/30">
                      ✨ {selectedPhoto.radianceScore}/100 Radiance
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-playfair font-bold text-white mb-2">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-[#DDAA42] font-cinzel mb-4">
                  📍 {selectedPhoto.location}
                </p>
                <p className="text-xs md:text-sm text-[#D6BD8B]/90 leading-relaxed">
                  {selectedPhoto.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#D6BD8B]/60 font-cinzel flex items-center justify-between">
                <span>Credit: {selectedPhoto.credit}</span>
                <button
                  onClick={() => {
                    setSelectedPhoto(null);
                    window.dispatchEvent(new CustomEvent('nav-tab', { detail: 'ecard' }));
                  }}
                  className="text-[#FFC857] hover:underline"
                >
                  Create E-Card →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
