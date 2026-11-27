// Pure Web Audio API tactile sound synthesizer (no external audio files required)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playLighterAndPuffSound(isExtreme = false) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Crisp metallic flint spark click
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  clickOsc.type = 'triangle';
  clickOsc.frequency.setValueAtTime(1800, now);
  clickOsc.frequency.exponentialRampToValueAtTime(280, now + 0.045);
  clickGain.gain.setValueAtTime(0.18, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  clickOsc.connect(clickGain);
  clickGain.connect(ctx.destination);
  clickOsc.start(now);
  clickOsc.stop(now + 0.055);

  // 2. Soft warm inhale / tobacco crackle (filtered noise)
  const duration = isExtreme ? 1.15 : 0.75;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const crackle = Math.random() > 0.992 ? (Math.random() * 2 - 1) * 0.9 : 0;
    output[i] = (Math.random() * 2 - 1) * 0.28 + crackle;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(isExtreme ? 420 : 650, now + 0.06);
  filter.frequency.exponentialRampToValueAtTime(isExtreme ? 120 : 280, now + duration);
  filter.Q.value = 1.6;

  const puffGain = ctx.createGain();
  puffGain.gain.setValueAtTime(0.001, now + 0.05);
  puffGain.gain.linearRampToValueAtTime(isExtreme ? 0.25 : 0.14, now + 0.2);
  puffGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  whiteNoise.connect(filter);
  filter.connect(puffGain);
  puffGain.connect(ctx.destination);
  whiteNoise.start(now + 0.05);
  whiteNoise.stop(now + duration);

  // 3. Dramatic deep cosmic sub-chord for Monon Extreme Bidi
  if (isExtreme) {
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(92, now + 0.1);
    subOsc.frequency.exponentialRampToValueAtTime(36, now + 1.1);
    subGain.gain.setValueAtTime(0.14, now + 0.1);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now + 0.1);
    subOsc.stop(now + 1.2);
  }
}

export function playWheelTickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(720, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.03);
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.04);
}
