// Note data for Gender Wayang (low to high)
const notes = [
  { key: "1", name: "F3", freq: 174.61 },
  { key: "2", name: "G#3", freq: 207.65 },
  { key: "3", name: "A#3", freq: 233.08 },
  { key: "4", name: "C4", freq: 261.63 },
  { key: "5", name: "D#4", freq: 311.13 },
  { key: "6", name: "F4", freq: 349.23 },
  { key: "7", name: "G#4", freq: 415.30 },
  { key: "8", name: "A#4", freq: 466.16 },
  { key: "9", name: "C5", freq: 523.25 },
  { key: "0", name: "D#5", freq: 622.25 }
];

// Initialize AudioContext
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Enable sound on first user interaction (required on mobile)
document.body.addEventListener('click', () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
});

// Play a note with the given frequency and waveform
function playNote(freq, waveform) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = waveform;
  osc.frequency.value = freq;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.0);

  osc.start();
  osc.stop(audioCtx.currentTime + 1.0);
}

// Populate buttons
const waveformSelect = document.getElementById("waveform");
const container = document.getElementById("buttons");

notes.forEach(note => {
  const btn = document.createElement("button");
  btn.textContent = note.name;
  btn.dataset.key = note.key;
  btn.onclick = () => {
    const waveform = waveformSelect.value;
    playNote(note.freq, waveform);
  };
  container.appendChild(btn);
});

// Keyboard support (keys 1–0)
document.addEventListener('keydown', (e) => {
  const key = e.key;
  const note = notes.find(n => n.key === key);
  if (note) {
    const waveform = waveformSelect.value;
    playNote(note.freq, waveform);

    const btn = document.querySelector(`button[data-key="${key}"]`);
    if (btn) {
      btn.style.transform = "scale(0.96)";
      setTimeout(() => btn.style.transform = "scale(1)", 150);
    }
  }
});

// Prevent double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);
