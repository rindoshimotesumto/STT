from typing import Optional
from abc import ABC, abstractmethod

from src.domain.entities.transcribe import Transribe
from src.domain.value_objs.transcribe import TranscribeCreate, GetAllTranscribe

class TranscribeRepo(ABC):
    @abstractmethod
    def get_by_id(self, transcribe_id: int) -> Transribe:
        pass

    @abstractmethod
    def get_all(self, limit: Optional[int] = 4) -> list[GetAllTranscribe]:
        pass

    @abstractmethod
    def add(self, data: TranscribeCreate) -> Transribe:
        pass