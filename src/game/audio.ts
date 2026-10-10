/**
 * Web Audio Retro Synthesizer Engine
 * Generates 16-bit chiptune sound effects and dynamic background music
 * with zero external dependencies and 100% offline reliability.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private sfxEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private sfxVolume: number = 0.5;
  private musicVolume: number = 0.35;
  private currentTrack: string | null = null;
  private bgmInterval: number | null = null;
  private activeMusicNodes: AudioNode[] = [];

  constructor() {
    // AudioContext will be initialized on first user interaction
    const savedSfx = localStorage.getItem('aetheria_sfx');
    const savedBgm = localStorage.getItem('aetheria_bgm');
    if (savedSfx !== null) this.sfxEnabled = savedSfx === 'true';
    if (savedBgm !== null) this.musicEnabled = savedBgm === 'true';
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    localStorage.setItem('aetheria_sfx', String(enabled));
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    localStorage.setItem('aetheria_bgm', String(enabled));
    if (!enabled) {
      this.stopBGM();
    } else if (this.currentTrack) {
      this.playBGM(this.currentTrack);
    }
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  // --- Sound Effects ---

  public playJump() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);

    gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playDoubleJump() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [400, 600, 800].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, time + 0.08);

      gain.gain.setValueAtTime(this.sfxVolume * 0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.1);
    });
  }

  public playSlash() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // White noise swoosh with high-pass sweep
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  public playMagic() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.2);

    gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.21);
  }

  public playDash() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);

    gain.gain.setValueAtTime(this.sfxVolume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  public playCrystal() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [659.25, 987.77, 1318.51]; // E5, B5, E6
    freqs.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(this.sfxVolume * 0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  public playHeal() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(this.sfxVolume * 0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.32);
    });
  }

  public playHurt() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);

    gain.gain.setValueAtTime(this.sfxVolume * 0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.17);
  }

  public playEnemyHurt() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);

    gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playSpring() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);

    gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.27);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  public playUnlock() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(this.sfxVolume * 0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  public playCheckpoint() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [523.25, 783.99, 1046.5].forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.1;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(this.sfxVolume * 0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.42);
    });
  }

  public playBossHurt() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.3);

    gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.33);
  }

  public playVictory() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [
      { f: 523.25, t: 0.0, d: 0.15 },
      { f: 659.25, t: 0.15, d: 0.15 },
      { f: 783.99, t: 0.3, d: 0.15 },
      { f: 1046.5, t: 0.45, d: 0.5 },
      { f: 1318.5, t: 0.55, d: 0.6 },
    ];

    chords.forEach(({ f, t, d }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(this.sfxVolume * 0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + d + 0.05);
    });
  }

  public playGameOver() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [
      { f: 330, t: 0.0, d: 0.2 },
      { f: 311.13, t: 0.22, d: 0.2 },
      { f: 293.66, t: 0.44, d: 0.2 },
      { f: 261.63, t: 0.66, d: 0.5 },
    ];

    notes.forEach(({ f, t, d }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + t;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(this.sfxVolume * 0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + d + 0.05);
    });
  }

  // --- Retro Chiptune Background Sequencer ---

  public playBGM(track: 'forest' | 'cavern' | 'boss' | string = 'forest') {
    this.currentTrack = track;
    this.stopBGM();
    if (!this.musicEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    let step = 0;
    const tempo = track === 'boss' ? 140 : 110;
    const stepIntervalMs = (60 / tempo / 2) * 1000; // 8th note steps

    // Scales & chord progressions
    const forestMelody = [
      261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 329.63,
      220.00, 261.63, 329.63, 440.00, 329.63, 261.63, 220.00, 261.63,
      349.23, 440.00, 523.25, 698.46, 523.25, 440.00, 349.23, 440.00,
      392.00, 493.88, 587.33, 783.99, 587.33, 493.88, 392.00, 493.88,
    ];

    const cavernMelody = [
      220.00, 0, 261.63, 329.63, 0, 311.13, 293.66, 0,
      196.00, 0, 246.94, 293.66, 0, 329.63, 261.63, 0,
      174.61, 0, 220.00, 261.63, 0, 293.66, 220.00, 0,
      164.81, 0, 207.65, 246.94, 0, 293.66, 246.94, 0,
    ];

    const bossMelody = [
      110.00, 110.00, 220.00, 110.00, 130.81, 110.00, 146.83, 110.00,
      164.81, 110.00, 155.56, 110.00, 146.83, 110.00, 130.81, 110.00,
      220.00, 220.00, 329.63, 220.00, 261.63, 220.00, 293.66, 220.00,
      311.13, 220.00, 293.66, 220.00, 261.63, 220.00, 246.94, 220.00,
    ];

    const seq = track === 'boss' ? bossMelody : track === 'cavern' ? cavernMelody : forestMelody;

    this.bgmInterval = window.setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;
      const freq = seq[step % seq.length];
      step++;

      if (freq > 0) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm 16-bit square or triangle wave
        osc.type = track === 'boss' ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const dur = (stepIntervalMs / 1000) * 0.85;
        gain.gain.setValueAtTime(this.musicVolume * 0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + dur + 0.02);
      }
    }, stepIntervalMs);
  }

  public stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sound = new SoundController();
