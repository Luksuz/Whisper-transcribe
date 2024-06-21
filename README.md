# Whisper Transcribe App

## Overview

Welcome to the Whisper Transcribe app repository! This project allows users to input audio along with a specified purpose, transcribes the audio using the ChatGPT Whisper model, and generates a tailored paragraph using GPT-3.5 based on the given purpose. This app provides a convenient way for users to create structured paragraphs using their own voice.

## Features

- **Audio Input**: Users can record or upload audio files directly through the app.
- **Purpose Input**: Users can specify the purpose of the paragraph they want to generate.
- **Transcription**: The app uses the ChatGPT Whisper model to transcribe the audio into text.
- **Paragraph Generation**: The transcribed text is sent to the GPT-3.5 chatbot, which generates a structured paragraph tailored to the specified purpose.
- **User-Friendly Interface**: Simple and intuitive interface for ease of use.

## Getting Started

To run the Whisper Transcribe app locally, follow these steps:

1. **Clone the repository**:


2. **install dependencies**:
	• Open 2 terminal sessions

in 1st
```bash
cd whisper-client
npm i
npm start
```

in 2nd
```bash
cd whisper-server
pip install -r requirements.txt
python main.py
```

3.	Open the app:
	•	Open your web browser and navigate to http://localhost:3000 to view the app.


Technologies Used

	•	Frontend: React.js
	•	Backend: Flask
	•	Transcription: OpenAI Whisper model
	•	Paragraph Generation: GPT-3.5 chatbot
	•	Database: MongoDB (for storing user inputs and generated paragraphs)

Contributing

Contributions to enhance or fix issues in the Whisper Transcribe app are welcome. If you have suggestions, improvements, or bug fixes, please feel free to submit a pull request or raise an issue.
