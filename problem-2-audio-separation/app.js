// app.js
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusText = document.getElementById("status");

const micAudio = document.getElementById("micPlayback");
const sysAudio = document.getElementById("sysPlayback");

let micStream, sysStream;
let micRecorder, sysRecorder;
let micChunks = [],
  sysChunks = [];

startBtn.onclick = async () => {
  try {
    statusText.textContent = "Requesting permissions...";

    // Get mic audio
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Get system audio via screen share (Chrome only)
    sysStream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });

    statusText.textContent = "Recording...";

    // Set up recorders
    micRecorder = new MediaRecorder(micStream);
    sysRecorder = new MediaRecorder(sysStream);

    micRecorder.ondataavailable = (e) => micChunks.push(e.data);
    sysRecorder.ondataavailable = (e) => sysChunks.push(e.data);

    micRecorder.start();
    sysRecorder.start();

    startBtn.disabled = true;
    stopBtn.disabled = false;
  } catch (err) {
    console.error(err);
    statusText.textContent = "Error: " + err.message;
  }
};

stopBtn.onclick = () => {
  micRecorder.stop();
  sysRecorder.stop();

  micRecorder.onstop = () => {
    const micBlob = new Blob(micChunks, { type: "audio/webm" });
    micAudio.src = URL.createObjectURL(micBlob);
    micChunks = [];
  };

  sysRecorder.onstop = () => {
    const sysBlob = new Blob(sysChunks, { type: "audio/webm" });
    sysAudio.src = URL.createObjectURL(sysBlob);
    sysChunks = [];
  };

  statusText.textContent = "Recording stopped. Playback ready.";
  startBtn.disabled = false;
  stopBtn.disabled = true;
};
