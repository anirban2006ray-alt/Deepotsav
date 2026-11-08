import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { RamayanaArtwork } from '../types';
import { 
  X, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  ExternalLink,
  Layers
} from 'lucide-react';

const RAMAYANA_ARTWORKS: RamayanaArtwork[] = [
  {
    id: 'art-1',
    title: 'The Court of King Dasharatha & Rama’s Childhood',
    kanda: 'Bala Kanda',
    description: 'In the golden halls of Ayodhya, young Rama and his brothers receive sacred Vedic instruction from Sage Vasishtha, surrounded by marble colonnades and marigold garlands.',
    characters: ['Lord Rama', 'King Dasharatha', 'Queen Kaushalya', 'Sage Vasishtha'],
    imageUrl: 'https://images.unsplash.com/photo-1577083753695-e010191bacb5?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'art-2',
    title: 'The Breaking of Lord Shiva’s Celestial Bow Pinaka',
    kanda: 'Bala Kanda',
    description: 'In the royal assembly of Mithila, Rama lifts the colossal bow of Shiva with effortless ease, stringing it until it snaps with celestial thunder, winning the hand of Goddess Sita.',
    characters: ['Lord Rama', 'Goddess Sita', 'King Janaka', 'Sage Vishvamitra'],
    imageUrl: 'https://images.unsplash.com/photo-1605302977140-6572a4421aef?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'art-3',
    title: 'The Departure into Fourteen Years of Exile',
    kanda: 'Ayodhya Kanda',
    description: 'Rama, Sita, and Lakshmana trade royal silk for ascetic bark robes, walking peacefully past weeping citizens as they cross the sacred river into the Dandaka forest.',
    characters: ['Lord Rama', 'Goddess Sita', 'Lakshmana', 'Citizens of Ayodhya'],
    imageUrl: 'https://images.unsplash.com/photo-1700993714468-408700d3599e?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'art-4',
    title: 'Bharata’s Devotion at Nandigram',
    kanda: 'Ayodhya Kanda',
    description: 'Prince Bharata places Lord Rama’s sacred wooden sandals upon the royal throne of Ayodhya, pledging to govern as a selfless servant until his brother returns.',
    characters: ['Prince Bharata', 'Lord Rama', 'Lakshmana'],
    imageUrl: 'https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'art-5',
    title: 'The Enchanting Illusion of the Golden Deer',
    kanda: 'Aranya Kanda',
    description: 'Amid the lush trees of Panchavati by the Godavari, Maricha takes the form of a radiant gem-studded golden deer, setting in motion the trials of the forest.',
    characters: ['Goddess Sita', 'Lord Rama', 'Lakshmana', 'Maricha'],
    imageUrl: 'https://images.unsplash.com/photo-1741358706805-a5935a200a5c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'art-6',
    title: 'Jatayu’s Valorous Battle Against Ravana',
    kanda: 'Aranya Kanda',
    description: 'The ancient eagle king Jatayu courageously attacks Ravana in midair to protect Goddess Sita, demonstrating that virtue fights for justice regardless of the odds.',
    characters: ['Jatayu', 'Ravana', 'Goddess Sita'],
    imageUrl: 'https://images.unsplash.com/photo-1699854227507-4b9ff940652a?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'art-7',
    title: 'The Sacred Pact of Friendship at Lake Pampa',
    kanda: 'Kishkindha Kanda',
    description: 'Lord Hanuman introduces Rama and Lakshmana to Sugriva before a sacred fire on Mount Rishyamukha, forging the divine bond between humans and vanaras.',
    characters: ['Lord Rama', 'Lord Hanuman', 'Sugriva', 'Lakshmana'],
    imageUrl: 'https://images.unsplash.com/photo-1637648652899-efff280b1f9b?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'art-8',
    title: 'Hanuman’s Cosmic Leap Across the Southern Ocean',
    kanda: 'Sundara Kanda',
    description: 'Assuming a colossal form, Lord Hanuman leaps from Mount Mahendra across the foaming sea, soaring through thunderclouds to reach the island fortress of Lanka.',
    characters: ['Lord Hanuman', 'Jambavan', 'Angada'],
    imageUrl: 'https://images.unsplash.com/photo-1700601589928-8937ebf649fa?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'art-9',
    title: 'The Token of Hope in Ashoka Vatika',
    kanda: 'Sundara Kanda',
    description: 'In the secluded Ashoka grove, Hanuman bows reverently before Goddess Sita, presenting Lord Rama’s engraved golden signet ring and rekindling divine hope.',
    characters: ['Goddess Sita', 'Lord Hanuman'],
    imageUrl: 'https://images.unsplash.com/photo-1605367334994-40c8555337e1?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'art-10',
    title: 'Construction of the Floating Ram Setu Bridge',
    kanda: 'Yuddha Kanda',
    description: 'Nala, Nila, and the Vanara army inscribe the holy name of Rama on boulders, watching them miraculously float upon the ocean to pave the highway of righteousness.',
    characters: ['Lord Rama', 'Lord Hanuman', 'Nala', 'Nila', 'Sugriva'],
    imageUrl: 'https://images.unsplash.com/photo-1577083753695-e010191bacb5?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'art-11',
    title: 'The Fall of Ravana & The Cosmic Victory of Dharma',
    kanda: 'Yuddha Kanda',
    description: 'Invoking the Aditya Hridaya prayer and releasing the celestial Brahmastra arrow, Lord Rama defeats Ravana on the shores of Lanka, restoring universal cosmic order.',
    characters: ['Lord Rama', 'Ravana', 'Lakshmana', 'Vibhishana'],
    imageUrl: 'https://images.unsplash.com/photo-1699854227507-4b9ff940652a?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'art-12',
    title: 'The Golden Age of Ramrajya in Ayodhya',
    kanda: 'Uttara Kanda',
    description: 'Lord Rama and Goddess Sita enthroned in Ayodhya, inaugurating an era where righteousness, prosperity, compassionate governance, and universal peace flourished.',
    characters: ['Lord Rama', 'Goddess Sita', 'Lakshmana', 'Bharata', 'Shatrughna', 'Lord Hanuman'],
    imageUrl: 'https://images.unsplash.com/photo-1741358706805-a5935a200a5c?auto=format&fit=crop&w=1200&q=85',
  },
];

const KANDA_FILTERS = [
  'All Kandas',
  'Bala Kanda',
  'Ayodhya Kanda',
  'Aranya Kanda',
  'Kishkindha Kanda',
  'Sundara Kanda',
  'Yuddha Kanda',
  'Uttara Kanda',
];

export const RamayanaGallery: React.FC = () => {
  const [activeKanda, setActiveKanda] = useState<string>('All Kandas');
  const [selectedArtwork, setSelectedArtwork] = useState<RamayanaArtwork | null>(null);

  const visibleArtworks = activeKanda === 'All Kandas'
    ? RAMAYANA_ARTWORKS
    : RAMAYANA_ARTWORKS.filter((art) => art.kanda === activeKanda);

  return (
    <div className="w-full mt-16 pt-12 border-t border-[#DDAA42]/20">
      {/* Gallery Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#FF8C24] font-cinzel mb-2 flex items-center justify-center gap-2">
          <Layers className="w-4 h-4 text-[#FFC857]" />
          <span>ORIGINAL RAMAYANA PICTURE ARCHIVE</span>
        </p>
        <h2 className="text-2xl md:text-4xl font-playfair font-bold text-white">
          Visual Chronicle of All Seven Kandas
        </h2>
        <p className="mt-2 text-xs md:text-sm text-[#D6BD8B]/80 leading-relaxed font-light">
          Explore authentic high-resolution illustrations depicting the landmark episodes of the Valmiki Ramayana, rendered with traditional Indian royal aesthetics and cinematic lighting.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {KANDA_FILTERS.map((kf) => (
          <button
            key={kf}
            onClick={() => setActiveKanda(kf)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-cinzel transition ${
              activeKanda === kf
                ? 'bg-[#FF8C24] text-white font-bold shadow-[0_0_15px_rgba(255,140,36,0.3)]'
                : 'bg-[#11152B] border border-white/10 text-[#D6BD8B] hover:border-white/30'
            }`}
          >
            {kf}
          </button>
        ))}
      </div>

      {/* Masonry / Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleArtworks.map((artwork) => (
          <div
            key={artwork.id}
            onClick={() => {
              setSelectedArtwork(artwork);
              sound.playDiyaLight();
            }}
            className="glass-card rounded-2xl overflow-hidden border border-[#DDAA42]/20 hover:border-[#FFC857]/60 group cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#11152B]">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B1A] via-transparent to-transparent opacity-75" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#080B1A]/80 border border-[#DDAA42]/40 text-[10px] font-cinzel text-[#FFC857]">
                {artwork.kanda}
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-base font-playfair font-bold text-white group-hover:text-gold-gradient transition mb-2">
                {artwork.title}
              </h3>
              <p className="text-xs text-[#D6BD8B]/80 line-clamp-2 leading-relaxed mb-3">
                {artwork.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {artwork.characters.slice(0, 3).map((ch, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-2 py-0.5 rounded bg-[#11152B] border border-white/10 text-[#D6BD8B]/70"
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedArtwork && (
        <div
          className="fixed inset-0 z-50 bg-[#080B1A]/95 backdrop-blur-md p-4 md:p-8 flex items-center justify-center animate-fadeIn"
          onClick={() => setSelectedArtwork(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#11152B] border border-[#DDAA42]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#080B1A]/80 border border-white/20 text-white hover:bg-[#FF8C24] transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="md:w-3/5 bg-black flex items-center justify-center max-h-[60vh] md:max-h-[75vh]">
              <img
                src={selectedArtwork.imageUrl}
                alt={selectedArtwork.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-cinzel text-[#FF8C24] uppercase tracking-wider block mb-1">
                  {selectedArtwork.kanda}
                </span>
                <h3 className="text-2xl font-playfair font-bold text-white mb-3">
                  {selectedArtwork.title}
                </h3>
                <p className="text-xs md:text-sm text-[#D6BD8B]/90 leading-relaxed mb-4">
                  {selectedArtwork.description}
                </p>
                <div>
                  <p className="text-[10px] font-cinzel text-[#DDAA42] uppercase tracking-wider mb-1.5">
                    Depicted Figures:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArtwork.characters.map((ch, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-md bg-[#080B1A] border border-white/10 text-white/90"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#D6BD8B]/70 font-cinzel">
                <span>Primary Narrative: Valmiki Ramayana</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
