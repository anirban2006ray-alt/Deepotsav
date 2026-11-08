import type { Metadata } from 'next'
import { RamayanaStory } from '../ui/experiences'

export const metadata: Metadata = {
  title: 'The Ramayana Story | DIWALI 3D',
  description: 'A cinematic, chapter-based journey through the timeless epic.',
}

export default function RamayanaPage() {
  return <RamayanaStory />
}
