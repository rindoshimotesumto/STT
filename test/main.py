import asyncio

from pathlib import Path

from src.service.stt import STT
from src.service.logs import get_logger
from src.service.timer import Timer
from src.ai.gemma import Gemma

stt = STT()
gemma = Gemma()
file = Path(__file__)
logger = get_logger(f"./test/logs/{file.stem}.log")

async def main():
    audio_path = file.resolve().parent / "audio" / "audio.mp3"

    with Timer() as stt_timer:
        result_stt = await stt.start(str(audio_path))

    logger.info(result_stt + f"[{stt_timer.duration:.2f}] sec")
    
    with Timer() as gemma_timer:
        result_gemma = await gemma.message(result_stt)

    logger.info(result_gemma + f"[{gemma_timer.duration:.2f}] sec")


if __name__ == "__main__":
    asyncio.run(
        main()
    )