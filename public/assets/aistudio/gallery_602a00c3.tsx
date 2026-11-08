'use client'

import Image from 'next/image'
import { useState } from 'react'

const photos = [
  {
    title: 'A tray of little lights',
    category: 'Diyas',
    credit: 'Udayaditya Barua',
    src: 'https://images.unsplash.com/photo-1577083753695-e010191bacb5?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Rangoli in bloom',
    category: 'Rangoli',
    credit: 'Jyoti Singh',
    src: 'https://images.unsplash.com/photo-1605302977140-6572a4421aef?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Temple after dusk',
    category: 'Temples',
    credit: 'Dinesh Dixit',
    src: 'https://images.unsplash.com/photo-1741358706805-a5935a200a5c?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'A sky in celebration',
    category: 'Fireworks',
    credit: 'Anirudh',
    src: 'https://images.unsplash.com/photo-1699854227507-4b9ff940652a?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'The careful hand',
    category: 'Rangoli',
    credit: 'Ashutosh Diwan',
    src: 'https://images.unsplash.com/photo-1700993714468-408700d3599e?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Warmth in every flame',
    category: 'Diyas',
    credit: 'Umesh Soni',
    src: 'https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'The city illuminated',
    category: 'Festivities',
    credit: 'Aaditya Hirachan',
    src: 'https://images.unsplash.com/photo-1637648652899-efff280b1f9b?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Sparklers at night',
    category: 'Festivities',
    credit: 'Picnu',
    src: 'https://images.unsplash.com/photo-1700601589928-8937ebf649fa?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Together for the festival',
    category: 'Family',
    credit: 'kabita Darlami',
    src: 'https://images.unsplash.com/photo-1605367334994-40c8555337e1?auto=format&fit=crop&w=1400&q=85',
  },
]

const categories = ['All', 'Diyas', 'Rangoli', 'Temples', 'Fireworks', 'Festivities', 'Family']

export function GalleryExperience() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<(typeof photos)[number] | null>(null)
  const visible = filter === 'All' ? photos : photos.filter((photo) => photo.category === filter)

  return (
    <>
      <div className="gallery-filters" role="group" aria-label="Filter gallery">
        {categories.map((category) => (
          <button
            className={filter === category ? 'active' : ''}
            key={category}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {visible.map((photo, index) => (
          <button
            className={`gallery-item gallery-item-${index % 4}`}
            key={photo.src}
            onClick={() => setSelected(photo)}
          >
            <Image alt={photo.title} fill sizes="(max-width: 768px) 100vw, 33vw" src={photo.src} />
            <span>
              <small>{photo.category}</small>
              <b>{photo.title}</b>
              <em>Photo by {photo.credit}</em>
            </span>
          </button>
        ))}
      </div>
      {selected && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={() => setSelected(null)}
        >
          <button aria-label="Close image">Close</button>
          <div className="relative h-[72vh] w-[min(1100px,90vw)]">
            <Image
              alt={selected.title}
              fill
              sizes="90vw"
              src={selected.src}
              className="object-contain"
            />
          </div>
          <p>
            {selected.title} · Photo by {selected.credit} on Unsplash
          </p>
        </div>
      )}
    </>
  )
}
