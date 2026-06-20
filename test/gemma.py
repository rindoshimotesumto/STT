import asyncio
from src.ai.gemma import Gemma

gemma = Gemma()
async def main():
    print(await gemma.message("sakson ikki"))
    
if __name__ == "__main__":
    asyncio.run(main())