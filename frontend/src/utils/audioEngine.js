/**
 * Procedural audio for ArcanaVerse.
 *
 * Everything here is synthesised with the Web Audio API — there are no audio
 * files to ship, download or decode. The ambient bed is a slow, detuned pad
 * over a fixed chord set with sparse random bell notes on top; the effects are
 * short one-shot voices built from the same primitives.
 *
 * Browsers refuse to start an AudioContext outside a user gesture, so nothing
 * is created until `unlock()` is called from a real interaction. Every public
 * method is a no-op before that, which also makes the module safe to import in
 * jsdom, where AudioContext does not exist.
 */

// The pad walks these chords, one every CHORD_SECONDS. A minor triad plus its
// relative shades: mystical without drifting into a tune the ear starts
// following, which would compete with the reading text.
const CHORDS = [
  [110.0, 130.81, 164.81, 246.94], // Am add9
  [98.0, 146.83, 174.61, 220.0], // G/D-ish
  [87.31, 130.81, 164.81, 196.0], // Fmaj7
  [82.41, 123.47, 164.81, 246.94], // Em add9
];

const CHORD_SECONDS = 12;
const CHORD_FADE = 4; // crossfade between chords, in seconds

// Bell notes sprinkled over the pad (A minor pentatonic, two octaves up)
const BELL_NOTES = [440.0, 523.25, 587.33, 659.25, 783.99, 880.0];
const BELL_MIN_GAP = 4000;
const BELL_MAX_GAP = 11000;

const MUSIC_LEVEL = 0.16; // ceiling for the pad bus, before user volume
const SFX_LEVEL = 0.5; // ceiling for the effects bus

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.musicBus = null;
    this.sfxBus = null;
    this.noiseBuffer = null;

    this.padVoices = [];
    this.chordTimer = null;
    this.bellTimer = null;
    this.chordIndex = 0;

    this.musicEnabled = false;
    this.sfxEnabled = true;
    this.volume = 1;
  }

  get isReady() {
    return this.ctx !== null;
  }

  /**
   * Create (or resume) the AudioContext. Must run inside a user gesture.
   * Returns false when Web Audio is unavailable, e.g. under jsdom.
   */
  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return true;
    }

    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return false;

    try {
      this.ctx = new Ctor();
    } catch {
      return false;
    }

    this.musicBus = this.ctx.createGain();
    this.musicBus.gain.value = 0;
    this.musicBus.connect(this.ctx.destination);

    this.sfxBus = this.ctx.createGain();
    this.sfxBus.gain.value = this.sfxEnabled ? SFX_LEVEL * this.volume : 0;
    this.sfxBus.connect(this.ctx.destination);

    this.noiseBuffer = this._makeNoiseBuffer();

    if (this.musicEnabled) this.startMusic();
    return true;
  }

  setVolume(volume) {
    this.volume = volume;
    this._applyLevels();
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (!this.ctx) return;
    if (enabled) this.startMusic();
    else this.stopMusic();
  }

  setSfxEnabled(enabled) {
    this.sfxEnabled = enabled;
    this._applyLevels();
  }

  _applyLevels() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const music =
      this.musicEnabled && this.padVoices.length
        ? MUSIC_LEVEL * this.volume
        : 0;
    this.musicBus.gain.cancelScheduledValues(now);
    this.musicBus.gain.setTargetAtTime(music, now, 0.3);
    this.sfxBus.gain.setTargetAtTime(
      this.sfxEnabled ? SFX_LEVEL * this.volume : 0,
      now,
      0.05,
    );
  }

  // ---------------------------------------------------------------- ambient

  startMusic() {
    if (!this.ctx || this.padVoices.length) return;

    this.chordIndex = 0;
    this._playChord(CHORDS[0]);
    this._applyLevels();

    this.chordTimer = setInterval(() => {
      this.chordIndex = (this.chordIndex + 1) % CHORDS.length;
      this._playChord(CHORDS[this.chordIndex]);
    }, CHORD_SECONDS * 1000);

    this._scheduleBell();
  }

  stopMusic() {
    clearInterval(this.chordTimer);
    clearTimeout(this.bellTimer);
    this.chordTimer = null;
    this.bellTimer = null;

    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.musicBus.gain.cancelScheduledValues(now);
    this.musicBus.gain.setTargetAtTime(0, now, 0.5);

    const voices = this.padVoices;
    this.padVoices = [];
    // Let the fade above finish before tearing the oscillators down
    setTimeout(() => voices.forEach((stop) => stop()), 2500);
  }

  /**
   * Fade the current chord out while the next one fades in, so the bed never
   * has a seam. Each note is two oscillators detuned against each other, which
   * is what gives the pad its slow beating shimmer.
   */
  _playChord(frequencies) {
    const { ctx } = this;
    const now = ctx.currentTime;

    this.padVoices.forEach((stop) => stop(CHORD_FADE));
    this.padVoices = [];

    frequencies.forEach((freq, i) => {
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(
        0.9 / frequencies.length,
        now + CHORD_FADE,
      );

      // Rolls the harsh upper partials off the sawtooths
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 700;
      filter.Q.value = 0.6;
      filter.connect(gain);
      gain.connect(this.musicBus);

      // A very slow wobble on the cutoff keeps the pad from sounding static
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.05 + i * 0.013;
      lfoGain.gain.value = 220;
      lfo.connect(lfoGain).connect(filter.frequency);
      lfo.start(now);

      const oscillators = [0, 1].map((n) => {
        const osc = ctx.createOscillator();
        osc.type = n === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.value = freq;
        osc.detune.value = n === 0 ? -6 : 7;
        osc.connect(filter);
        osc.start(now);
        return osc;
      });

      this.padVoices.push((fade = 0.5) => {
        const t = ctx.currentTime;
        gain.gain.cancelScheduledValues(t);
        gain.gain.setValueAtTime(gain.gain.value, t);
        gain.gain.linearRampToValueAtTime(0.0001, t + fade);
        oscillators.forEach((osc) => osc.stop(t + fade + 0.1));
        lfo.stop(t + fade + 0.1);
      });
    });
  }

  _scheduleBell() {
    const gap = BELL_MIN_GAP + Math.random() * (BELL_MAX_GAP - BELL_MIN_GAP);
    this.bellTimer = setTimeout(() => {
      if (!this.musicEnabled || !this.padVoices.length) return;
      const note = BELL_NOTES[Math.floor(Math.random() * BELL_NOTES.length)];
      this._bell(note, 0.05, this.musicBus, 3.5);
      this._scheduleBell();
    }, gap);
  }

  // ------------------------------------------------------------------- SFX

  /** A struck bell: sine fundamental plus a quiet inharmonic partial. */
  _bell(freq, peak, destination, decay = 1.2, delay = 0) {
    const { ctx } = this;
    const start = ctx.currentTime + delay;

    [
      [freq, peak],
      [freq * 2.76, peak * 0.28],
    ].forEach(([f, p]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(p, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + decay);
      osc.connect(gain).connect(destination);
      osc.start(start);
      osc.stop(start + decay + 0.05);
    });
  }

  _makeNoiseBuffer() {
    const length = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  /**
   * A whoosh: filtered noise swept through a resonant band.
   *
   * The character is entirely in the envelope and the Q, not in the noise.
   * A fast attack reads as a hit or a rustle; a slow swell across a third of
   * the length reads as something moving past. A wide band is hiss, while a
   * narrow one (Q around 3) gives the band an audible pitch that the sweep
   * then bends — that bend is what the ear hears as motion and direction.
   *
   * `from` above `to` gives a descending whoosh, and vice versa.
   */
  _swoosh({
    duration = 0.35,
    from = 500,
    to = 4000,
    peak = 0.18,
    q = 1.1,
    attack = 0.25,
  } = {}) {
    const { ctx } = this;
    const now = ctx.currentTime;

    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    // A random grain per play, so repeated clicks are never the same sample
    const offset = Math.random() * 1.2;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = q;
    filter.frequency.setValueAtTime(from, now);
    filter.frequency.exponentialRampToValueAtTime(to, now + duration);

    // A second pass through the same moving band. Two poles instead of one
    // deepens the skirts either side of the peak, which is the difference
    // between "air moving" and "white noise with a filter on it".
    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.Q.value = q;
    filter2.frequency.setValueAtTime(from, now);
    filter2.frequency.exponentialRampToValueAtTime(to, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + duration * attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(filter).connect(filter2).connect(gain).connect(this.sfxBus);
    source.start(now, offset);
    source.stop(now + duration + 0.05);
  }

  /** Short pitched blip. */
  _blip({ from, to, peak = 0.1, duration = 0.14, type = 'triangle' } = {}) {
    const { ctx } = this;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(to, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(this.sfxBus);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  /**
   * Play a named effect. Unknown names are ignored rather than throwing, so a
   * typo at a call site can never take a page down.
   */
  play(name) {
    if (!this.ctx || !this.sfxEnabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    switch (name) {
      case 'hover':
        this._blip({ from: 700, to: 800, peak: 0.5, duration: 0.09 });
        break;
      // One whoosh, two directions. Nothing percussive in either: the card is
      // heard travelling, not landing. Picking sweeps up as it lifts out of
      // the fan, un-picking sweeps back down, and the return is slightly
      // longer and quieter so it reads as the gentler of the two.
      case 'select':
        this._swoosh({
          duration: 0.34,
          from: 420,
          to: 1700,
          peak: 5,
          q: 3,
          attack: 0.35,
        });
        break;
      case 'deselect':
        this._swoosh({
          duration: 0.4,
          from: 1000,
          to: 380,
          peak: 3,
          q: 3,
          attack: 0.3,
        });
        break;
      case 'flip':
        this._swoosh({
          duration: 0.45,
          from: 350,
          to: 2200,
          peak: 0.5,
          q: 2.2,
        });
        break;
      case 'reveal':
        // Ascending arpeggio, one bell per card
        [523.25, 659.25, 783.99].forEach((freq, i) =>
          this._bell(freq, 0.13, this.sfxBus, 2.4, i * 0.16),
        );
        break;
      case 'confirm':
        this._blip({ from: 330, to: 660, peak: 0.11, duration: 0.18 });
        this._bell(880, 0.12, this.sfxBus, 1.4, 0.1);
        break;
      case 'click':
        this._blip({ from: 620, to: 780, peak: 0.07, duration: 0.08 });
        break;
      case 'error':
        this._blip({
          from: 220,
          to: 150,
          peak: 0.12,
          duration: 0.3,
          type: 'sawtooth',
        });
        break;
      default:
        break;
    }
  }

  /** Release every audio resource. Used by tests and hot reload. */
  dispose() {
    this.stopMusic();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

const audioEngine = new AudioEngine();

export default audioEngine;
