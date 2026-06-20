from typing import Any
from pathlib import Path
from fastapi import APIRouter, UploadFile, File

from src.service.stt import STT
from src.service.nums_normalizer import UzbekNumberNormalizer
from src.service.logs import get_logger
from src.service.timer import Timer

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
async def transcribe(audio: UploadFile = File(...)) -> dict[str, Any]:
    audio_tmp_path = f"{STORAGE_PATH / audio.filename}"

    with Timer() as save_audio:
        with open(audio_tmp_path, "wb") as f:
            f.write(await audio.read())

    logger.info(f"Audio save duration: [{save_audio.duration:.2f} sec]")

    with Timer() as stt_result:
        result = await stt.start(audio_tmp_path)

    logger.info(f"STT duration: [{stt_result.duration:.2f} sec]")

    with Timer() as normalize_timer:
        normalize_result = uzbek_number_normalizer.normalize(result)

    logger.info(f"Normalize duration: [{normalize_timer.duration:.2f} sec]")

    return {
        "original": result,
        "normalize": normalize_result
    }