export type PageTab = 
  | 'home' 
  | 'diya' 
  | 'rangoli' 
  | 'ramayana' 
  | 'ravana-dahan' 
  | 'diwali-return'
  | 'gallery' 
  | 'ecard' 
  | 'theater'
  | 'about'
  | 'pdf-showcase'
  | 'design-system';

export type Language = 'en' | 'hi' | 'bn';

export interface RangoliPattern {
  id: string;
  name: string;
  color: string;
  layers: number;
  symmetry: number;
  description: string;
}

export interface ECardData {
  recipient: string;
  sender: string;
  message: string;
  theme: 'royal-gold' | 'midnight-saffron' | 'lotus-floral' | 'temple-minimal' | 'traditional-ruby';
  rangoliBg: string; // preset id or data URL
  stickers: Array<{
    id: string;
    emoji: string;
    name: string;
    x: number; // percentage
    y: number; // percentage
    size: number;
  }>;
}

export interface RamayanaChapter {
  id: number;
  kandaName: string;
  romanNumber: string;
  title: string;
  titleHi: string;
  titleBn: string;
  subtitle: string;
  summary: string;
  fullStory: string;
  moral: string;
  character: string;
  keyEvents: string[];
  color: string;
  imageUrl: string;
  subtitles: {
    en: string;
    hi: string;
    bn: string;
  };
}

export interface RamayanaArtwork {
  id: string;
  title: string;
  kanda: 'Bala Kanda' | 'Ayodhya Kanda' | 'Aranya Kanda' | 'Kishkindha Kanda' | 'Sundara Kanda' | 'Yuddha Kanda' | 'Uttara Kanda';
  description: string;
  characters: string[];
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Diyas' | 'Rangoli' | 'Temples' | 'Fireworks' | 'Festival Lights' | 'Festivities' | 'Family' | 'AI Visions';
  location: string;
  credit: string;
  imageUrl: string;
  description: string;
  isAiGenerated?: boolean;
  radianceScore?: number;
}

