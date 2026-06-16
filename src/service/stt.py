from transformers import pipeline
from src.service.gpu import GPU

class STT:
    def __init__(self):
        self.model = "./models/Whisper-Uzbek"
        self.pipeline = pipeline(
            task="automatic-speech-recognition",
            model=self.model,
            device="cuda:0"
        )

    def check_device(self) -> list[str] | None:
        gpus = GPU().get_devices()

        if gpus is None:
            return None

        return [
            f"{gpu_id} | {gpu.name} | {gpu.memory}GB"
            for gpu_id, gpu in gpus.items() 
        ]

    async def start(self, audio_path: str) -> str:
        result = self.pipeline(audio_path)
        return result["text"]