import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

const App = () => {
  const audioChunks = useRef([]);
  const mediaRecorder = useRef(null);
  const audioRef = useRef(null);
  const [transcription, setTranscription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.start();
      mediaRecorder.current.onstop = handleRecordingStop;
    } catch (error) {
      console.error("Error starting the recording:", error);
    }
  };

  const handleRecordingStop = () => {
    const blob = new Blob(audioChunks.current, { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    audioRef.current.src = url;
    audioChunks.current = [];
    console.log(typeof blob);
    console.log(blob);
    transcribe(blob);

  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
  };

  const transcribe = async (blob) => {
    setIsGenerating(true);
    const formData = new FormData();
    formData.append("file", blob, "audio.wav");
    console.log(formData);

    const response = await fetch(
      "https://cloudfunctions-397608.ew.r.appspot.com/",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    setTranscription(data.data);
    setIsGenerating(false);
  };

  return (
    <div className="container d-flex flex-column">
      <div className="row">
        <h1>Audio Capture Demo</h1>
      </div>
      <div className="row mb-2">
        <audio ref={audioRef} controls></audio>
      </div>
      <div className="row">
        <div className="col-5">
          <Button onClick={startRecording}>Start Recording</Button>
        </div>
        <div className="col-5">
            <Button onClick={stopRecording}>Stop Recording</Button>
          </div>
      </div>

      <p>{isGenerating? "Transcribing...Please wait" :transcription}</p>
    </div>
  );
};

export default App;
