import base64
from pymongo import MongoClient

try:
    client = MongoClient('mongodb+srv://admin:admin@lukacluster.cf5yzeq.mongodb.net/speechToText?retryWrites=true&w=majority')
    db = client['speechToText']
    collection = db['voiceAudios']
except Exception as e:
    print(f"Could not connect to database: {e}")

def insertAudio(audio_data, file_name):
    try:
        base64_audio = base64.b64encode(audio_data)

        document = {'file_name': file_name, 'audio_data': base64_audio}
        collection.insert_one(document)
        print(f"Inserted {file_name} into MongoDB.")
        
    except Exception as e:
        print(f"An error occurred: {e}")
