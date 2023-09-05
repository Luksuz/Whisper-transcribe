from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from whisperConfig import transcribe_audio, abstract_summary_extraction
import tempfile
from flask_cors import CORS
import os
from utils.DBUtils import insertAudio


# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["*"])

@app.route('/', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400

    file = request.files['file']
    purpose = request.form['purpose']
    print(purpose)

    if not purpose:
        purpose = "blog post"

    if file.filename == '':
        return 'No selected file', 400

    if file and (file.filename.endswith('.wav') or file.filename.endswith('.m4a') or file.filename.endswith('.mp3') or file.filename.endswith('.wav')):
        # Create a temporary directory
        temp_dir = tempfile.mkdtemp()

        # Save the file securely inside temporary directory
        filename = secure_filename(file.filename)
        filepath = os.path.join(temp_dir, filename)
        file.save(filepath)

        try:
            # Insert into MongoDB
            with open(filepath, "rb") as f:
                audio_data = f.read()
            insertAudio(audio_data, filename)
            
            # Your custom functions
            transcription = transcribe_audio(filepath)
            summary = abstract_summary_extraction(transcription, purpose)

            # Clean up
            os.remove(filepath)
            os.rmdir(temp_dir)

            return jsonify({"data": summary, "status": 200})

        except Exception as e:
            # Clean up in case of errors too
            os.remove(filepath)
            os.rmdir(temp_dir)

            return f"Error processing file: {e}", 500

    return 'Unsupported file type', 400



if __name__ == '__main__':
    app.run(debug=True)
