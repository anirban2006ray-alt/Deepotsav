import type { Metadata } from 'next'
import { RangoliStudio } from '../ui/experiences'

export const metadata: Metadata = {
  title: 'Rangoli Studio | DIWALI 3D',
  description: 'Create an interactive rangoli with color, petals and symmetry.',
}

export default function RangoliPage() {
  return <RangoliStudio />
}
