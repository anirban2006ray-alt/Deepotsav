import Link from 'next/link'
import { ArrowIcon, DiyaIcon, FlowerIcon, SparkIcon, StoryIcon } from './ui/icons'
import { IlluminateButton } from './ui/immersive-effects'

const experiences = [
  {
    number: '01',
    title: 'Light a sacred diya',
    text: 'Shape the ambience with warmth, color and a living flame.',
    href: '/diya',
    icon: DiyaIcon,
    className: 'from-[#F05A24]/30 to-[#7B2109]/20',
  },
  {
    number: '04',
    title: 'Witness Vijayadashami',
    text: 'Enter a symbolic cinematic celebration of courage and light.',
    href: '/ravana-dahan',
    icon: SparkIcon,
    className: 'from-[#F05A24]/25 to-[#49120C]/20',
  },
  {
    number: '05',
    title: 'Share a little light',
    text: 'Create a personal festival card and send it to someone you love.',
    href: '/greeting',
    icon: DiyaIcon,
    className: 'from-[#DDAA42]/20 to-[#522A10]/20',
  },
  {
    number: '02',
    title: 'Create a rangoli',
    text: 'Compose a symmetrical artwork from petals, color and light.',
    href: '/rangoli',
    icon: FlowerIcon,
    className: 'from-[#D43D8A]/25 to-[#6B185E]/20',
  },
  {
    number: '03',
    title: 'Walk through the epic',
    text: 'Discover the Ramayana through a cinematic chapter journey.',
    href: '/ramayana',
    icon: StoryIcon,
    className: 'from-[#7F66E8]/25 to-[#2A195D]/20',
  },
]

export default function HomePage() {
  return (
    <main>
      <section className="hero-scene relative flex min-h-[92svh] items-center overflow-hidden px-5 pb-16 pt-28 md:px-10 lg:px-16">
        <div className="star-field" aria-hidden="true" />
        <div className="hero-aura" aria-hidden="true" />
        <div className="floating-petal petal-a" aria-hidden="true" />
        <div className="floating-petal petal-b" aria-hidden="true" />

        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-3xl">
            <p className="eyebrow mb-7">
              <span /> A digital celebration of Indian heritage
            </p>
            <h1 className="display-title text-[clamp(4.5rem,11vw,10rem)] leading-[.72] tracking-[-.065em]">
              Diwali
              <span className="block bg-gradient-to-r from-[#FFD76A] via-[#FF9A3C] to-[#F05A24] bg-clip-text text-transparent">
                in light.
              </span>
            </h1>
            <p className="mt-10 max-w-xl text-base leading-7 text-[#D8CBB8] md:text-lg">
              Step into a luminous world where ancient stories, sacred craft and playful technology
              come alive.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link className="button-primary" href="/diya">
                Begin the experience <ArrowIcon />
              </Link>
              <Link className="button-ghost" href="/ramayana">
                Discover the story
              </Link>
            </div>
          </div>

          <div className="hero-orbit mx-auto" aria-label="A glowing ceremonial diya">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="diya-visual diya-visual-large">
              <div className="flame">
                <span />
              </div>
              <div className="wick" />
              <div className="diya-bowl">
                <div className="diya-rim" />
              </div>
            </div>
            <div className="orbit-label label-one">Light</div>
            <div className="orbit-label label-two">Art</div>
            <div className="orbit-label label-three">Story</div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 text-[10px] uppercase tracking-[.28em] text-[#8E806D] md:flex">
          <span className="h-px w-10 bg-[#8E806D]/50" /> Scroll to explore
          <span className="h-px w-10 bg-[#8E806D]/50" />
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-24 md:px-10 lg:px-16 lg:py-36">
        <div className="mandala-watermark" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1440px]">
          <div className="mb-16 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow mb-5">
                <span /> Five immersive worlds
              </p>
              <h2 className="section-title max-w-2xl">Tradition, reimagined for the screen.</h2>
            </div>
            <p className="max-w-lg self-end text-base leading-7 text-[#9F927F] lg:justify-self-end">
              Every experience draws from a ritual, an art form or a story passed through
              generations—made interactive with a contemporary digital language.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            {experiences.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  className={`experience-card bg-gradient-to-br lg:col-span-2 ${item.number === '04' ? 'lg:col-start-2' : ''} ${item.className}`}
                  href={item.href}
                  key={item.title}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs tracking-[.22em] text-[#B9AA94]">{item.number}</span>
                    <span className="card-icon">
                      <Icon />
                    </span>
                  </div>
                  <div className="mt-28">
                    <h3 className="font-display text-3xl text-[#FFF7E9]">{item.title}</h3>
                    <p className="mt-4 max-w-xs text-sm leading-6 text-[#BDB09D]">{item.text}</p>
                    <span className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.15em] text-[#FFC65A]">
                      Enter experience <ArrowIcon />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-10 lg:px-16">
        <div className="victory-panel mx-auto max-w-[1440px]">
          <div className="victory-sun" aria-hidden="true">
            <SparkIcon />
          </div>
          <div className="relative z-10 max-w-2xl">
            <p className="eyebrow eyebrow-dark mb-5">
              <span /> The cinematic finale
            </p>
            <h2 className="font-display text-[clamp(3rem,7vw,6.5rem)] leading-[.86] tracking-[-.04em] text-[#301308]">
              Witness the victory of light.
            </h2>
            <p className="mt-7 max-w-lg leading-7 text-[#6E351C]">
              Take aim in a symbolic Ravana Dahan—an atmospheric celebration of courage, wisdom and
              good over evil.
            </p>
            <Link className="button-dark mt-9" href="/ravana-dahan">
              Enter the finale <ArrowIcon />
            </Link>
          </div>
          <div className="effigy-silhouette" aria-hidden="true">
            <span className="head head-left" />
            <span className="head head-center" />
            <span className="head head-right" />
            <span className="effigy-body" />
          </div>
        </div>
      </section>

      <section className="px-5 py-28 text-center md:px-10 lg:py-40">
        <p className="mx-auto mb-6 text-4xl text-[#F3A63A]">शुभ दीपावली</p>
        <h2 className="section-title mx-auto max-w-3xl">
          Send a little light to someone you love.
        </h2>
        <p className="mx-auto mt-6 max-w-xl leading-7 text-[#9F927F]">
          Create a personal wish, choose its mood, and save it to our digital wall of light.
        </p>
        <Link className="button-primary mt-9" href="/greeting">
          Create a greeting <ArrowIcon />
        </Link>
        <div>
          <IlluminateButton />
        </div>
      </section>
    </main>
  )
}
