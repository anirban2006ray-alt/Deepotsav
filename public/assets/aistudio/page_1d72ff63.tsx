import type { Metadata } from 'next'
import { RavanaDahan } from '../ui/experiences'

export const metadata: Metadata = {
  title: 'Ravana Dahan | DIWALI 3D',
  description: 'A symbolic interactive celebration of the victory of good over evil.',
}

export default function RavanaDahanPage() {
  return <RavanaDahan />
}
