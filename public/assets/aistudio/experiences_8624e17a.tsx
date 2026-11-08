'use client'

import { startTransition, useActionState, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { submitFestivalWish, type WishResult } from '../actions'
import { ArrowIcon, DiyaIcon, FlowerIcon, SparkIcon, StoryIcon } from './icons'

const colors = ['#F38A2B', '#FFD166', '#D73C8C', '#7D65D8', '#2EA77D', '#E84D4D']

function PageIntro({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="eyebrow mb-6 justify-center">
        <span /> {kicker}
      </p>
      <h1 className="section-title text-[clamp(3.4rem,8vw,7.5rem)]">{title}</h1>
      <p className="mx-auto mt-6 max-w-2xl leading-7 text-[#A99C89]">{text}</p>
    </div>
  )
}

export function DiyaStudio() {
  const [lit, setLit] = useState(false)
  const [glow, setGlow] = useState(colors[0])
  const [diyas, setDiyas] = useState(1)
  const [model, setModel] = useState('brass')
  const [flameStyle, setFlameStyle] = useState('natural')
  const [engraving, setEngraving] = useState('paisley')
  const [zoom, setZoom] = useState(1)
  const [rotating, setRotating] = useState(false)

  const resetDiya = () => {
    setLit(false)
    setGlow(colors[0])
    setDiyas(1)
    setModel('brass')
    setFlameStyle('natural')
    setEngraving('paisley')
    setZoom(1)
    setRotating(false)
  }

  return (
    <main className="experience-page">
      <PageIntro
        kicker="A ritual of radiance"
        title="Light your diya."
        text="A single flame can transform the night. Personalize its warmth, then illuminate the whole gathering."
      />
      <section className={`studio-grid mt-14 ${lit ? 'is-lit' : ''}`}>
        <div
          className="scene-card diya-stage"
          style={{ '--glow-color': glow } as React.CSSProperties}
        >
          <div className="stage-stars" />
          <div
            className={`diya-cluster model-${model} flame-${flameStyle} engraving-${engraving} ${rotating ? 'is-rotating' : ''}`}
            style={{ '--diya-zoom': zoom } as React.CSSProperties}
          >
            {Array.from({ length: diyas }).map((_, index) => (
              <button
                className="diya-button"
                key={index}
                onClick={() => setLit((value) => !value)}
                aria-label={lit ? 'Extinguish diya' : 'Light diya'}
              >
                <div className="diya-visual">
                  {lit && (
                    <div className="flame">
                      <span />
                    </div>
                  )}
                  <div className="wick" />
                  <div className="diya-bowl">
                    <div className="diya-rim" />
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="stage-hint">
            {lit ? 'The room is glowing' : 'Select the diya to light it'}
          </p>
        </div>
        <aside className="control-panel">
          <div>
            <p className="control-label">Flame</p>
            <button className={`toggle-row ${lit ? 'active' : ''}`} onClick={() => setLit(!lit)}>
              <span>{lit ? 'Burning brightly' : 'Waiting for light'}</span>
              <i />
            </button>
          </div>
          <div>
            <p className="control-label">Glow color</p>
            <div className="color-row">
              {colors.slice(0, 4).map((color) => (
                <button
                  aria-label={`Use ${color}`}
                  className={glow === color ? 'selected' : ''}
                  key={color}
                  onClick={() => setGlow(color)}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="control-label">Diya design</p>
            <div className="option-grid">
              {['brass', 'gold', 'floral', 'lotus', 'floating'].map((item) => (
                <button
                  className={model === item ? 'active' : ''}
                  key={item}
                  onClick={() => setModel(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="control-label">Flame style</p>
            <div className="segment-control">
              {['natural', 'saffron', 'ethereal'].map((item) => (
                <button
                  className={flameStyle === item ? 'active' : ''}
                  key={item}
                  onClick={() => setFlameStyle(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="control-label">Engraving</p>
            <div className="segment-control">
              {['paisley', 'mandala', 'floral'].map((item) => (
                <button
                  className={engraving === item ? 'active' : ''}
                  key={item}
                  onClick={() => setEngraving(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="control-label">Arrangement</p>
            <div className="segment-control">
              {[1, 3, 5].map((count) => (
                <button
                  className={diyas === count ? 'active' : ''}
                  key={count}
                  onClick={() => setDiyas(count)}
                >
                  {count === 1 ? 'Solo' : count === 3 ? 'Trio' : 'Circle'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="control-label">View</p>
            <div className="view-controls">
              <button
                aria-label="Zoom out"
                onClick={() => setZoom((value) => Math.max(0.72, value - 0.12))}
              >
                −
              </button>
              <button className={rotating ? 'active' : ''} onClick={() => setRotating(!rotating)}>
                Rotate 3D
              </button>
              <button
                aria-label="Zoom in"
                onClick={() => setZoom((value) => Math.min(1.34, value + 0.12))}
              >
                +
              </button>
            </div>
          </div>
          <div className="ritual-note">
            <DiyaIcon />
            <div>
              <b>Did you know?</b>
              <p>The diya symbolizes the inner light that protects us from spiritual darkness.</p>
            </div>
          </div>
          <button
            className="button-primary w-full justify-center"
            onClick={() => {
              setLit(true)
              setDiyas(5)
            }}
          >
            Illuminate all <SparkIcon />
          </button>
          <button className="button-ghost w-full justify-center" onClick={resetDiya}>
            Reset scene
          </button>
        </aside>
      </section>
      <NextJourney href="/rangoli" label="Next: Create a rangoli" />
    </main>
  )
}

export function RangoliStudio() {
  const [color, setColor] = useState(colors[0])
  const [layers, setLayers] = useState(3)
  const [rotation, setRotation] = useState(false)
  const [symmetry, setSymmetry] = useState(8)
  const [preset, setPreset] = useState('Floral')
  const [history, setHistory] = useState<
    Array<{ color: string; layers: number; symmetry: number }>
  >([])
  const [future, setFuture] = useState<Array<{ color: string; layers: number; symmetry: number }>>(
    [],
  )

  const snapshot = () => {
    setHistory((items) => [...items.slice(-9), { color, layers, symmetry }])
    setFuture([])
  }
  const applyPreset = (
    name: string,
    nextColor: string,
    nextLayers: number,
    nextSymmetry: number,
  ) => {
    snapshot()
    setPreset(name)
    setColor(nextColor)
    setLayers(nextLayers)
    setSymmetry(nextSymmetry)
  }
  const undo = () => {
    const previous = history.at(-1)
    if (!previous) return
    setFuture((items) => [{ color, layers, symmetry }, ...items])
    setHistory((items) => items.slice(0, -1))
    setColor(previous.color)
    setLayers(previous.layers)
    setSymmetry(previous.symmetry)
  }
  const redo = () => {
    const next = future[0]
    if (!next) return
    setHistory((items) => [...items, { color, layers, symmetry }])
    setFuture((items) => items.slice(1))
    setColor(next.color)
    setLayers(next.layers)
    setSymmetry(next.symmetry)
  }
  const downloadRangoli = () => {
    const petals = Array.from({ length: layers * symmetry }, (_, index) => {
      const ring = Math.floor(index / symmetry) + 1
      const angle = (index % symmetry) * (360 / symmetry)
      const radius = 34 + ring * 32
      return `<ellipse cx="300" cy="${300 - radius}" rx="12" ry="25" fill="${color}" transform="rotate(${angle} 300 300)" opacity="${0.72 + ring * 0.04}"/>`
    }).join('')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" rx="300" fill="#100914"/><circle cx="300" cy="300" r="44" fill="#FFC857"/><g>${petals}</g></svg>`
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
    link.download = 'my-diwali-rangoli.svg'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const petals = useMemo(() => Array.from({ length: layers * symmetry }), [layers, symmetry])
  return (
    <main className="experience-page">
      <PageIntro
        kicker="A canvas of celebration"
        title="Create in symmetry."
        text="Build a radiant rangoli inspired by flowers, geometry and the joyful colors of Diwali."
      />
      <section className="studio-grid mt-14">
        <div className="scene-card rangoli-stage">
          <div className={`rangoli-art ${rotation ? 'is-rotating' : ''}`}>
            <div className="rangoli-core">
              <FlowerIcon />
            </div>
            {petals.map((_, i) => {
              const ring = Math.floor(i / symmetry) + 1
              const angle = (i % symmetry) * (360 / symmetry) + (ring % 2 ? 0 : 360 / symmetry / 2)
              const distance = 48 + ring * 38
              return (
                <span
                  key={i}
                  style={
                    {
                      '--angle': `${angle}deg`,
                      '--distance': `${distance}px`,
                      '--petal': color,
                    } as React.CSSProperties
                  }
                />
              )
            })}
          </div>
          <div className="rangoli-lamps">
            {[0, 1, 2, 3].map((n) => (
              <i key={n} />
            ))}
          </div>
        </div>
        <aside className="control-panel">
          <div>
            <p className="control-label">Powder palette</p>
            <div className="color-row">
              {colors.map((item) => (
                <button
                  aria-label={`Use ${item}`}
                  className={color === item ? 'selected' : ''}
                  key={item}
                  onClick={() => {
                    snapshot()
                    setColor(item)
                  }}
                  style={{ background: item }}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="control-label">Pattern layers</p>
            <input
              aria-label="Pattern layers"
              className="range"
              max="5"
              min="2"
              onPointerDown={snapshot}
              onChange={(event) => setLayers(Number(event.target.value))}
              type="range"
              value={layers}
            />
          </div>
          <div>
            <p className="control-label">Symmetry</p>
            <div className="segment-control">
              {[4, 8, 16].map((count) => (
                <button
                  className={symmetry === count ? 'active' : ''}
                  key={count}
                  onClick={() => {
                    snapshot()
                    setSymmetry(count)
                  }}
                >
                  {count} fold
                </button>
              ))}
            </div>
          </div>
          <button className="toggle-row" onClick={() => setRotation(!rotation)}>
            <span>Gentle rotation</span>
            <i className={rotation ? 'active' : ''} />
          </button>
          <div className="ritual-note">
            <FlowerIcon />
            <div>
              <b>Made at the threshold</b>
              <p>Rangoli welcomes prosperity and turns a shared entrance into a work of care.</p>
            </div>
          </div>
          <button
            className="button-primary w-full justify-center"
            onClick={() => {
              setLayers(5)
              setRotation(true)
            }}
          >
            Complete design <SparkIcon />
          </button>
          <div className="studio-actions">
            <button disabled={!history.length} onClick={undo}>
              Undo
            </button>
            <button disabled={!future.length} onClick={redo}>
              Redo
            </button>
            <button onClick={() => applyPreset('Clear', '#F38A2B', 2, 4)}>Clear</button>
            <button onClick={downloadRangoli}>Download</button>
          </div>
        </aside>
      </section>
      <section className="preset-section">
        <p className="control-label">Begin with a beautiful foundation</p>
        <div className="preset-grid">
          {[
            ['Floral', '#F38A2B', 3, 8],
            ['Lotus', '#D73C8C', 4, 8],
            ['Peacock', '#2EA77D', 4, 16],
            ['Mandala', '#7D65D8', 5, 16],
            ['Diya', '#FFD166', 3, 4],
            ['Royal', '#E84D4D', 5, 8],
          ].map(([name, itemColor, itemLayers, itemSymmetry]) => (
            <button
              className={preset === name ? 'active' : ''}
              key={String(name)}
              onClick={() =>
                applyPreset(
                  String(name),
                  String(itemColor),
                  Number(itemLayers),
                  Number(itemSymmetry),
                )
              }
            >
              <span style={{ '--preset-color': itemColor } as React.CSSProperties} />
              <b>{name}</b>
            </button>
          ))}
        </div>
      </section>
      <NextJourney href="/ramayana" label="Next: Enter the story" />
    </main>
  )
}

const chapters = [
  {
    number: 'I',
    title: 'The birth of Rama',
    subtitle: 'A life of purpose begins',
    text: 'In Ayodhya, Rama is born to King Dasharatha and Queen Kaushalya. His character comes to embody compassion, discipline and devotion to dharma.',
    color: '#D79347',
  },
  {
    number: 'II',
    title: 'The royal exile',
    subtitle: 'A promise honored',
    text: 'Rama leaves Ayodhya for fourteen years, joined by Sita and his devoted brother Lakshmana. Duty becomes the path, and the forest their home.',
    color: '#7A6EC8',
  },
  {
    number: 'III',
    title: 'Sita’s abduction',
    subtitle: 'The journey changes',
    text: 'Ravana carries Sita to Lanka. Rama and Lakshmana begin a determined search, guided by courage, friendship and unwavering hope.',
    color: '#E85A2C',
  },
  {
    number: 'IV',
    title: 'Hanuman’s journey',
    subtitle: 'Devotion takes flight',
    text: 'Hanuman crosses the ocean to Lanka, finds Sita and carries Rama’s message of hope. His leap becomes a timeless symbol of selfless service.',
    color: '#168B78',
  },
  {
    number: 'V',
    title: 'The great battle',
    subtitle: 'Righteousness tested',
    text: 'Allies gather in Lanka for a decisive struggle. The story reflects on leadership, sacrifice and the responsibility to stand against injustice.',
    color: '#B64635',
  },
  {
    number: 'VI',
    title: 'The return to Ayodhya',
    subtitle: 'A kingdom shines again',
    text: 'Rama, Sita and Lakshmana return home. Rows of lamps illuminate Ayodhya, inspiring one of Diwali’s most cherished stories of homecoming.',
    color: '#E5A94F',
  },
]

export function RamayanaStory() {
  const [chapter, setChapter] = useState(0)
  const [narrating, setNarrating] = useState(false)
  const story = chapters[chapter]
  const changeChapter = (next: number) => {
    window.speechSynthesis?.cancel()
    setNarrating(false)
    setChapter(next)
  }
  const toggleNarration = () => {
    if (narrating) {
      window.speechSynthesis.cancel()
      setNarrating(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(`${story.title}. ${story.text}`)
    utterance.rate = 0.88
    utterance.onend = () => setNarrating(false)
    window.speechSynthesis.speak(utterance)
    setNarrating(true)
  }
  return (
    <main className="story-page">
      <section
        className="story-visual"
        style={{ '--chapter-color': story.color } as React.CSSProperties}
      >
        <div className="story-moon" />
        <div className="mountain mountain-a" />
        <div className="mountain mountain-b" />
        <div className="story-figure">
          <span className="figure-head" />
          <span className="figure-body" />
          <span className="figure-bow" />
        </div>
        <div className="story-caption">कथा · Chapter {story.number}</div>
      </section>
      <section className="story-copy">
        <p className="eyebrow mb-7">
          <span /> The timeless epic
        </p>
        <p className="font-display text-2xl text-[#E5A94F]">{story.subtitle}</p>
        <h1 className="mt-3 font-display text-[clamp(4rem,9vw,8rem)] leading-[.78] tracking-[-.05em]">
          {story.title}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-[#B5A894]">{story.text}</p>
        <div className="mt-12 flex items-center gap-4">
          <button
            className="round-arrow"
            disabled={chapter === 0}
            onClick={() => changeChapter(chapter - 1)}
            aria-label="Previous chapter"
          >
            ←
          </button>
          <span className="min-w-20 text-center text-xs tracking-[.2em] text-[#8D806C]">
            {chapter + 1} / {chapters.length}
          </span>
          <button
            className="round-arrow"
            disabled={chapter === chapters.length - 1}
            onClick={() => changeChapter(chapter + 1)}
            aria-label="Next chapter"
          >
            →
          </button>
        </div>
        <div className="chapter-tabs">
          {chapters.map((item, index) => (
            <button
              className={index === chapter ? 'active' : ''}
              key={item.title}
              onClick={() => changeChapter(index)}
            >
              <span>{item.number}</span>
              {item.title}
            </button>
          ))}
        </div>
        <button
          className={`narration-button ${narrating ? 'active' : ''}`}
          onClick={toggleNarration}
        >
          {narrating ? 'Pause narration' : 'Play narration'}
          <span>{narrating ? 'Sound on' : 'Chapter audio'}</span>
        </button>
        {chapter === chapters.length - 1 && (
          <Link className="button-primary mt-10" href="/ravana-dahan">
            Continue to the finale <ArrowIcon />
          </Link>
        )}
      </section>
    </main>
  )
}

export function RavanaDahan() {
  const scenes = [
    {
      id: 'ready',
      label: 'Festival grounds',
      title: 'Enter the festival.',
      text: 'Lanterns rise above a gathering shaped by memory, music and shared anticipation.',
    },
    {
      id: 'effigy',
      label: 'The effigy',
      title: 'Meet the symbol.',
      text: 'The ten-headed effigy represents the many faces of ego, injustice and darkness to be overcome.',
    },
    {
      id: 'arrow',
      label: 'The divine bow',
      title: 'Take aim at darkness.',
      text: 'Release a symbolic arrow in a respectful retelling of courage, truth and good over evil.',
    },
    {
      id: 'burning',
      label: 'Dahan',
      title: 'The light is rising.',
      text: 'A controlled ceremonial fire transforms the effigy as sparks and embers illuminate the ground.',
    },
    {
      id: 'victory',
      label: 'Celebration',
      title: 'Light has prevailed.',
      text: 'May knowledge overcome ignorance, courage overcome fear and goodness illuminate every path.',
    },
  ] as const
  const [stage, setStage] = useState<(typeof scenes)[number]['id']>('ready')
  const sceneIndex = scenes.findIndex((scene) => scene.id === stage)
  const currentScene = scenes[sceneIndex]
  useEffect(() => {
    if (stage !== 'burning') return
    const victory = window.setTimeout(() => setStage('victory'), 2600)
    return () => {
      window.clearTimeout(victory)
    }
  }, [stage])
  useEffect(() => {
    if (stage === 'victory') window.dispatchEvent(new Event('diwali:celebrate'))
  }, [stage])

  const advance = () => {
    if (stage === 'victory') return setStage('ready')
    if (stage === 'arrow') return setStage('burning')
    setStage(scenes[Math.min(sceneIndex + 1, scenes.length - 1)].id)
  }

  return (
    <main className={`dahan-page stage-${stage}`}>
      <div className="firework firework-one" />
      <div className="firework firework-two" />
      <div className="dahan-copy">
        <p className="eyebrow mb-6">
          <span /> Vijayadashami
        </p>
        <h1 className="font-display text-[clamp(4rem,9vw,8rem)] leading-[.78] tracking-[-.05em]">
          {currentScene.title.split(' ').slice(0, -1).join(' ')}
          <br />
          <em>{currentScene.title.split(' ').at(-1)}</em>
        </h1>
        <p className="mt-7 max-w-md leading-7 text-[#AFA18D]">{currentScene.text}</p>
        <button className="button-primary mt-9" onClick={advance} disabled={stage === 'burning'}>
          {stage === 'ready'
            ? 'Start the experience'
            : stage === 'effigy'
              ? 'Approach the bow'
              : stage === 'arrow'
                ? 'Release the arrow'
                : stage === 'victory'
                  ? 'Experience again'
                  : 'The light is rising'}{' '}
          <ArrowIcon />
        </button>
        <div className="scene-progress">
          {scenes.map((scene, index) => (
            <button
              aria-label={`Go to ${scene.label}`}
              className={index <= sceneIndex ? 'active' : ''}
              key={scene.id}
              onClick={() => setStage(scene.id)}
            >
              <i />
              <span>{scene.label}</span>
            </button>
          ))}
        </div>
        {stage === 'victory' && (
          <div className="victory-links">
            <Link href="/ramayana">Explore Ramayana</Link>
            <Link href="/">Return home</Link>
          </div>
        )}
      </div>
      <div className="festival-ground">
        <div className="arrow-projectile" />
        <div className="ravana-effigy">
          <div className="crown" />
          <div className="effigy-heads">
            {[0, 1, 2, 3, 4].map((i) => (
              <i key={i} />
            ))}
          </div>
          <div className="effigy-torso">
            <span />
            <span />
            <span />
          </div>
          <div className="effigy-flames">
            {Array.from({ length: 8 }).map((_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
        <div className="ground-lights">
          {Array.from({ length: 12 }).map((_, i) => (
            <i key={i} />
          ))}
        </div>
      </div>
    </main>
  )
}

const initialWishState: WishResult = { ok: false, message: '' }

export function GreetingMaker() {
  const [state, action, pending] = useActionState(submitFestivalWish, initialWishState)
  const [tone, setTone] = useState('warm')
  const [design, setDesign] = useState('royal')
  const [recipient, setRecipient] = useState('Someone special')
  const [sender, setSender] = useState('With love')
  const [message, setMessage] = useState(
    'May this Diwali fill your home with warmth, wonder and a thousand little moments of joy.',
  )
  const [shareStatus, setShareStatus] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setRecipient(params.get('to') || 'Someone special')
    setSender(params.get('from') || 'With love')
    setMessage(
      params.get('wish') ||
        'May this Diwali fill your home with warmth, wonder and a thousand little moments of joy.',
    )
    const queryTone = params.get('tone')
    if (queryTone && ['warm', 'joyful', 'traditional'].includes(queryTone)) setTone(queryTone)
    const queryDesign = params.get('design')
    if (queryDesign && ['royal', 'floral', 'minimal', 'saffron'].includes(queryDesign))
      setDesign(queryDesign)
  }, [])

  const greetingUrl = () => {
    const url = new URL(window.location.href)
    url.search = ''
    url.searchParams.set('to', recipient)
    url.searchParams.set('from', sender)
    url.searchParams.set('wish', message)
    url.searchParams.set('tone', tone)
    url.searchParams.set('design', design)
    return url.toString()
  }
  const copyLink = async () => {
    await navigator.clipboard.writeText(greetingUrl())
    setShareStatus('Interactive greeting link copied.')
  }
  const shareGreeting = async () => {
    const url = greetingUrl()
    if (navigator.share) {
      await navigator.share({ title: `A Diwali wish for ${recipient}`, text: message, url })
      setShareStatus('Your light is on its way.')
    } else await copyLink()
  }
  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `${message}\n\nA Diwali wish for ${recipient}, from ${sender}.\n${greetingUrl()}`,
    )
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
    setShareStatus('WhatsApp sharing opened in a new tab.')
  }
  const downloadGreeting = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 800
    const context = canvas.getContext('2d')
    if (!context) return
    const gradient = context.createLinearGradient(0, 0, 1200, 800)
    gradient.addColorStop(0, design === 'minimal' ? '#11152B' : '#3A1424')
    gradient.addColorStop(1, design === 'saffron' ? '#9B3D14' : '#100914')
    context.fillStyle = gradient
    context.fillRect(0, 0, 1200, 800)
    context.strokeStyle = '#DDAA42'
    context.lineWidth = 3
    context.strokeRect(42, 42, 1116, 716)
    context.fillStyle = '#FFC857'
    context.textAlign = 'center'
    context.font = '60px Georgia'
    context.fillText('शुभ दीपावली', 600, 180)
    context.fillStyle = '#F4EBDD'
    context.font = '32px Georgia'
    context.fillText(`Dear ${recipient}`, 600, 280)
    context.font = 'italic 34px Georgia'
    const words = message.split(' ')
    let line = ''
    let y = 380
    words.forEach((word) => {
      const next = `${line}${word} `
      if (context.measureText(next).width > 920) {
        context.fillText(line, 600, y)
        line = `${word} `
        y += 54
      } else line = next
    })
    context.fillText(line, 600, y)
    context.fillStyle = '#D6BD8B'
    context.font = '26px Georgia'
    context.fillText(`— ${sender}`, 600, y + 100)
    const link = document.createElement('a')
    link.download = 'diwali-wish.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
    setShareStatus('Your greeting image has been downloaded.')
  }

  return (
    <main className="experience-page">
      <PageIntro
        kicker="Share the glow"
        title="Make a wish."
        text="Craft a personal greeting and preserve it in our private festival archive."
      />
      <section className="greeting-grid mt-14">
        <form
          className="control-panel greeting-form"
          action={(formData) => startTransition(() => action(formData))}
        >
          <div>
            <label className="control-label" htmlFor="recipient">
              For
            </label>
            <input
              id="recipient"
              name="recipient"
              maxLength={80}
              onChange={(e) => setRecipient(e.target.value)}
              value={recipient}
            />
            {state.fieldErrors?.recipient && <small>{state.fieldErrors.recipient}</small>}
          </div>
          <div>
            <label className="control-label" htmlFor="sender">
              From
            </label>
            <input
              id="sender"
              name="sender"
              maxLength={80}
              onChange={(e) => setSender(e.target.value)}
              value={sender}
            />
            {state.fieldErrors?.sender && <small>{state.fieldErrors.sender}</small>}
          </div>
          <div>
            <label className="control-label" htmlFor="message">
              Your wish
            </label>
            <textarea
              id="message"
              name="message"
              maxLength={500}
              rows={5}
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            {state.fieldErrors?.message && <small>{state.fieldErrors.message}</small>}
          </div>
          <div>
            <p className="control-label">Mood</p>
            <div className="segment-control">
              {['warm', 'joyful', 'traditional'].map((item) => (
                <button
                  className={tone === item ? 'active' : ''}
                  key={item}
                  onClick={() => setTone(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
            <input name="tone" type="hidden" value={tone} />
          </div>
          <div>
            <p className="control-label">Card design</p>
            <div className="option-grid">
              {['royal', 'floral', 'minimal', 'saffron'].map((item) => (
                <button
                  className={design === item ? 'active' : ''}
                  key={item}
                  onClick={() => setDesign(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button className="button-primary w-full justify-center" disabled={pending} type="submit">
            {pending ? 'Saving your light…' : 'Save this wish'} <SparkIcon />
          </button>
          {state.message && (
            <p className={`form-status ${state.ok ? 'success' : ''}`} role="status">
              {state.message}
            </p>
          )}
          <div className="greeting-actions">
            <button type="button" onClick={downloadGreeting}>
              Download PNG
            </button>
            <button type="button" onClick={shareWhatsApp}>
              WhatsApp
            </button>
            <button type="button" onClick={copyLink}>
              Copy link
            </button>
          </div>
          <button
            className="button-ghost w-full justify-center"
            type="button"
            onClick={shareGreeting}
          >
            Open device share sheet
          </button>
          {shareStatus && (
            <p className="form-status success" role="status">
              {shareStatus}
            </p>
          )}
        </form>
        <div className={`greeting-card tone-${tone} design-${design}`}>
          <div className="greeting-corner corner-one" />
          <div className="greeting-corner corner-two" />
          <div className="mini-diya">
            <div className="flame">
              <span />
            </div>
            <div className="diya-bowl" />
          </div>
          <p className="greeting-sanskrit">शुभ दीपावली</p>
          <p className="mt-8 text-xs uppercase tracking-[.28em] text-[#D9B26A]">
            Dear {recipient || 'someone special'}
          </p>
          <blockquote>{message || 'May light find you wherever you are.'}</blockquote>
          <p className="mt-10 font-display text-xl italic text-[#E2C99E]">
            — {sender || 'with love'}
          </p>
          <div className="greeting-footer">
            <span>DIWALI 3D</span>
            <span>Festival of lights</span>
          </div>
        </div>
      </section>
    </main>
  )
}

function NextJourney({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-16 text-center">
      <Link className="next-journey" href={href}>
        {label} <ArrowIcon />
      </Link>
    </div>
  )
}
