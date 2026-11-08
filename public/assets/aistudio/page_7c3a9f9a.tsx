import type { Metadata } from 'next'
import { GalleryExperience } from '../ui/gallery'

export const metadata: Metadata = {
  title: 'Festival Gallery | DIWALI 3D',
  description: 'A visual journey through diyas, rangoli, temples and festive nights.',
}

export default function GalleryPage() {
  return (
    <main className="experience-page">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow mb-6 justify-center">
          <span /> A festival of beautiful moments
        </p>
        <h1 className="section-title text-[clamp(3.4rem,8vw,7.5rem)]">Light, held in memory.</h1>
        <p className="mx-auto mt-6 max-w-2xl leading-7 text-[#A99C89]">
          Explore the craft, architecture and shared joy that make every celebration distinct.
        </p>
      </div>
      <GalleryExperience />
    </main>
  )
}
