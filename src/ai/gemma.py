from ollama import AsyncClient

class Gemma:
    def __init__(self):
        self.client = AsyncClient()
        self.gemma4_e4b = "gemma4:e4b"
        self.rules = (
            ...
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