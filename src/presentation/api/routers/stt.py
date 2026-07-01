from typing import Any
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form

from src.service.stt import STT
from src.service.timer import Timer
from src.service.logs import get_logger
from src.scripts.nums_normalizer import UzbekNumberNormalizer, RussianNumberNormalizer
from src.service.stt import AudioLang

router = APIRouter(
    prefix="/api",
    tags=["API"]
)

file = Path(__file__)
stt = STT()
uzbek_number_normalizer = UzbekNumberNormalizer()
russian_number_normalizer = RussianNumberNormalizer()

logger = get_logger(f"./logs/{file.stem}.log")
STORAGE_PATH = file.resolve().parent.parent.parent.parent.parent / "storage" / "audio"

@router.post("/stt")
def transcribe(audio: UploadFile = File(...), lang: AudioLang = Form(AudioLang.uz), display_name: str = "") -> dict[str, Any]:
    # save audio
    audio_tmp_path = f"{STORAGE_PATH / audio.filename}"

    with Timer() as save_audio:
        with open(audio_tmp_path, "wb") as f:
            f.write(audio.file.read())

    logger.info(f"Audio save duration: [{save_audio.duration:.2f} sec]")
    #

    # stt
    result = stt.start(audio_tmp_path, AudioLang(lang))
    #
    
    # normalizer
    normilizer = uzbek_number_normalizer if lang == AudioLang.uz else russian_number_normalizer
    
    with Timer() as normalize_timer:
        normalize_result = normilizer.normalize(result.result)

    logger.info(f"Normalize duration: [{normalize_timer.duration:.2f} sec]")
    #
    
    return {
        "original": result,
        "normalize": normalize_result
    }