let audioCtx, source, playBackRateControl, pitchShifter, buffer
let playing = false

document.getElementById("audioFile").addEventListener("change", function (e) {
  const file = e.target.files[0]
  const reader = new FileReader()

  reader.onload = function (ev) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    playBackRateControl = document.getElementById("playbackRate")

    audioCtx.decodeAudioData(ev.target.result, function (decodedBuffer) {
      buffer = decodedBuffer
    })
  }
  const fileName = e.target.files[0].name
  document.getElementById("fileName").textContent = fileName
  reader.readAsArrayBuffer(file)
})

document.getElementById("playbackRate").addEventListener("input", function (e) {
  if (source) {
    source.playbackRate.value = e.target.value
  }
  document.body.style.filter = `blur(${(1 - e.target.value) * 10}px)`
  document.getElementById("playbackRateValue").textContent = Math.round(
    (1 - e.target.value) * 100
  )
})

document.getElementById("playButton").addEventListener("click", function () {
  let playButton = this
  if (buffer && !playing) {
    source = audioCtx.createBufferSource()
    source.buffer = buffer
    pitchShifter = audioCtx.createBiquadFilter()
    pitchShifter.type = "allpass"
    source.connect(pitchShifter)
    pitchShifter.connect(audioCtx.destination)
    source.playbackRate.value = playBackRateControl.value
    source.start(0)
    playing = true
    playButton.textContent = "SCREWIN'"
    playButton.classList.remove("playButton")
    playButton.classList.add("zoomButton")
  } else if (playing) {
    source.stop()
    playing = false
    playButton.textContent = "SCREW IT"
    playButton.classList.remove("zoomButton")
    playButton.classList.add("playButton")
    document.body.style.filter = `blur(0)`
  }
})

document.getElementById("customButton").addEventListener("click", function () {
  document.getElementById("audioFile").click()
})
