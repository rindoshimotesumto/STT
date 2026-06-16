from ollama import AsyncClient

class Gemma:
    def __init__(self):
        self.client = AsyncClient()
        self.gemma4_e4b = "gemma4:e4b"
        self.rules = (
            "Sen o‘zbek tili muharririsan."
            "Foydalanuvchi yuborgan matnni o‘zbek lotin yozuvida grammatik, imloviy va mazmuniy jihatdan to‘g‘rila."
            "Asosiy ma’noni saqla. Yangi ma’lumot qo‘shma."
            "Faqat tuzatilgan matnni qaytar. Izoh yozma."
            "Kirill yozuvidan foydalanma."
        )

    async def message(self, msg: str) -> str:
        response = await self.client.chat(
            model=self.gemma4_e4b,
            messages=[
                {
                    "role": "system",
                    "content": self.rules
                },
                {
                    "role": "user",
                    "content": msg
                }
            ],
            options={
                "num_ctx": 8192,
                "temperature": 0.3
            },
            think=False
        )

        return response.message.content