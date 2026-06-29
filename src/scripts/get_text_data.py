from dataclasses import dataclass

@dataclass
class GetTextData:
    lang: str
    model: str
    words_count: int
    result: str

class TextData:
    def __init__(self, lang: str, result: str, model: str) -> GetTextData:
        self._lang: str = lang
        self._model_name: str = model
        self._result: str = result
        self._words_count: int = len(self._result.split(" "))

    def get(self) -> GetTextData:    
        return GetTextData(
            lang=self._lang,
            model=self._model_name,
            words_count=self._words_count,
            result=self._result
        )