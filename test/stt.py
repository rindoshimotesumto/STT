import asyncio

from pathlib import Path
from src.service.stt import STT
from src.service.logs import get_logger
from src.service.timer import Timer

file = Path(__file__)
logger = get_logger(f"./test/logs/{file.stem}.log")
stt_obj = STT()

async def main():
    audio_path = file.resolve().parent / "audio" / "audio_2026-06-13_17-38-37.ogg"

    with Timer() as timer:
        result = await stt_obj.start(str(audio_path))

    logger.info(result + f"[{timer.duration:.2f} sec]")


if __name__ == "__main__":
    asyncio.run(
        main()
    )