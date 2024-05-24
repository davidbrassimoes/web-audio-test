const audioContext = new (window.AudioContext || window.webkitAudioContext)()
let oscillators = new Map()
let hasMidi = false

// Request MIDI access
if (navigator.requestMIDIAccess) {
  navigator
    .requestMIDIAccess({ sysex: false })
    .then(onMIDISuccess, onMIDIFailure)
} else {
  alert("No MIDI support in your browser.")
}

// MIDI handlers
function onMIDISuccess(midiAccess) {
  midiAccess.inputs.forEach((input) => (input.onmidimessage = onMIDIMessage))
  hasMidi = true
}
function onMIDIFailure() {
  alert("Could not access your MIDI devices.")
}
function onMIDIMessage(message) {
  let [status, note, velocity] = message.data
  let frequency = 440 * Math.pow(2, (note - 69) / 12) // MIDI note to frequency conversion

  if (status === 144) {
    // note on message
    playNote(frequency)
  } else if (status === 128) {
    // note off message
    stopNote(frequency)
  }
}

// Note handlers
function playNote(frequency, type = "sine") {
  let oscillator = audioContext.createOscillator()
  oscillator.frequency.value = frequency
  oscillator.connect(audioContext.destination)
  oscillator.start()
  oscillators.set(frequency, oscillator)
  console.log(frequency)
}
function stopNote(frequency) {
  let oscillator = oscillators.get(frequency)
  if (oscillator) {
    oscillator.stop()
    oscillator.disconnect()
    oscillators.delete(frequency)
    console.log("stop")
  }
}

// Keyboard handlers
window.addEventListener("keydown", (event) => {
  let frequency = calculateFrequency(event.key)
  if (!oscillators.has(frequency)) {
    // Check if an oscillator for this note is already playing
    playNote(frequency)
  }
})

window.addEventListener("keyup", (event) => {
  let frequency = calculateFrequency(event.key)
  stopNote(frequency)
})

// Calculate frequency for keyboard
function calculateFrequency(key) {
  let noteFrequencies = {
    a: 261.63, // C4
    w: 277.18, // C#4
    s: 293.66, // D4
    e: 311.13, // D#4
    d: 329.63, // E4
    f: 349.23, // F4
    t: 369.99, // F#4
    g: 392.0, // G4
    y: 415.3, // G#4
    h: 440.0, // A4
    u: 466.16, // A#4
    j: 493.88, // B4
    k: 523.25, // C5
    o: 554.37, // C#5
    l: 587.33, // D5
    p: 622.25, // D#5
    ";": 659.25, // E5
    "'": 698.46, // F5
    "]": 739.99, // F#5
    "\\": 783.99, // G5
    z: 830.61, // G#5
    x: 880.0, // A5
    c: 932.33, // A#5
    v: 987.77, // B5
    b: 1046.5, // C6
  }
  return noteFrequencies[key.toLowerCase()] || 0
}

// Panic button
document.getElementById("panic").addEventListener("click", () => {
  oscillators.forEach((oscillator) => {
    oscillator.stop()
    oscillator.disconnect()
  })
  oscillators.clear()
})
