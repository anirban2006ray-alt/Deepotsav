import type { Metadata } from 'next'
import { GreetingMaker } from '../ui/experiences'

export const metadata: Metadata = {
  title: 'Create a Diwali Wish | DIWALI 3D',
  description: 'Create and save a personal Festival of Lights greeting.',
}

export default function GreetingPage() {
  return <GreetingMaker />
}
