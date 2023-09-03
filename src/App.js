import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Dropdown, Form } from "react-bootstrap";

const App = () => {
  const audioChunks = useRef([]);
  const mediaRecorder = useRef(null);
  const audioRef = useRef(null);
  const [purpose, setPurpose] = useState("");
  const [gptText, setGptText] = useState("");
  const [transcription, setTranscription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    setIsRecording(true);
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

  const handleSetPurpose = (event) => {
    setPurpose(event.target.value);
  };

  const handleRecordingStop = () => {
    setIsRecording(false);
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
    formData.append("purpose", purpose); 
    console.log(formData);

    const response = await fetch(
      "https://cloudfunctions-397608.ew.r.appspot.com/",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();
    setGptText(data.data);
    setTranscription(data.transcription);
    setIsGenerating(false);
  };

  return (
    <div className="container d-flex flex-column">
      <div className="row">
        <h1>Audio Capture Demo</h1>
      </div>
      <div className="row">
      <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Purpose input
      </Dropdown.Toggle>

      <Dropdown.Menu>
      <Form className="w-auto">
      <Form.Group className="mb-3">
        <Form.Label>Transcription purpose</Form.Label>
        <Form.Control onChange={(e) => handleSetPurpose(e)} value={purpose} placeholder="Enter transcription purpose..." />
        <Form.Text className="text-muted word-wrap">
          NOTE: 
          <br />
          if you enter a purpose that doesnt make sense, 
          <br /> 
          you might get unexpected results or an error.
        </Form.Text>
      </Form.Group>
      </Form>
      </Dropdown.Menu>
    </Dropdown>
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
      {isRecording && <p>Recording...</p>}
      <p>{transcription && transcription}</p>
      <br />
      <pre className="text-wrap">{isGenerating? "Transcribing...Please wait" : gptText}</pre>
    </div>
  );
};

export default App;
