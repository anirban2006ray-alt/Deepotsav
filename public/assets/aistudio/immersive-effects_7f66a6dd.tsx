'use client'

import { useEffect, useRef, useState } from 'react'
import { SparkIcon, SoundIcon } from './icons'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  hue: number
}

export function FestivalEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    let width = window.innerWidth
    let height = window.innerHeight
    let frameId = 0
    const particles: Particle[] = []

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const burst = (x: number, y: number) => {
      const hue = Math.random() > 0.5 ? 42 : 340
      for (let index = 0; index < 54; index += 1) {
        const angle = (Math.PI * 2 * index) / 54
        const speed = 1.2 + Math.random() * 3.4
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          max: 48 + Math.random() * 28,
          hue,
        })
      }
    }

    const celebrate = () => {
      for (let index = 0; index < 5; index += 1) {
        window.setTimeout(
          () =>
            burst(width * (0.18 + Math.random() * 0.64), height * (0.12 + Math.random() * 0.35)),
          index * 180,
        )
      }
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      particles.forEach((particle) => {
        particle.life += 1
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.985
        particle.vy = particle.vy * 0.985 + 0.025
        const alpha = Math.max(0, 1 - particle.life / particle.max)
        context.beginPath()
        context.arc(particle.x, particle.y, 1.6, 0, Math.PI * 2)
        context.fillStyle = `hsla(${particle.hue}, 95%, 70%, ${alpha})`
        context.shadowBlur = 10
        context.shadowColor = `hsla(${particle.hue}, 100%, 60%, ${alpha})`
        context.fill()
      })
      context.shadowBlur = 0
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        if (particles[index].life >= particles[index].max) particles.splice(index, 1)
      }
      frameId = window.requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('diwali:celebrate', celebrate)
    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('diwali:celebrate', celebrate)
    }
  }, [])

  return <canvas className="festival-canvas" ref={canvasRef} aria-hidden="true" />
}

export function AmbientSoundButton() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<{ context: AudioContext; timer: number } | null>(null)

  const stop = () => {
    if (!audioRef.current) return
    window.clearInterval(audioRef.current.timer)
    void audioRef.current.context.close()
    audioRef.current = null
    setPlaying(false)
  }

  const toggle = () => {
    if (audioRef.current) return stop()
    const AudioContextClass = window.AudioContext
    const context = new AudioContextClass()
    const master = context.createGain()
    master.gain.value = 0.055
    master.connect(context.destination)
    const notes = [261.63, 329.63, 392, 523.25, 440, 349.23]
    let note = 0
    const play = () => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = notes[note % notes.length]
      gain.gain.setValueAtTime(0.0001, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.11, context.currentTime + 0.08)
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.1)
      oscillator.connect(gain).connect(master)
      oscillator.start()
      oscillator.stop(context.currentTime + 1.15)
      note += 1
    }
    play()
    const timer = window.setInterval(play, 680)
    audioRef.current = { context, timer }
    setPlaying(true)
  }

  useEffect(() => stop, [])

  return (
    <button
      className={`sound-button hidden sm:grid ${playing ? 'is-playing' : ''}`}
      type="button"
      aria-label={playing ? 'Pause ambient festive melody' : 'Play ambient festive melody'}
      aria-pressed={playing}
      onClick={toggle}
    >
      <SoundIcon />
    </button>
  )
}

export function IlluminateButton() {
  const [celebrated, setCelebrated] = useState(false)
  const illuminate = () => {
    window.dispatchEvent(new Event('diwali:celebrate'))
    setCelebrated(true)
    window.setTimeout(() => setCelebrated(false), 2600)
  }
  return (
    <button className="button-primary mt-9" type="button" onClick={illuminate}>
      {celebrated ? 'The world is glowing' : 'Illuminate the world'} <SparkIcon />
    </button>
  )
}
