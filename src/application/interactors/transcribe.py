from typing import Optional

from src.domain.entities.transcribe import Transribe
from src.domain.repositories.transcribe import TranscribeRepo
from src.domain.value_objs.transcribe import TranscribeCreate, GetAllTranscribe

class TranscribeUseCases:
    def __init__(self, repo: TranscribeRepo) -> None:
        self.repo = repo
        
    def get_by_id(self, transcribe_id: int) -> Transribe:
        return self.repo.get_by_id(transcribe_id)
    
    def get_all(self, limit: Optional[int] = 4) -> list[GetAllTranscribe]:
        return self.repo.get_all(limit)
    
    def add(self, data: TranscribeCreate) -> Transribe:
        return self.repo.add(data)