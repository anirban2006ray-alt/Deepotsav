import type { Metadata } from 'next'
import { DiyaStudio } from '../ui/experiences'

export const metadata: Metadata = {
  title: 'Light a Diya | DIWALI 3D',
  description: 'Create a glowing, personalized diya arrangement.',
}

export default function DiyaPage() {
  return <DiyaStudio />
}
