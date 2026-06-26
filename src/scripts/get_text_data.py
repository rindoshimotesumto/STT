from dataclasses import dataclass

@dataclass
class GetTextData:
    result: str
    lang: str
    model: str
    words_count: int

class TextData:
    def __init__(self, lang: str, result: str, model: str) -> GetTextData:
        self._result: str = result
        self._lang: str = lang
        self._model_name: str = model.split("/")[-1]
        self._words_count: int = len(self._result.split(" "))

    def get(self) -> GetTextData:    
        return GetTextData(
            result=self._result,
            lang=self._lang,
            model=self._model_name,
            words_count=self._words_count
        )