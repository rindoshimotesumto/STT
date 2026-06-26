from typing import Any
from pathlib import Path
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form

from src.service.stt import STT
from src.service.timer import Timer
from src.service.logs import get_logger
from src.scripts.nums_normalizer import UzbekNumberNormalizer
from src.service.stt import AudioLang

router = APIRouter(
    prefix="/api",
    tags=["API"]
)

file = Path(__file__)
stt = STT()
uzbek_number_normalizer = UzbekNumberNormalizer()

logger = get_logger(f"./logs/{file.stem}.log")
STORAGE_PATH = file.resolve().parent.parent.parent.parent.parent / "storage" / "audio"

@router.post("/stt")
async def transcribe(audio: UploadFile = File(...), lang: AudioLang = Form(AudioLang.uz)) -> dict[str, Any]:
    # save audio
    current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    ext = Path(audio.filename).suffix
    audio_tmp_path = f"{STORAGE_PATH / f'audio_{current_time}{ext}'}"

    with Timer() as save_audio:
        with open(audio_tmp_path, "wb") as f:
            f.write(await audio.read())

    logger.info(f"Audio save duration: [{save_audio.duration:.2f} sec]")
    #

    # stt
    with Timer() as stt_result:
        result = await stt.start(audio_tmp_path, lang)

    logger.info(f"STT duration: [{stt_result.duration:.2f} sec] on [device]")
    #

    # normalizer
    with Timer() as normalize_timer:
        normalize_result = uzbek_number_normalizer.normalize(result.result)

    logger.info(f"Normalize duration: [{normalize_timer.duration:.2f} sec]")
    #
    
    return {
        "original": result,
        "normalize": normalize_result
    }