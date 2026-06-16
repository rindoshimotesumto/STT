import asyncio
from pathlib import Path

from src.ai.gemma import Gemma
from src.service.timer import Timer
from src.service.logs import get_logger

gemma = Gemma()
file = Path(__file__)
logger = get_logger(f"./test/logs/{file.stem}.log")

async def test_gemma() -> str:
    prompt = input("Enter prompt: ")

    with Timer() as timer:
        result = await gemma.message(prompt)

    return result + f" [{timer.duration:.2f} sec]"

if __name__ == "__main__":
    logger.info(
        asyncio.run(
            test_gemma()
        )
    ) 