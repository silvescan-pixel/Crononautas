// High fidelity Web Audio API Synthesizer and SFX Engine
class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private arpTimer: NodeJS.Timeout | null = null;
  private isMusicPlaying = false;
  private currentStyle: 'ambient' | 'boss' = 'ambient';

  // C Minor Pentatonic Scale Frequencies for sci-fi ambient arpeggio
  private scaleAmbient = [130.81, 155.56, 174.61, 196.00, 233.08, 261.63, 311.13, 349.23, 392.00, 466.16, 523.25];
  // Darker, high-tension, diminished/dissonant scale for the villain / boss / corrupt map
  private scaleBoss = [110.00, 116.54, 130.81, 138.59, 146.83, 164.81, 196.00, 207.65, 220.00, 261.63, 277.18];

  private init() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        this.ctx = new AudioContextClass();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        
        // Lowpass filter for analog warmth
        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
        
        this.masterGain.connect(this.filter);
        this.filter.connect(this.ctx.destination);
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn("Audio Context initialization failed or is not supported in this browser:", e);
      this.ctx = null;
    }
  }

  // Play a beautiful "pluck" sound utilizing basic FM synthesis / envelope shaping
  public playPluck(freq: number, pan = 0, volume = 0.12) {
    try {
      this.init();
      if (!this.ctx || !this.filter) return;

      const t = this.ctx.currentTime;
      
      // Primary oscillator: buzzing sawtooth for boss battle, triangle for peaceful ambient
      const osc1 = this.ctx.createOscillator();
      osc1.type = this.currentStyle === 'boss' ? 'sawtooth' : 'triangle';
      osc1.frequency.setValueAtTime(freq, t);

      // Sub oscillator for depth
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 0.5, t);

      const pluckGain = this.ctx.createGain();
      pluckGain.gain.setValueAtTime(0, t);
      // Instant attack, logarithmic decay
      pluckGain.gain.linearRampToValueAtTime(volume, t + 0.01);
      pluckGain.gain.exponentialRampToValueAtTime(0.001, t + (this.currentStyle === 'boss' ? 0.6 : 1.2));

      // Check if StereoPanner is supported
      if (this.ctx.createStereoPanner) {
        try {
          const panner = this.ctx.createStereoPanner();
          panner.pan.setValueAtTime(pan, t);

          osc1.connect(pluckGain);
          osc2.connect(pluckGain);
          pluckGain.connect(panner);
          panner.connect(this.filter);
        } catch (panErr) {
          osc1.connect(pluckGain);
          osc2.connect(pluckGain);
          pluckGain.connect(this.filter);
        }
      } else {
        osc1.connect(pluckGain);
        osc2.connect(pluckGain);
        pluckGain.connect(this.filter);
      }

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + (this.currentStyle === 'boss' ? 0.8 : 1.5));
      osc2.stop(t + (this.currentStyle === 'boss' ? 0.8 : 1.5));
    } catch (e) {
      console.warn("playPluck failed:", e);
    }
  }

  public playMusic(style: 'ambient' | 'boss') {
    try {
      if (this.currentStyle === style && this.isMusicPlaying) return;
      this.stopBackgroundMusic();
      this.currentStyle = style;
      this.startBackgroundMusic();
    } catch (e) {
      console.warn("playMusic failed:", e);
    }
  }

  public startBackgroundMusic() {
    try {
      this.init();
      if (this.isMusicPlaying || !this.ctx || !this.filter) return;
      this.isMusicPlaying = true;

      const t = this.ctx.currentTime;

      // 1. Cozy Low drone (C2 or lower for boss + slow filter LFO)
      this.droneOsc = this.ctx.createOscillator();
      this.droneOsc.type = 'sawtooth';
      const droneFreq = this.currentStyle === 'boss' ? 48.99 : 65.41; // G1 or C2
      this.droneOsc.frequency.setValueAtTime(droneFreq, t);

      // Filter sweep for low drone
      const droneFilter = this.ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(this.currentStyle === 'boss' ? 100 : 150, t);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(this.currentStyle === 'boss' ? 0.09 : 0.06, t);

      this.droneOsc.connect(droneFilter);
      droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.filter);
      this.droneOsc.start(t);

      // Filter sweep animation (LFO simulation)
      const sweep = () => {
        try {
          if (!this.isMusicPlaying || !this.ctx) return;
          const baseFreq = this.currentStyle === 'boss' ? 100 : 150;
          const swing = this.currentStyle === 'boss' ? 40 : 60;
          const speedMultiplier = this.currentStyle === 'boss' ? 0.8 : 0.3;
          const freq = baseFreq + Math.sin(this.ctx.currentTime * speedMultiplier) * swing;
          droneFilter.frequency.setValueAtTime(freq, this.ctx.currentTime);
          setTimeout(sweep, 100);
        } catch (e) {}
      };
      sweep();

      // 2. Space ambient or frantic boss arpeggiator loop
      const playArpStep = () => {
        try {
          if (!this.isMusicPlaying) return;
          const activeScale = this.currentStyle === 'boss' ? this.scaleBoss : this.scaleAmbient;
          const note = activeScale[Math.floor(Math.random() * activeScale.length)];
          const randomPan = Math.random() * 1.6 - 0.8;
          // High octaves occasionally
          const octave = Math.random() > 0.85 ? 2 : (Math.random() > 0.5 ? 1 : 0.5);
          
          const pluckVolume = this.currentStyle === 'boss' ? 0.09 : 0.08;
          this.playPluck(note * octave, randomPan, pluckVolume);

          // Boss has faster tempo for high anxiety!
          const delayTimes = this.currentStyle === 'boss' ? [140, 280, 420] : [300, 600, 900];
          const nextDelay = delayTimes[Math.floor(Math.random() * delayTimes.length)];
          this.arpTimer = setTimeout(playArpStep, nextDelay);
        } catch (e) {}
      };

      playArpStep();
    } catch (e) {
      console.warn("startBackgroundMusic failed:", e);
    }
  }

  public stopBackgroundMusic() {
    try {
      this.isMusicPlaying = false;
      if (this.arpTimer) {
        clearTimeout(this.arpTimer);
        this.arpTimer = null;
      }
      if (this.droneOsc) {
        try {
          this.droneOsc.stop();
          this.droneOsc.disconnect();
        } catch (e) {}
        this.droneOsc = null;
      }
      if (this.droneGain) {
        try {
          this.droneGain.disconnect();
        } catch (e) {}
        this.droneGain = null;
      }
    } catch (e) {
      console.warn("stopBackgroundMusic failed:", e);
    }
  }

  public toggleMusic() {
    try {
      if (this.isMusicPlaying) {
        this.stopBackgroundMusic();
        return false;
      } else {
        this.startBackgroundMusic();
        return true;
      }
    } catch (e) {
      console.warn("toggleMusic failed:", e);
      return false;
    }
  }

  public isPlaying() {
    return this.isMusicPlaying;
  }

  public playSFX(type: 'click' | 'success' | 'error' | 'glitch' | 'level_complete') {
    try {
      this.init();
      if (!this.ctx || !this.filter) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const sfxGain = this.ctx.createGain();
      
      osc.connect(sfxGain);
      sfxGain.connect(this.filter);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, t);
        sfxGain.gain.setValueAtTime(0, t);
        sfxGain.gain.linearRampToValueAtTime(0.08, t + 0.005);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.1);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, t); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, t + 0.15); // C6 sweep
        sfxGain.gain.setValueAtTime(0, t);
        sfxGain.gain.linearRampToValueAtTime(0.12, t + 0.01);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t);
        osc.stop(t + 0.4);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.2); // downward pitch slide
        sfxGain.gain.setValueAtTime(0, t);
        sfxGain.gain.linearRampToValueAtTime(0.15, t + 0.01);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.45);
      } else if (type === 'glitch') {
        // Glitching computer effect
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.setValueAtTime(300, t + 0.05);
        osc.frequency.setValueAtTime(80, t + 0.1);
        osc.frequency.setValueAtTime(600, t + 0.15);
        sfxGain.gain.setValueAtTime(0, t);
        sfxGain.gain.linearRampToValueAtTime(0.2, t + 0.01);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.4);
      } else if (type === 'level_complete') {
        // Celestial major arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          try {
            const noteOsc = this.ctx!.createOscillator();
            const noteGain = this.ctx!.createGain();
            noteOsc.type = 'sine';
            noteOsc.frequency.setValueAtTime(freq, t + idx * 0.08);
            noteGain.gain.setValueAtTime(0, t + idx * 0.08);
            noteGain.gain.linearRampToValueAtTime(0.08, t + idx * 0.08 + 0.01);
            noteGain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.8);
            
            noteOsc.connect(noteGain);
            noteGain.connect(this.filter!);
            noteOsc.start(t + idx * 0.08);
            noteOsc.stop(t + idx * 0.08 + 0.9);
          } catch (noteErr) {}
        });
      }
    } catch (e) {
      console.warn("playSFX failed:", e);
    }
  }
}

export const audioEngine = new AudioEngine();
export default audioEngine;
