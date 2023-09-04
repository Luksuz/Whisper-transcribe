import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
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
        body: formData,
      }
    );

    const data = await response.json();
    setGptText(data.data);
    setTranscription(data.transcription);
    setIsGenerating(false);
  };

  return (
    <div className="container d-flex flex-column ">
      <div className="row text-light">
        <h1>Audio Capture Demo</h1>
      </div>
      <div className="row">
        <Dropdown>
          <Dropdown.Toggle className="tertiary" id="dropdown-basic">
            Purpose input
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Form className="w-auto">
              <Form.Group className="mb-3">
                <Form.Label>Transcription purpose</Form.Label>
                <Form.Control
                  onChange={(e) => handleSetPurpose(e)}
                  value={purpose}
                  placeholder="Enter transcription purpose..."
                />
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
      <div className="row mb-2 justify-content-center">
        <audio ref={audioRef} controls className="w-75 shadow-lg"></audio>
      </div>
      <div className="row text-center justify-content-center align-items-center">
        <div className="col-5">
          <Button className="secondary" onClick={startRecording}>
            <img
              className="img-fluid"
              src={isRecording ? "./microphone-active.png" : "./microphone.png"}
              width="40px"
            />
          </Button>
        </div>
        <div className="col-5">
          <Button className="secondary" onClick={stopRecording}>
            <img className="img-fluid" src="./mute.png" width="40px" />
          </Button>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-2">
        <pre className="text-wrap bordered text-light">
          <p>{transcription && transcription}</p>
          <br />
          {isGenerating ? <img src="./transcribing.svg" /> : gptText}
        </pre>
      </div>
    </div>
  );
};

export default App;
