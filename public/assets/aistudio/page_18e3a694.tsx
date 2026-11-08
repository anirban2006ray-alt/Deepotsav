import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowIcon, DiyaIcon, SparkIcon } from '../ui/icons'

export const metadata: Metadata = {
  title: 'About Diwali | DIWALI 3D',
  description: 'Discover the meaning, five days and regional traditions of Diwali.',
}

const days = [
  ['01', 'Dhanteras', 'Homes welcome prosperity and new beginnings.'],
  ['02', 'Naraka Chaturdashi', 'A day associated with renewal and the triumph of good.'],
  ['03', 'Lakshmi Puja', 'Families gather, light lamps and offer prayers for well-being.'],
  ['04', 'Govardhan Puja', 'Communities honor gratitude, nourishment and the natural world.'],
  ['05', 'Bhai Dooj', 'Siblings celebrate care, affection and lifelong bonds.'],
]

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="eyebrow mb-7">
          <span /> The light behind the celebration
        </p>
        <h1 className="section-title max-w-4xl text-[clamp(4rem,9vw,8rem)]">
          More than a festival. A feeling of coming home.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-[#B4A795]">
          Diwali is celebrated across faiths and regions in many distinct ways. At its heart are
          renewal, generosity, community and the enduring hope that light can guide us forward.
        </p>
      </section>
      <section className="about-values">
        <article>
          <DiyaIcon />
          <p>Light over darkness</p>
          <h2>Knowledge makes a path visible.</h2>
        </article>
        <article>
          <SparkIcon />
          <p>Good over evil</p>
          <h2>Courage turns values into action.</h2>
        </article>
        <article>
          <span className="about-symbol">कमल</span>
          <p>Renewal</p>
          <h2>Every ending can hold a beginning.</h2>
        </article>
      </section>
      <section className="five-days">
        <div>
          <p className="eyebrow mb-5">
            <span /> A constellation of customs
          </p>
          <h2 className="section-title">Five days, many meanings.</h2>
          <p className="mt-6 max-w-lg leading-7 text-[#988B79]">
            Dates, names and practices vary by community. This timeline offers one widely known
            sequence while honoring that no single tradition represents everyone.
          </p>
        </div>
        <ol>
          {days.map(([number, title, text]) => (
            <li key={title}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="regional-section">
        <p className="eyebrow mb-5">
          <span /> Across India and beyond
        </p>
        <h2 className="section-title max-w-3xl">Shared light, distinct traditions.</h2>
        <div className="regional-grid">
          <article>
            <span>North</span>
            <h3>Stories of homecoming</h3>
            <p>Many communities remember Rama and Sita’s return to Ayodhya with rows of lamps.</p>
          </article>
          <article>
            <span>South</span>
            <h3>Dawn rituals and renewal</h3>
            <p>
              Celebrations may begin early with oil baths, new clothes, sweets and family
              gatherings.
            </p>
          </article>
          <article>
            <span>East</span>
            <h3>Devotion in many forms</h3>
            <p>
              Some communities honor Goddess Kali, while lamps and artistic traditions illuminate
              the night.
            </p>
          </article>
          <article>
            <span>West</span>
            <h3>New chapters</h3>
            <p>
              Diwali often marks new financial beginnings, hospitality and the welcoming of
              prosperity.
            </p>
          </article>
        </div>
      </section>
      <section className="about-cta">
        <p>Let the light be kind.</p>
        <h2 className="section-title">Carry the meaning into the experience.</h2>
        <Link className="button-primary mt-8" href="/diya">
          Light a diya <ArrowIcon />
        </Link>
      </section>
    </main>
  )
}
