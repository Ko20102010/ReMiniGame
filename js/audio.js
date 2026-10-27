export class AudioManager {
  constructor() { this.context = null; this.combo = 0; }
  async unlock() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!this.context) this.context = new Ctx();
    if (this.context.state === 'suspended') await this.context.resume();
  }
  tone(frequency, duration = 0.1, type = 'sine', volume = 0.035) {
    const c = this.context; if (!c || c.state !== 'running') return;
    const osc = c.createOscillator(), gain = c.createGain();
    osc.type = type; osc.frequency.setValueAtTime(frequency, c.currentTime);
    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
    osc.connect(gain).connect(c.destination); osc.start(); osc.stop(c.currentTime + duration);
  }
  mana() { const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51]; this.tone(notes[this.combo++ % notes.length], 0.11); }
  food() { this.tone(220, 0.12, 'triangle', 0.04); }
  slash() { this.tone(680, 0.07, 'sawtooth', 0.025); }
  unlockFanfare() { [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => setTimeout(() => this.tone(n, 0.28, 'triangle', 0.04), i * 80)); }
}
