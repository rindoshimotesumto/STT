from dataclasses import dataclass
from src.domain.entities.transcribe import Transcribe

@dataclass
class TranscribeCreate:
    audio_path: str
    transcribe: str
    is_true: bool


@dataclass
class GetAllTranscribe:
    transcribe_id: int
    transcribe: Transcribe