import asyncio
from enum import Enum
from transformers import pipeline
from faster_whisper import WhisperModel
from pathlib import Path

from src.service.gpu import GPU
from src.service.timer import Timer
from src.service.logs import get_logger
from src.scripts.get_text_data import GetTextData, TextData

file = Path(__file__)
MODELS_DIR = file.resolve().parent.parent.parent / "models"
logger = get_logger(f"./logs/{file.stem}.log")

class AudioLang(str, Enum):
    uz = "uz"
    ru = "ru"

class STT:
    def __init__(self):
        is_have_gpus = self.check_device()

        if is_have_gpus is None:
            self._fw_device = "cpu"
            self._hf_device = -1
            self._compute_type = "int8"
        else:
            self._fw_device = "cuda"
            self._hf_device = 0
            self._compute_type = "float16"

        self.uz_model_name = "Uzbek-v2"
        self.ru_model_name = "Russian-v1"
        self.universal_model_name = "universal-model"

        self.uz_model_path = MODELS_DIR / "Uzbek-v2"
        self.ru_model_path = MODELS_DIR / "Russian-v1"
        self.universal_model_path = MODELS_DIR / "universal-model"
        
        if self._fw_device == "cpu":
            self.uz_model_ct2_path = MODELS_DIR / "Uzbek-v2-CT2-CPU"
            self.ru_model_ct2_path = MODELS_DIR / "universal-model-CT2-CPU"
            self.universal_model_ct2_path = MODELS_DIR / "universal-model-CT2-CPU"

        else:
            self.uz_model_ct2_path = MODELS_DIR / "Uzbek-v2-CT2-GPU"
            self.ru_model_ct2_path = MODELS_DIR / "universal-model-CT2-GPU"
            self.universal_model_ct2_path = MODELS_DIR / "universal-model-CT2-GPU"

        self.ct2_uz = WhisperModel(
            str(self.uz_model_ct2_path),
            device=self._fw_device,
            compute_type=self._compute_type,
            cpu_threads=4,
            num_workers=1
        )

        self.ct2_ru = WhisperModel(
            str(self.ru_model_ct2_path),
            device=self._fw_device,
            compute_type=self._compute_type,
            cpu_threads=4,
            num_workers=1
        )

    def check_device(self) -> list[str] | None:
        gpus = GPU().get_devices()

        if gpus is None:
            return None

        return [
            f"{gpu_id} | {gpu.name} | {gpu.memory}GB"
            for gpu_id, gpu in gpus.items()
        ]

    def start(self, audio_path: str, audio_lang: AudioLang = AudioLang.uz) -> GetTextData:
        return self._ct2_sync(audio_path, audio_lang)
    
    def _ct2_sync(self, audio_path: str, audio_lang: AudioLang = AudioLang.uz) -> GetTextData:
        _ct2_model = self.ct2_uz

        if audio_lang == AudioLang.ru:
            _ct2_model = self.ct2_ru

        with Timer() as stt_result:
            segments, info = _ct2_model.transcribe(
                audio_path,
                language=audio_lang.value,
                task="transcribe",
                beam_size=1,
                vad_filter=True,
                condition_on_previous_text=False
            )

            text = " ".join(segment.text for segment in segments).strip()

        logger.info(
            f"stt duration [{stt_result.duration:.2f} sec] "
            f"on [{self._fw_device}] "
            f"lang [{audio_lang}] "
            f"audio duration [{info.duration}]"
        )

        return TextData(
            result=text,
            lang=audio_lang,
            model=self.uz_model_name if audio_lang == AudioLang.uz else self.ru_model_name
        ).get()