import asyncio
from src.service.stt import STT
from src.service.timer import Timer
from src.scripts.nums_normalizer import UzbekNumberNormalizer, RussianNumberNormalizer

_stt = STT()
uz_normalizer = UzbekNumberNormalizer()
ru_normilizer = RussianNumberNormalizer()

async def run_uz():
    with Timer() as uz_res_time: 
        uz = await _stt.start("./test/audio/uz.wav")
    
    return f"({uz.lang}) [{uz.model}] -> {uz.result} [{uz_res_time.duration:.2f}]"
    
async def run_ru():
    with Timer() as ru_res_time:
        ru = await _stt.start("./test/audio/ru.mp3", "ru")
    
    return f"({ru.lang}) [{ru.model}] -> {ru.result} [{ru_res_time.duration:.2f}]"

async def main():
    print(await run_ru())
    # print(await run_uz())

if __name__ == "__main__":
    asyncio.run(
        main()
    )