import asyncio
from enum import Enum
from transformers import pipeline
from faster_whisper import WhisperModel
from pathlib import Path

from src.service.gpu import GPU
from src.service.logs import get_logger
from src.scripts.get_text_data import GetTextData, TextData

file = Path(__file__)
logger = get_logger(f"./logs/{file.stem}.log")

class AudioLang(str, Enum):
    uz = "uz"
    ru = "ru"

class STT:
    def __init__(self):
        is_have_gpus = self.check_device()
        logger.info(f"Device's: {is_have_gpus}")

        if is_have_gpus is None:
            self._fw_device = "cpu"
            self._hf_device = -1
            self._compute_type = "int8"
        else:
            self._fw_device = "cuda"
            self._hf_device = 0
            self._compute_type = "float16"

        self.uz_model_path = "./models/Uzbek-v2"
        self.uz_model_ct2_path = "./models/Uzbek-v2-CT2-CPU" if self._fw_device == "cpu" else "./models/Uzbek-v2-CT2-GPU"

        
        self.ru_model_path = "./models/Russian-v1"
        self.ru_model_ct2_path = "./models/Russian-v1-CT2-CPU" if self._fw_device == "cpu" else "./models/Russian-v1-CT2-GPU"

        # self.pipeline_uz = pipeline(
        #     task="automatic-speech-recognition",
        #     model=self.uz_model_path,
        #     device=self._hf_device,
        # )

        # self.pipeline_ru = pipeline(
        #     task="automatic-speech-recognition",
        #     model=self.ru_model_path,
        #     device=self._hf_device
        # )

        self.ct2_uz = WhisperModel(
            self.uz_model_ct2_path,
            device=self._fw_device,
            compute_type=self._compute_type
        )

        self.ct2_ru = WhisperModel(
            self.ru_model_ct2_path,
            device=self._fw_device,
            compute_type=self._compute_type
        )

    def check_device(self) -> list[str] | None:
        gpus = GPU().get_devices()

        if gpus is None:
            return None

        return [
            f"{gpu_id} | {gpu.name} | {gpu.memory}GB"
            for gpu_id, gpu in gpus.items()
        ]

    async def start(self, audio_path: str, audio_lang: AudioLang = AudioLang.uz, faster: bool = True) -> GetTextData:
        if faster:
            return await self.ct2(audio_path, audio_lang)

        _pipeline = self.pipeline_uz if audio_lang == AudioLang.uz else self.pipeline_ru
        _model = self.uz_model_path if audio_lang == AudioLang.uz else self.ru_model_path

        result = await asyncio.to_thread(_pipeline, audio_path)
        # result = _pipeline(audio_path)
        
        return TextData(
           result=result["text"],
           lang=audio_lang,
           model=_model
        ).get()
    
    async def ct2(self, audio_path: str, audio_lang: AudioLang = AudioLang.uz) -> GetTextData:
        _ct2_model = self.ct2_uz
        
        if audio_lang == AudioLang.ru:
            _ct2_model = self.ct2_ru

        segments, info = _ct2_model.transcribe(
            audio_path,
            language=audio_lang.value,
            beam_size=1,
            vad_filter=True,
        )

        text = " ".join(segment.text for segment in segments).strip()

        return TextData(
            result=text,
            lang=audio_lang,
            model=self.uz_model_ct2_path if audio_lang == AudioLang.uz else self.ru_model_ct2_path 
        ).get()