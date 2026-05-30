import sys
from vosk import Model, KaldiRecognizer

print("Python version:", sys.version)
print("Loading model...")
try:
    # This automatically downloads and caches the small Chinese model
    model = Model(lang="cn")
    print("Vosk model loaded successfully!")
    print("Model path:", model.path if hasattr(model, 'path') else 'cached')
except Exception as e:
    print("Failed to load/download Vosk model:", e)
