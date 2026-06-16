STT Project Setup
This guide explains how to prepare and run the STT project.
1. Go to project folder
```bash
cd STT
```
2. Create virtual environment
Windows
```cmd
python -m venv venv
venv\Scripts\activate
```
Linux / macOS
```bash
python3 -m venv venv
source venv/bin/activate
```
3. Install dependencies
```bash
pip install -r requirements.txt
```
If you need CUDA support for PyTorch, install it separately:
```bash
pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu132
```

Official PyTorch guide:
```
https://pytorch.org/get-started/locally/
```

4. Download Whisper model
Download the Uzbek Whisper model:
```bash
hf download aisha-org/Whisper-Uzbek --local-dir ./models/
```

The model will be saved here:
```bash
./models/
```

5. Download Gemma model
Pull the Gemma model using Ollama:
```bash
ollama pull gemma4:e4b
```
Check downloaded Ollama models:
```bash
ollama list
```

6. Run tests
```bash
python -m test.main
```

7. Run API server
```bash
fastapi run ./src/presentation/api/fastAPI.py
```

After starting the server, open:
```
http://127.0.0.1:8000/
```
or
```
http://127.0.0.1:8000/docs
```

Notes
Make sure Ollama is installed and running before using the Gemma model.
If the API cannot find the Whisper model, check that the model exists in:
```
./models/
```