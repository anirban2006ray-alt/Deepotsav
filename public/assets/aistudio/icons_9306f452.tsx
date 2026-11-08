type IconProps = { className?: string }

export function ArrowIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h13M14 7l5 5-5 5" />
    </svg>
  )
}
export function DiyaIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 3c2 2 2.8 3.6 2.8 5.1A2.8 2.8 0 0 1 12 11a2.8 2.8 0 0 1-2.8-2.9C9.2 6.6 10 5 12 3Z" />
      <path d="M4 13h16c-.7 5-3.3 7-8 7s-7.3-2-8-7Z" />
    </svg>
  )
}
export function FlowerIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 9.8C8.5 7.8 8 4 12 3c4 1 3.5 4.8 0 6.8ZM14.2 12c2-3.5 5.8-4 6.8 0-1 4-4.8 3.5-6.8 0ZM12 14.2c3.5 2 4 5.8 0 6.8-4-1-3.5-4.8 0-6.8ZM9.8 12c-2 3.5-5.8 4-6.8 0 1-4 4.8-3.5 6.8 0Z" />
    </svg>
  )
}
export function StoryIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 5.5c3-.8 5.7-.2 8 1.8v12c-2.3-2-5-2.6-8-1.8v-12ZM20 5.5c-3-.8-5.7-.2-8 1.8v12c2.3-2 5-2.6 8-1.8v-12Z" />
    </svg>
  )
}
export function SparkIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 2c.7 6.2 3.8 9.3 10 10-6.2.7-9.3 3.8-10 10-.7-6.2-3.8-9.3-10-10 6.2-.7 9.3-3.8 10-10Z" />
    </svg>
  )
}
export function MenuIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}
export function SoundIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 10v4h3l4 3V7l-4 3H5ZM16 9c1.4 1.8 1.4 4.2 0 6M19 6c3.4 3.5 3.4 8.5 0 12" />
    </svg>
  )
}
