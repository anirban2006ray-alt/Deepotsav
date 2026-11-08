// Procedural Web Audio API sound generator for DIWALI 3D
// Eliminates external audio assets and avoids 404 network errors

class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isAmbientPlaying: boolean = false;
  private ambientOscillators: OscillatorNode[] = [];

  private themeAudio: HTMLAudioElement | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx?.currentTime || 0);
    }
    if (this.themeAudio) {
      this.themeAudio.muted = this.isMuted;
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public async playThemeSong(): Promise<boolean> {
    if (this.isAmbientPlaying && this.themeAudio && !this.themeAudio.paused) {
      return true;
    }
    if (typeof window === 'undefined') return false;

    const audioCandidates = [
      '/assets/aistudio/whatsapp-theme-song.mpeg',
      '/assets/aistudio/whatsapp-theme-song_55fdd952.mpeg',
      '/whatsapp-theme-song.mpeg',
      '/assets/aistudio/audio_717f4967.m4a',
    ];

    let played = false;
    for (const src of audioCandidates) {
      try {
        if (!this.themeAudio) {
          this.themeAudio = new Audio(src);
          this.themeAudio.loop = true;
          this.themeAudio.volume = 0.5;
        } else {
          this.themeAudio.src = src;
        }
        this.themeAudio.muted = this.isMuted;
        await this.themeAudio.play();
        this.isAmbientPlaying = true;
        played = true;
        break;
      } catch (e) {
        // candidate failed, try next
      }
    }

    if (!played) {
      this.playAmbient();
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('diwali:music-state-changed', {
          detail: { isPlaying: this.isAmbientPlaying },
        })
      );
    }

    return this.isAmbientPlaying;
  }

  public async toggleAmbientMusic(): Promise<boolean> {
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    }
    return this.playThemeSong();
  }

  public isAmbientActive(): boolean {
    return this.isAmbientPlaying;
  }

  // Soothing Indian Classical ambient drone (Tanpura harmonic chords in D: Sa-Pa-Sa')
  public playAmbient() {
    this.initContext();
    if (!this.ctx) return;

    this.stopAmbient();

    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      // Root D (146.83 Hz), Fifth A (220 Hz), Octave D (293.66 Hz), Higher F# (369.99 Hz)
      const frequencies = [146.83, 220.00, 293.66, 369.99, 440.00];

      frequencies.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const filter = this.ctx!.createBiquadFilter();
        const lfo = this.ctx!.createOscillator();
        const lfoGain = this.ctx!.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        // Slow tremolo/chorus
        lfo.frequency.setValueAtTime(0.2 + idx * 0.08, this.ctx!.currentTime);
        lfoGain.gain.setValueAtTime(3.0, this.ctx!.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700 + idx * 100, this.ctx!.currentTime);

        osc.connect(filter);
        filter.connect(this.ambientGain!);
        osc.start();

        this.ambientOscillators.push(osc, lfo);
      });

      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  }

  public stopAmbient() {
    if (this.themeAudio) {
      this.themeAudio.pause();
      this.themeAudio.currentTime = 0;
    }
    this.ambientOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.ambientOscillators = [];
    this.isAmbientPlaying = false;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('diwali:music-state-changed', {
          detail: { isPlaying: false },
        })
      );
    }
  }

  // Authentic temple brass bell sound with rich harmonics and natural exponential decay
  public playTempleBell() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const baseFreq = 587.33; // D5
    const partials = [1, 2.02, 3.01, 4.15, 5.43];
    const gains = [0.4, 0.25, 0.15, 0.08, 0.04];

    partials.forEach((mult, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * mult, t);

      gain.gain.setValueAtTime(gains[i] * 0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.8 - i * 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 3.0);
    });
  }

  // Flame ignition soft whoosh and spark
  public playDiyaLight() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Breath / air warm whoosh
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, t);
    filter.frequency.exponentialRampToValueAtTime(800, t + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.5);

    // Complementary soft rising chime
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.25);
    oscGain.gain.setValueAtTime(0.08, t);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.55);
  }

  // Arrow release whoosh for Ravana Dahan
  public playArrowWhoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.6);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.65);
  }

  // Firework burst sound with low thump and high frequency crackles
  public playFirework() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Bass boom
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(160, t);
    boomOsc.frequency.exponentialRampToValueAtTime(40, t + 0.5);

    boomGain.gain.setValueAtTime(0.3, t);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    boomOsc.connect(boomGain);
    boomGain.connect(this.ctx.destination);
    boomOsc.start(t);
    boomOsc.stop(t + 0.75);

    // Crackle noise
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.85 ? 1 : 0.08);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1200, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, t);
    noiseGain.gain.linearRampToValueAtTime(0.18, t + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
    noise.stop(t + 0.85);
  }
}

export const sound = new SoundManager();
