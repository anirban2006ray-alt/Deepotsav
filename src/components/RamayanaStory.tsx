import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { RamayanaChapter } from '../types';
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Brain,
  Layers,
  ArrowRight
} from 'lucide-react';

const KANDAS: RamayanaChapter[] = [
  {
    id: 1,
    kandaName: 'Bala Kanda',
    romanNumber: '01',
    title: 'The Birth and Youth of Lord Rama',
    titleHi: 'बाल काण्ड • प्रभु श्री राम का जन्म व विवाह',
    titleBn: 'বাল কাণ্ড • শ্রীরামের জন্ম ও সীতা বিবাহ',
    subtitle: 'A Royal Beginning in Ayodhya',
    summary: 'The birth of Lord Rama to King Dasharatha and Queen Kaushalya, early training under Sage Vishvamitra, protecting the sacred hermitage, breaking Lord Shiva’s celestial bow Pinaka, and the divine wedding with Goddess Sita.',
    fullStory: `In the prosperous kingdom of Ayodhya on the banks of the sacred Sarayu river, King Dasharatha performed the Putrakameshti Yajna under Sage Rishyashringa. Lord Vishnu incarnated as Rama, born to Queen Kaushalya on the auspicious ninth day of Chaitra (Rama Navami). He grew with his brothers Bharata, Lakshmana, and Shatrughna, mastering the Vedas and martial sciences under Sage Vasishtha.

When Sage Vishvamitra requested Rama to protect his hermitage from the demons Tataka, Subahu, and Maricha, the young prince fulfilled his dharma effortlessly. Vishvamitra then brought Rama and Lakshmana to King Janaka's court in Mithila for the Swayamvara of Goddess Sita. Effortlessly lifting the colossal bow of Lord Shiva (Pinaka), Rama strung it until it broke with a thunderous resonance heard across the heavens. Rama and Sita were united in sacred marriage, joining two luminous royal lineages in virtue.`,
    moral: 'Righteousness, humility, and protection of the innocent are the foremost duty of leadership.',
    character: 'Lord Rama, Goddess Sita, King Dasharatha, Sage Vishvamitra, King Janaka',
    keyEvents: ['Putrakameshti Yajna', 'Rama Navami Birth', 'Protection of Vishvamitra Hermitage', 'Breaking of Shiva’s Bow Pinaka', 'Marriage to Sita in Mithila'],
    color: '#DDAA42',
    imageUrl: 'https://images.unsplash.com/photo-1577083753695-e010191bacb5?auto=format&fit=crop&w=1200&q=85',
    subtitles: {
      en: 'In Ayodhya, a new beginning brings joy to the royal household. Rama’s story begins with kindness, courage, and a life guided by duty.',
      hi: 'अयोध्या में श्री राम का जन्म संपूर्ण जगत में धर्म और आनंद का प्रकाश लेकर आया।',
      bn: 'অযোধ্যায় রামের জন্ম নিয়ে এলো আনন্দ, ন্যায় ও সত্যের এক নতুন প্রভাত।',
    },
  },
  {
    id: 2,
    kandaName: 'Ayodhya Kanda',
    romanNumber: '02',
    title: 'The Royal Exile and Sacrifice',
    titleHi: 'अयोध्या काण्ड • वनवास का संकल्प व त्याग',
    titleBn: 'অযোধ্যা কাণ্ড • সিংহাসন ত্যাগ ও বনবাস',
    subtitle: 'Duty Beyond the Palace',
    summary: 'On the eve of Rama’s coronation, Queen Kaikeyi demands fourteen years of forest exile for Rama and the throne for Bharata. Rama renounces the crown without hesitation, accompanied by Sita and Lakshmana.',
    fullStory: `As King Dasharatha prepared to crown Rama as Yuvaraja (crown prince), the city of Ayodhya burst into celebration. However, poisoned by the wicked counsel of her maid Manthara, Queen Kaikeyi invoked two boons promised to her long ago during battle: that her son Bharata be crowned king, and that Rama be exiled to the Dandaka forest for fourteen years.

To preserve his father’s sacred honor and truth (Satya), Rama accepted the decree with serene composure, free from resentment or anger. Goddess Sita and prince Lakshmana insisted on walking the ascetic path by his side. Dressing in bark garments, they crossed the Ganges with the help of Guha, the Nishada king. When Bharata learned of the injustice upon returning to Ayodhya, he refused the throne, placing Rama's wooden sandals (Padukas) on the seat of state and ruling solely as his devoted regent from Nandigram.`,
    moral: 'Unwavering adherence to truth (Satya) and honor is greater than earthly kingdoms or power.',
    character: 'Lord Rama, Goddess Sita, Lakshmana, King Dasharatha, Kaikeyi, Bharata, Guha',
    keyEvents: ['Coronation Preparations', 'Kaikeyi’s Two Boons', 'Rama Accepts Exile', 'Crossing the Ganga with Guha', 'Bharata Worships Rama’s Padukas'],
    color: '#FF8C24',
    imageUrl: 'https://images.unsplash.com/photo-1700993714468-408700d3599e?auto=format&fit=crop&w=1200&q=85',
    subtitles: {
      en: 'Leaving royal comforts behind, they face uncertainty together, revealing the strength of loyalty, love, and a promise kept.',
      hi: 'राजमहल के सुखों को त्यागकर, श्री राम, सीता और लक्ष्मण ने कर्तव्य के पथ को चुना।',
      bn: 'সিংহাসনের মোহ ত্যাগ করে, সত্য ও কর্তব্যের খাতিরে বনবাস বরণ করলেন রাম।',
    },
  },
  {
    id: 3,
    kandaName: 'Aranya Kanda',
    romanNumber: '03',
    title: 'Forest Life and the Abduction of Sita',
    titleHi: 'अरण्य काण्ड • स्वर्ण मृग व सीता हरण',
    titleBn: 'অরণ্য কাণ্ড • সুবর্ণ মৃগ ও সীতা হরণ',
    subtitle: 'Courage in Adversity',
    summary: 'The holy hermitage at Panchavati, the deception of the golden deer Maricha, Ravana’s abduction of Goddess Sita, and the valiant sacrifice of the vulture king Jatayu.',
    fullStory: `For ten years, Rama, Sita, and Lakshmana lived peacefully among sages in the sacred forests, eventually building a thatched cottage at Panchavati on the banks of the Godavari. When the demoness Surpanakha attempted to harm Sita, Lakshmana punished her. In retaliation, her brother Ravana, ruler of Lanka, hatched a cunning trap.

Ravana commanded Maricha to transform into a luminous golden deer with gemstone spots. Enchanted by its beauty, Sita requested Rama to capture it. When Maricha was struck by Rama’s arrow, he cried out in Rama’s voice, prompting Lakshmana to search for his brother. Seizing the opportunity, Ravana approached in the guise of an ascetic mendicant, crossed the protective perimeter, and abducted Sita into his flying chariot. The heroic bird king Jatayu fought fiercely to rescue Sita, suffering fatal wounds while delaying the demon king.`,
    moral: 'Outer illusions and deceptive allure can lead to grave trials; true courage endures through steadfast resolve.',
    character: 'Lord Rama, Goddess Sita, Lakshmana, Ravana, Maricha, Jatayu, Surpanakha',
    keyEvents: ['Life in Panchavati Hermitage', 'Encounter with Surpanakha', 'Illusion of the Golden Deer', 'Abduction of Sita', 'Jatayu’s Heroic Battle and Moksha'],
    color: '#E85A2C',
    imageUrl: 'https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?auto=format&fit=crop&w=1200&q=85',
    subtitles: {
      en: 'This chapter honors Sita’s dignity, resolve, and enduring inner strength in the face of immense adversity.',
      hi: 'अशोक वाटिका में बंदी होने पर भी माता सीता का आत्मबल और धर्म अडिग रहा।',
      bn: 'লঙ্কার অশোক বনে বন্দিনী হয়েও সীতার আত্মমর্যাদা ও চারিত্রিক দৃঢ়তা ছিল অটল।',
    },
  },
  {
    id: 4,
    kandaName: 'Kishkindha Kanda',
    romanNumber: '04',
    title: 'The Alliance with Sugriva and Hanuman',
    titleHi: 'किष्किन्धा काण्ड • सुग्रीव मित्रता व हनुमान मिलन',
    titleBn: 'কিষ্কিন্ধা কাণ্ড • সুগ্রীব মৈত্রী ও হনুমানের পরিচয়',
    subtitle: 'Divine Friendship & Search Party',
    summary: 'Rama meets Lord Hanuman and Sugriva on Mount Rishyamukha, restores Sugriva to his kingdom by slaying Vali, and dispatches the Vanara search armies in all four directions.',
    fullStory: `Grieving the loss of Sita, Rama and Lakshmana travelled south to Mount Rishyamukha near Lake Pampa. There, Lord Hanuman approached them disguised as a wandering scholar, instantly recognizing Lord Rama as the Supreme Lord. Hanuman introduced them to the exiled Vanara king Sugriva.

Rama and Sugriva forged a sacred pact of friendship before a blazing fire: Rama promised to liberate Kishkindha from the tyranny of Vali, and Sugriva pledged the entire Vanara army to discover Sita. After Vali’s defeat, Sugriva was crowned king, with Angada as prince. Sugriva mobilized legions of Vanaras under the leadership of Angada, Jambavan, and Hanuman to search the southern ocean shores. At Mount Mahendra, the elder bird Sampati revealed that Sita was held across the sea in Lanka.`,
    moral: 'True alliance is rooted in mutual righteousness and selfless service to truth.',
    character: 'Lord Rama, Lord Hanuman, Sugriva, Lakshmana, Vali, Jambavan, Angada, Sampati',
    keyEvents: ['Meeting at Lake Pampa', 'Alliance with Sugriva', 'Liberation of Kishkindha', 'Vanara Search Expedition', 'Sampati’s Revelation of Lanka'],
    color: '#168B78',
    imageUrl: 'https://images.unsplash.com/photo-1741358706805-a5935a200a5c?auto=format&fit=crop&w=1200&q=85',
    subtitles: {
      en: 'Devotion becomes action in service of truth. Hanuman’s leap is a timeless beacon of courage and loyalty.',
      hi: 'हनुमान जी ने अथाह सागर लांघकर माता सीता को प्रभु श्री राम का संदेश और आशा दी।',
      bn: 'সমুদ্র পার হয়ে লঙ্কায় পৌঁছে হনুমান সীতাকে দিলেন আশার পবিত্র বার্তা।',
    },
  },
  {
    id: 5,
    kandaName: 'Sundara Kanda',
    romanNumber: '05',
    title: 'Hanuman’s Leap and the Quest in Lanka',
    titleHi: 'सुन्दर काण्ड • लंका दहन व मुद्रिका समर्पण',
    titleBn: 'সুন্দর কাণ্ড • সমুদ্র উল্লম্ফন ও অশোক বনে সীতা',
    subtitle: 'The Triumph of Devotion',
    summary: 'Hanuman leaps across the ocean to Lanka, discovers Sita steadfast in the Ashoka Vatika, delivers Rama’s signet ring, and demonstrates divine power by burning the fortress of arrogance.',
    fullStory: `Reminded of his divine powers by the venerable bear king Jambavan, Lord Hanuman assumed a colossal form (Vishwaroopa) and took a mighty leap from Mount Mahendra across the roaring ocean. Overcoming the obstacles of Mainaka, Surasa, and the sea monster Sinhika, Hanuman reached the golden fortress of Lanka at nightfall.

Searching meticulously, he discovered Goddess Sita seated beneath a Shimshapa tree in the Ashoka Vatika grove, immersed in meditation on Rama and refusing Ravana’s arrogant threats. Waiting until night, Hanuman descended and dropped Lord Rama’s engraved golden signet ring into her lap. Overjoyed, Sita gave Hanuman her hair ornament (Chudamani) as a token of faith. To deliver a warning to Ravana, Hanuman destroyed the royal orchards. When captured and his tail wrapped in cloth and set aflame, Hanuman leapt across Lanka, reducing its towers to ash before returning to Rama with the joyful news: "I have seen Sita!"`,
    moral: 'Faith, pure intent, and devotion have the power to overcome impossible oceans and conquer all fear.',
    character: 'Lord Hanuman, Goddess Sita, Ravana, Jambavan, Vibhishana',
    keyEvents: ['Leap Across the Ocean', 'Infiltration of Golden Lanka', 'Discovery of Sita in Ashoka Vatika', 'Delivery of Rama’s Signet Ring', 'Burning of Lanka & Return'],
    color: '#FFC857',
    imageUrl: 'https://images.unsplash.com/photo-1699854227507-4b9ff940652a?auto=format&fit=crop&w=1200&q=85',
    subtitles: {
      en: 'In the Ashoka grove, Hanuman offers Rama’s ring as a sign of hope, bringing reassurance and purpose.',
      hi: 'हनुमान जी ने अशोक वाटिका में माता सीता को श्री राम की मुद्रिका भेंट कर ढांढस बंधाया।',
      bn: 'অশোক বনে সীতাকে শ্রীরামের আংটি দিয়ে হনুমান আশার আলো প্রজ্বলিত করলেন।',
    },
  },
  {
    id: 6,
    kandaName: 'Yuddha Kanda',
    romanNumber: '06',
    title: 'The Great Battle and the Defeat of Ravana',
    titleHi: 'युद्ध काण्ड • राम सेतु, रावण वध व अयोध्या आगमन',
    titleBn: 'যুদ্ধ কাণ্ড • রাম সেতু ও রাবণ বধ',
    subtitle: 'The Stand for Universal Dharma',
    summary: 'The building of the floating Ram Setu bridge, the righteous defection of Vibhishana, the epic battle against Kumbhakarna, Meghnad, and Ravana, and the triumphant return to Ayodhya.',
    fullStory: `Rama's army reached the shores of the southern ocean. Ravana's noble brother Vibhishana, having advised peace, was banished and surrendered to Rama, who granted him sanctuary (Abhaya). Under the divine architect Nala and Nila, the Vanara army inscribed 'Rama' on stones, constructing the floating Ram Setu bridge across the sea to Lanka.

A titanic war commenced. Lakshmana defeated Ravana's invincible sorcerer son Meghnad (Indrajit). Rama subdued the giant warrior Kumbhakarna. Finally, Rama and Ravana met in single combat. As Ravana’s severed heads regenerated endlessly through the boon of Brahma, Sage Agastya imparted the Aditya Hridaya Stotram to Rama. Invoking the celestial Brahmastra arrow guided by truth, Rama struck Ravana's heart, liberating the world from darkness. Vibhishana was consecrated king of Lanka, and Sita was reunited with Rama. Boarding the aerial Pushpaka Vimana, they returned to Ayodhya after 14 years, where millions of lamps illuminated their coronation.`,
    moral: 'Arrogance and brute power will inevitably perish; righteousness (Dharma) alone endures and protects.',
    character: 'Lord Rama, Goddess Sita, Lakshmana, Ravana, Lord Hanuman, Vibhishana, Kumbhakarna, Meghnad',
    keyEvents: ['Construction of Ram Setu Bridge', 'Vibhishana’s Sanctuary', 'Defeat of Kumbhakarna and Meghnad', 'Slaying of Ravana with Brahmastra', 'Reunion and Homecoming to Ayodhya'],
    color: '#8B48B8',
    imageUrl: 'https://images.unsplash.com/photo-1637648652899-efff280b1f9b?auto=format&fit=crop&w=1200&q=85',
    subtitles: {
      en: 'With Ravana defeated, Rama, Sita, and Lakshmana return to Ayodhya. Rows of lamps welcome their homecoming.',
      hi: 'अधर्म पर धर्म की विजय के पश्चात श्री राम का पुष्पक विमान से अयोध्या में भव्य आगमन हुआ।',
      bn: 'রাবণ বধের পর সীতাকে নিয়ে অযোধ্যায় ফিরলেন শ্রীরাম; প্রজ্বলিত হলো প্রথম দীপাবলি।',
    },
  },
  {
    id: 7,
    kandaName: 'Uttara Kanda',
    romanNumber: '07',
    title: 'The Epilogue & The Reign of Ramrajya',
    titleHi: 'उत्तर काण्ड • रामराज्य व शाश्वत धर्म',
    titleBn: 'উত্তর কাণ্ড • রামরাজ্য ও আধ্যাত্মিক শিক্ষা',
    subtitle: 'The Ideal Kingdom of Righteousness',
    summary: 'The golden era of Ramrajya where truth, abundance, peace, and harmony prevailed. An epilogue reflecting on the universal legacy of the Valmiki Ramayana.',
    fullStory: `The consecration of Lord Rama heralded the golden age known throughout world literature as Ramrajya. Under his righteous governance, there was no untimely sorrow, poverty, crime, or affliction; the earth yielded bountiful harvests and all living beings flourished in mutual compassion and duty.

The Valmiki Ramayana presents this concluding Kanda as a profound reflection on the burdens of royal duty, personal sacrifice for collective harmony, the birth of Rama's noble sons Lava and Kusha, and the eternal spiritual return of the avatars to their cosmic source in Vaikuntha. Across regional traditions (Tulsidas’s Ramcharitmanas, Krittibas Ramayan in Bengal, and Kamba Ramayanam in the South), the narrative underscores that the true Ramrajya is built not merely on stone palaces, but within every human heart that chooses truth over falsehood and light over inner darkness.`,
    moral: 'True leadership serves the welfare of all living beings without ego or personal attachment.',
    character: 'Lord Rama, Goddess Sita, Lava, Kusha, Sage Valmiki, Bharata, Lakshmana',
    keyEvents: ['Coronation of Lord Rama', 'The Golden Age of Ramrajya', 'The Wisdom of Valmiki’s Epic', 'Transmission of Ramayana by Lava and Kusha', 'The Eternal Message of Dharma'],
    color: '#168B78',
    imageUrl: 'https://images.unsplash.com/photo-1605367334994-40c8555337e1?auto=format&fit=crop&w=1200&q=85',
    subtitles: {
      en: 'Ramrajya represents the timeless ideal of peace, justice, and truth that continues to inspire humanity.',
      hi: 'रामराज्य का शाश्वत संदेश है सत्य, न्याय, करुणा और लोक-कल्याण की स्थापना।',
      bn: 'রামরাজ্যের আদর্শ হলো সত্য, ন্যায় ও সার্বজনীন কল্যাণের শাশ্বত পথ।',
    },
  },
];

export const RamayanaStory: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [subtitleLang, setSubtitleLang] = useState<'en' | 'hi' | 'bn'>('en');

  // AI Philosophical Inquiry state
  const [inquiryQuestion, setInquiryQuestion] = useState<string>('');
  const [aiReflection, setAiReflection] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const chapter = KANDAS[currentIdx];

  // Narration Voice Handler
  const handleToggleNarration = () => {
    if (isNarrating) {
      window.speechSynthesis?.cancel();
      setIsNarrating(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${chapter.kandaName}: ${chapter.title}. ${chapter.summary}. ${chapter.fullStory}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);

    window.speechSynthesis.speak(utterance);
    setIsNarrating(true);
    sound.playTempleBell();
  };

  const handleNextChapter = () => {
    window.speechSynthesis?.cancel();
    setIsNarrating(false);
    if (currentIdx < KANDAS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      sound.playDiyaLight();
    }
  };

  const handlePrevChapter = () => {
    window.speechSynthesis?.cancel();
    setIsNarrating(false);
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      sound.playDiyaLight();
    }
  };

  const handleAskPhilosophy = async (queryText?: string) => {
    const q = queryText || inquiryQuestion;
    if (!q.trim()) return;

    setIsLoadingAi(true);
    setAiReflection('');
    try {
      const response = await fetch('/api/gemini/deep-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await response.json();
      if (data.reflection) {
        setAiReflection(data.reflection);
        sound.playTempleBell();
      }
    } catch (e) {
      console.error('Failed to get deep reflection:', e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#DDAA42] font-cinzel mb-2">
          ✦ THE COMPLETE RAMAYANA • VALMIKI CHRONICLE ✦
        </p>
        <h1 className="text-3xl md:text-5xl font-playfair font-bold text-gold-gradient">
          The Journey of Lord Rama
        </h1>
        <p className="mt-3 text-sm md:text-base text-[#D6BD8B]/80 leading-relaxed font-light">
          An authentic, illustrated retelling of all seven Kandas of the Valmiki Ramayana—celebrating courage, truth, selfless devotion, and the supreme triumph of light over darkness.
        </p>
      </div>

      {/* Main Chapter Showcase Card */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch mb-10">
        {/* Left Side: Cinematic Chapter Visual Scene */}
        <div className="relative rounded-3xl overflow-hidden border border-[#DDAA42]/30 p-8 md:p-12 flex flex-col justify-between shadow-2xl min-h-[480px] bg-gradient-to-br from-[#1A1226] via-[#2A162D] to-[#451B1C]">
          <div className="absolute top-8 right-8 text-7xl font-cinzel text-white/5 font-bold pointer-events-none select-none">
            {chapter.romanNumber}
          </div>

          {/* Top Tag & Language Subtitle Toggle */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3.5 py-1 rounded-full bg-[#080B1A]/85 border border-[#DDAA42]/40 text-xs font-cinzel text-[#FFC857] shadow-sm">
              {chapter.kandaName} • Chapter {chapter.romanNumber} / 07
            </span>

            <div className="flex items-center gap-1 bg-[#080B1A]/85 p-1 rounded-xl border border-white/10 text-xs font-cinzel">
              {(['en', 'hi', 'bn'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSubtitleLang(lang)}
                  className={`px-2.5 py-0.5 rounded transition ${
                    subtitleLang === lang ? 'bg-[#FF8C24] text-white font-bold' : 'text-[#D6BD8B]/70 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'বাংলা'}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Summary */}
          <div className="relative z-10 my-auto py-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#FF8C24] font-cinzel mb-2">
              {chapter.subtitle}
            </p>
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-2 leading-tight">
              {chapter.title}
            </h2>
            <p className="text-sm font-cinzel text-[#DDAA42] mb-4">
              {subtitleLang === 'hi' ? chapter.titleHi : subtitleLang === 'bn' ? chapter.titleBn : chapter.character}
            </p>
            <p className="text-sm md:text-base text-[#F4EBDD]/90 leading-relaxed max-w-xl">
              {chapter.summary}
            </p>

            {/* Key Events Badges */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {chapter.keyEvents.map((event, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2.5 py-1 rounded-md bg-[#080B1A]/60 border border-white/10 text-[#D6BD8B]"
                >
                  {event}
                </span>
              ))}
            </div>
          </div>

          {/* Subtitles Box */}
          <div className="relative z-10 bg-[#080B1A]/85 border border-[#DDAA42]/30 p-4 rounded-2xl">
            <p className="text-[10px] uppercase font-cinzel text-[#DDAA42] tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF8C24]" /> Read-Along Subtitles ({subtitleLang.toUpperCase()})
            </p>
            <p className="text-xs text-white/90 italic font-playfair leading-relaxed">
              "{chapter.subtitles[subtitleLang]}"
            </p>
          </div>
        </div>

        {/* Right Side: Chapter Reading & Audio Controls */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-[#DDAA42]/30 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-gold-gradient flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#FF8C24]" /> Sacred Valmiki Narration
              </h3>
              <button
                onClick={handleToggleNarration}
                className={`px-3 py-1.5 rounded-full border text-xs font-cinzel flex items-center gap-1.5 transition ${
                  isNarrating
                    ? 'border-[#FF5B22] bg-[#FF5B22]/20 text-[#FFC857] animate-pulse'
                    : 'border-white/20 text-[#D6BD8B] hover:border-[#FFC857]'
                }`}
              >
                {isNarrating ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isNarrating ? 'Pause Audio' : 'Play Narration'}</span>
              </button>
            </div>

            <div className="prose prose-invert max-w-none text-xs md:text-sm text-[#D6BD8B]/90 leading-relaxed space-y-4">
              <p>{chapter.fullStory}</p>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-[#080B1A]/60 border border-[#DDAA42]/20 flex items-start gap-3">
              <span className="text-xl">🪔</span>
              <div>
                <p className="text-xs font-cinzel text-[#FFC857] font-bold">Moral of {chapter.kandaName}</p>
                <p className="text-xs text-[#D6BD8B]/80 mt-0.5">{chapter.moral}</p>
              </div>
            </div>
          </div>

          {/* Chapter Navigation Controls */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handlePrevChapter}
              disabled={currentIdx === 0}
              className="py-2.5 px-4 rounded-xl border border-white/20 text-xs font-cinzel flex items-center gap-2 disabled:opacity-30 hover:border-[#FFC857] transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Kanda
            </button>

            <span className="text-xs font-cinzel text-[#D6BD8B]/70 tracking-widest">
              {currentIdx + 1} / {KANDAS.length}
            </span>

            <button
              onClick={handleNextChapter}
              disabled={currentIdx === KANDAS.length - 1}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-2 disabled:opacity-30 hover:opacity-95 transition"
            >
              <span>Next Kanda</span> <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 7 Kandas Horizontal Timeline Bar */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 mb-14">
        {KANDAS.map((ch, idx) => (
          <button
            key={ch.id}
            onClick={() => {
              window.speechSynthesis?.cancel();
              setIsNarrating(false);
              setCurrentIdx(idx);
            }}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
              currentIdx === idx
                ? 'border-[#FFC857] bg-[#FF8C24]/15 text-[#FFC857] font-bold shadow-md'
                : 'border-white/10 glass-card text-[#D6BD8B]/70 hover:border-white/20'
            }`}
          >
            <span className="text-[10px] font-cinzel text-[#DDAA42]">Kanda {ch.romanNumber}</span>
            <span className="text-xs font-playfair truncate mt-1 text-white">{ch.kandaName}</span>
          </button>
        ))}
      </div>

      {/* Link to the Special Return to Ayodhya Scene */}
      <div className="w-full glass-card p-6 md:p-8 rounded-3xl border border-[#DDAA42]/30 flex flex-col md:flex-row items-center justify-between gap-6 mb-14">
        <div className="max-w-xl">
          <span className="text-xs font-cinzel uppercase tracking-widest text-[#FFC857] block mb-1">
            ✦ SPECIAL DIWALI STORY EXPERIENCE ✦
          </span>
          <h3 className="text-xl md:text-2xl font-playfair font-bold text-white mb-2">
            The Return of Lord Rama to Ayodhya
          </h3>
          <p className="text-xs md:text-sm text-[#D6BD8B]/80 leading-relaxed">
            Experience the magical coronation night that gave birth to Diwali. Walk through the illuminated city of Ayodhya welcoming Rama, Sita, and Lakshmana with thousands of glowing lamps.
          </p>
        </div>

        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('nav-tab', { detail: 'diwali-return' }));
          }}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-2 hover:opacity-95 transition shadow-[0_0_20px_rgba(255,140,36,0.3)] whitespace-nowrap"
        >
          <span>Experience Ayodhya Deepotsav</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* AI Deep Reflections Section (Gemini 4 Argon with ThinkingLevel.HIGH) */}
      <div className="w-full glass-card p-6 md:p-8 rounded-3xl border border-[#DDAA42]/30 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="w-6 h-6 text-[#FFC857]" />
          <div>
            <h3 className="font-cinzel text-lg font-bold text-gold-gradient">
              Philosophical Insights • Gemini 4 Thinking Mode
            </h3>
            <p className="text-xs text-[#D6BD8B]/70">
              Explore the profound moral dilemmas, character psychologies, and spiritual metaphors of the Valmiki Ramayana.
            </p>
          </div>
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap gap-2 my-4">
          {[
            'What is the spiritual significance of the Pushpaka Vimana returning to Ayodhya on Amavasya?',
            'How does Rama’s sacrifice of the throne define the concept of Maryada Purushottama?',
            'What is the symbolic meaning of Jatayu’s sacrifice in defending righteousness?',
            'Explain how the 7 Kandas represent the spiritual journey of the human soul.',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setInquiryQuestion(prompt);
                handleAskPhilosophy(prompt);
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-[#11152B] border border-[#DDAA42]/20 text-[#D6BD8B] hover:border-[#FFC857] hover:text-[#FFC857] transition text-left"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inquiryQuestion}
            onChange={(e) => setInquiryQuestion(e.target.value)}
            placeholder="Ask a question about the philosophy, characters, or cultural symbolism of the Ramayana..."
            className="flex-1 bg-[#080B1A] border border-[#DDAA42]/30 rounded-xl px-4 py-2.5 text-xs md:text-sm text-[#F4EBDD] focus:outline-none focus:border-[#FFC857]"
          />
          <button
            onClick={() => handleAskPhilosophy()}
            disabled={isLoadingAi || !inquiryQuestion.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8C24] to-[#DDAA42] text-[#080B1A] font-bold font-cinzel text-xs flex items-center gap-2 hover:opacity-95 transition disabled:opacity-50"
          >
            {isLoadingAi ? 'Reflecting…' : 'Reflect'} <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {aiReflection && (
          <div className="mt-6 p-5 rounded-2xl bg-[#080B1A]/80 border border-[#DDAA42]/30 text-xs md:text-sm text-[#F4EBDD] leading-relaxed whitespace-pre-line animate-fadeIn">
            {aiReflection}
          </div>
        )}
      </div>
    </div>
  );
};
