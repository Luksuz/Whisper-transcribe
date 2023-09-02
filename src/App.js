import React, { useRef, useState } from 'react';

const App = () => {
  const audioChunks = useRef([]);
  const mediaRecorder = useRef(null);
  const audioRef = useRef(null);
  const [transcription, setTranscription] = useState("");

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.start();
      mediaRecorder.current.onstop = handleRecordingStop;
    } catch (error) {
      console.error('Error starting the recording:', error);
    }
  };

  const handleRecordingStop = () => {
    const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    audioRef.current.src = url;
    audioChunks.current = [];
    console.log(typeof blob)
    console.log(blob)
    transcribe(blob);
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
  };

  const transcribe = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'audio.wav');
    console.log(formData)

    const response = await fetch("https://cloudfunctions-397608.ew.r.appspot.com/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setTranscription(data.data);
  };

  return (
    <div className="App">
      <h1>Audio Capture Demo</h1>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <audio ref={audioRef} controls></audio>
      <p>{transcription}</p>
    </div>
  );
};

export default App;
