// Create an AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)()

// Function to play a sine wave
function playSineWave() {
  // Create an OscillatorNode
  const oscillator = audioContext.createOscillator()

  // Create a GainNode for controlling the volume
  const gainNode = audioContext.createGain()

  // Set the frequency to 500 Hz
  oscillator.frequency.value = 500 * Math.random()

  // Connect the oscillator to the gain node
  oscillator.connect(gainNode)

  // Connect the gain node to the audio context destination
  gainNode.connect(audioContext.destination)

  // Set the attack and release values for the gain node
  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 1) // Increase attack time to 1 second
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2) // Increase release time to 2 seconds

  // Start the oscillator
  oscillator.start()

  // Stop the oscillator after 5 seconds
  setTimeout(() => {
    oscillator.stop()
  }, 5000)
}

// Add a keydown event listener to the document
document.addEventListener("keydown", playSineWave)
