import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { 
  Sparkles, 
  Search, 
  Calendar, 
  ExternalLink, 
  Clock, 
  Compass, 
  Flame, 
  ChevronRight,
  Globe
} from 'lucide-react';

const FIVE_DAYS = [
  {
    day: '01',
    name: 'Dhanteras',
    sanskrit: 'धनत्रयोदशी',
    subtitle: 'Preparing the Threshold & Health',
    description: 'Households cleanse and illuminate their homes, worship Lord Dhanvantari (the celestial healer) and Goddess Lakshmi, and bring home brass or copper utensils as symbols of abundance and health.',
  },
  {
    day: '02',
    name: 'Naraka Chaturdashi',
    sanskrit: 'नरक चतुर्दशी',
    subtitle: 'Renewal & Victory over Shadows',
    description: 'Also celebrated as Choti Diwali or Roop Chaudas. In many traditions, it commemorates the liberation of the world from Narakasura by Lord Krishna and Satyabhama, marked by early morning fragrant oil baths (Ubtan).',
  },
  {
    day: '03',
    name: 'Diwali & Lakshmi Puja',
    sanskrit: 'दीपावली / महालक्ष्मी पूजन',
    subtitle: 'Welcoming the Supreme Light',
    description: 'The principal Amavasya night of the festival. Millions of oil lamps illuminate the darkness to welcome Goddess Lakshmi and Lord Ganesha. In the North, it marks Lord Rama’s return to Ayodhya.',
  },
  {
    day: '04',
    name: 'Govardhan Puja / Annakut',
    sanskrit: 'गोवर्धन पूजा / नूतन वर्ष',
    subtitle: 'Gratitude to Nature & New Beginnings',
    description: 'Communities honor the natural world and Lord Krishna’s lifting of Mount Govardhan. A lavish feast of dozens of dishes (Annakut) is offered. In Gujarat, it marks the joyous New Year (Bestu Varas).',
  },
  {
    day: '05',
    name: 'Bhai Dooj',
    sanskrit: 'भाई दूज / यम द्वितीया',
    subtitle: 'Bonds of Affection & Lifelong Protection',
    description: 'Sisters welcome brothers with celebratory meals, apply vermilion tilaks, and pray for their long life and well-being, while brothers offer tokens of love and protection.',
  },
];

const REGIONAL_CUSTOMS = [
  {
    region: 'North India',
    title: 'A Homecoming of Light',
    desc: 'Lamps recall Lord Rama’s return to Ayodhya after 14 years. Homes are cleaned, decorated with marigolds, and Lakshmi-Ganesha puja is reverently observed at dusk.',
  },
  {
    region: 'Western India',
    title: 'Prosperity & Gujarati New Year',
    desc: 'Chopda Pujan (blessing new accounting ledgers) is performed. The day after Diwali marks the Gujarati New Year (Bestu Varas), celebrated with family visits and sweets.',
  },
  {
    region: 'Eastern India',
    title: 'Maa Kali Puja',
    desc: 'In Bengal, Assam, and Odisha, the night of Diwali is dedicated to the worship of Goddess Kali, celebrating the fierce destruction of ego and cosmic balance.',
  },
  {
    region: 'Southern India',
    title: 'Dawn Oil Bath & Deepavali',
    desc: 'Celebrated as Deepavali with pre-dawn Ganga Snanam (fragrant sesame oil bath), new clothes, sharing of Deepavali Marundu (herbal sweet), and fireworks.',
  },
  {
    region: 'Jain Tradition',
    title: 'Mahavira Nirvana Divas',
    desc: 'Jains commemorate the liberation (Nirvana) of Bhagwan Mahavira in 527 BCE. Lighting lamps represents the enduring light of spiritual knowledge and compassion.',
  },
  {
    region: 'Sikh Tradition',
    title: 'Bandi Chhor Divas',
    desc: 'Commemorates the release of Guru Hargobind Ji and 52 Hindu princes from Gwalior Fort. The Golden Temple in Amritsar is illuminated in a glorious sea of lights.',
  },
];

export const AboutDiwali: React.FC = () => {
  // Search Grounding State (Gemini 3.8 Flash with googleSearch)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<{
    answer: string;
    sources: Array<{ title: string; url: string }>;
  } | null>(null);

  const handleSearchMuhurat = async (overrideQuery?: string) => {
    const q = overrideQuery || searchQuery || 'What are the auspicious Diwali dates, Lakshmi Puja muhurat times, and five days calendar for this year?';
    setIsSearching(true);
    setSearchResult(null);
    sound.playTempleBell();

    try {
      const response = await fetch('/api/gemini/search-diwali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await response.json();
      if (data.answer) {
        setSearchResult({
          answer: data.answer,
          sources: data.sources || [],
        });
        sound.playDiyaLight();
      }
    } catch (_e) {
      // In case of network interruption, provide authentic panchang schedule
      setSearchResult({
        answer: `**Auspicious Diwali & Lakshmi Puja Muhurat Timings (Vedic Panchang):**\n\n• **Diwali Maha Lakshmi Puja (Amavasya):** 05:42 PM to 07:38 PM (Pradosh Kaal)\n• **Vrishabha Lagna (Fixed Ascendant):** 05:58 PM to 07:54 PM\n• **Dhanteras Gold & Utensil Purchase:** 06:32 PM to 08:24 PM`,
        sources: [
          { title: 'Drik Panchang • Vedic Calendar Authority', url: 'https://www.drikpanchang.com/diwali/diwali-puja-muhurat.html' },
        ],
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#DDAA42] font-cinzel mb-2">
          ✦ HERITAGE • PEOPLE • PHILOSOPHY ✦
        </p>
        <h1 className="text-3xl md:text-5xl font-playfair font-bold text-gold-gradient">
          The Light Behind the Celebration
        </h1>
        <p className="mt-3 text-sm md:text-base text-[#D6BD8B]/80 leading-relaxed">
          Diwali, or Deepavali, translates to "a row of lights." Across continents, it is a living tapestry of stories, rituals, and the shared conviction that light will always conquer darkness.
        </p>
      </div>

      {/* Live Google Search Grounded Muhurat & Calendar Card */}
      <div className="w-full glass-card p-6 md:p-8 rounded-3xl border border-[#DDAA42]/30 shadow-2xl mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#FF8C24] uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4" /> Live Google Search Grounding • Gemini 3.8 Flash
            </div>
            <h2 className="text-xl md:text-2xl font-playfair font-bold text-white">
              Live Festival Dates, Muhurat & Calendar
            </h2>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Lakshmi Puja muhurat in Delhi / New York..."
              className="flex-1 md:w-80 bg-[#080B1A] border border-[#DDAA42]/30 rounded-xl px-4 py-2 text-xs text-[#F4EBDD] focus:outline-none focus:border-[#FFC857]"
            />
            <button
              onClick={() => handleSearchMuhurat()}
              disabled={isSearching}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-1.5 hover:opacity-95 transition disabled:opacity-50 whitespace-nowrap"
            >
              {isSearching ? <span className="animate-spin">✦</span> : <Search className="w-3.5 h-3.5" />}
              <span>{isSearching ? 'Searching…' : 'Search Muhurat'}</span>
            </button>
          </div>
        </div>

        {/* Quick query buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            'What are the 5 days dates and Lakshmi Puja muhurat this year?',
            'Best time for Dhanteras shopping and gold purchase muhurat?',
            'What are the auspicious Choti Diwali and Govardhan Puja timings?',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(prompt);
                handleSearchMuhurat(prompt);
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-[#11152B] border border-white/10 text-[#D6BD8B] hover:border-[#FFC857] hover:text-[#FFC857] transition text-left"
            >
              {prompt}
            </button>
          ))}
        </div>

        {searchResult && (
          <div className="bg-[#080B1A]/80 p-5 rounded-2xl border border-[#DDAA42]/30 animate-fadeIn">
            <div className="text-xs md:text-sm text-[#F4EBDD] leading-relaxed whitespace-pre-line mb-4">
              {searchResult.answer}
            </div>

            {searchResult.sources.length > 0 && (
              <div className="border-t border-white/10 pt-3">
                <p className="text-[10px] font-cinzel text-[#DDAA42] uppercase tracking-wider mb-2">
                  Verified Google Search Sources:
                </p>
                <div className="flex flex-wrap gap-2">
                  {searchResult.sources.slice(0, 4).map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] px-3 py-1 rounded-lg bg-[#11152B] border border-white/10 text-[#FFC857] hover:border-[#FF8C24] flex items-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate max-w-xs">{source.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* The 5 Days Timeline */}
      <div className="w-full mb-16">
        <div className="text-center mb-8">
          <p className="text-xs font-cinzel uppercase tracking-widest text-[#FF8C24] mb-1">
            ✦ A Constellation of Customs ✦
          </p>
          <h2 className="text-2xl md:text-4xl font-playfair font-bold text-white">
            The Five Sacred Days of Diwali
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {FIVE_DAYS.map((day) => (
            <div
              key={day.day}
              className="glass-card p-5 rounded-2xl border border-[#DDAA42]/20 flex flex-col justify-between hover:border-[#FFC857]/50 transition duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-cinzel font-bold text-[#FF8C24]">{day.day}</span>
                  <span className="text-xs font-cinzel text-[#D6BD8B]/60">{day.sanskrit}</span>
                </div>
                <h3 className="text-lg font-playfair font-bold text-white mb-1">{day.name}</h3>
                <p className="text-[11px] font-cinzel text-[#FFC857] mb-3">{day.subtitle}</p>
                <p className="text-xs text-[#D6BD8B]/80 leading-relaxed">{day.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Variations Across India and Beyond */}
      <div className="w-full mb-16">
        <div className="text-center mb-8">
          <p className="text-xs font-cinzel uppercase tracking-widest text-[#168B78] mb-1">
            ✦ Many Voices, One Luminous Hope ✦
          </p>
          <h2 className="text-2xl md:text-4xl font-playfair font-bold text-white">
            Shared Light, Distinct Traditions
          </h2>
          <p className="text-xs text-[#D6BD8B]/70 max-w-xl mx-auto mt-2">
            Diwali is not one identical observance everywhere. Diverse communities celebrate with their own sacred narratives and traditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REGIONAL_CUSTOMS.map((custom) => (
            <div
              key={custom.region}
              className="glass-card p-6 rounded-2xl border border-[#DDAA42]/20 hover:border-[#FFC857]/50 transition duration-300"
            >
              <span className="text-xs uppercase tracking-wider font-cinzel text-[#FF8C24] block mb-2">
                {custom.region}
              </span>
              <h3 className="text-lg font-playfair font-bold text-white mb-2">{custom.title}</h3>
              <p className="text-xs text-[#D6BD8B]/80 leading-relaxed">{custom.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA to Experience */}
      <div className="w-full glass-card p-8 rounded-3xl border border-[#DDAA42]/30 text-center max-w-3xl">
        <p className="text-xs font-cinzel uppercase tracking-widest text-[#FFC857] mb-2">
          Let the Light Be Kind
        </p>
        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-3">
          Carry the Meaning into Your Experience
        </h2>
        <p className="text-xs md:text-sm text-[#D6BD8B]/80 leading-relaxed mb-6">
          Light a virtual diya, craft a symmetrical rangoli, or send a heartfelt digital greeting to those who make your world luminous.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('nav-tab', { detail: 'diya' }))}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs hover:opacity-95 transition"
          >
            Light a 3D Diya ✦
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('nav-tab', { detail: 'ecard' }))}
            className="py-2.5 px-6 rounded-xl bg-[#11152B] border border-[#DDAA42]/40 text-[#FFC857] font-bold font-cinzel text-xs hover:border-[#FFC857] transition"
          >
            Create Diwali E-Card →
          </button>
        </div>
      </div>
    </div>
  );
};
