from typing import Optional, Any
from pathlib import Path

class Transribe:
    def __init__(
        self,
        audio_path: str | Path,
        transcribe: str,
        is_true: bool,
        processing_time: float
    ) -> None:
        
        self.audio_path = self.check_audio_path(audio_path)
        self.transcribe = self.check_transcribe_type(transcribe)
        self.is_true = self.check_is_true(is_true)
        self.processing_time = processing_time

    @staticmethod
    def check_audio_path(audio_path: Optional[str | Path]) -> Path:
        if not isinstance(audio_path, (str, Path)):
            raise TypeError()
        
        _audio_path_obj = Path(audio_path)

        if not _audio_path_obj.is_file():
            raise ValueError()
        
        return _audio_path_obj

    @staticmethod
    def check_transcribe_type(transcribe: Optional[str | Any]) -> str:
        if not isinstance(transcribe, str):
            raise TypeError()
        
        return transcribe
    
    @staticmethod
    def check_is_true(is_true: Optional[bool]) -> bool:
        if not isinstance(is_true, bool):
            raise TypeError()
        
        return is_true
    
    @staticmethod
    def check_processing_time(processing_time: Optional[float]) -> float:
        if not isinstance(processing_time, float):
            raise TypeError()

        return processing_time