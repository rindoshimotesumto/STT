from typing import Optional, Any
from pathlib import Path

class Transcribe:
    def __init__(
        self,
        audio_path: Path,
        transcript: str,
        processing_time: float,
        success: bool,
        response_received: bool
    ) -> None:
        
        self.audio_path = self.check_audio_path(audio_path)
        self.transcribe = self.check_transcript_type(transcript)
        self.processing_time = self.check_processing_time(processing_time)
        self.success = self.check_succes(success)
        self.response_received = self.check_response_received(response_received)

    @staticmethod
    def check_audio_path(audio_path: Optional[str | Path]) -> Path:
        if not isinstance(audio_path, (str, Path)):
            raise TypeError()
        
        _audio_path_obj = Path(audio_path)

        if not _audio_path_obj.is_file():
            raise ValueError()
        
        return _audio_path_obj

    @staticmethod
    def check_transcript_type(transcript: Optional[str | Any]) -> str:
        if not isinstance(transcript, str):
            raise TypeError()
        
        return transcript
    
    @staticmethod
    def check_processing_time(processing_time: Optional[float | int]) -> float:
        if not isinstance(processing_time, (float, int)):
            raise TypeError()
        
        return float(processing_time)
    
    @staticmethod
    def check_succes(success: Optional[bool]) -> bool:
        if not isinstance(success, bool):
            raise TypeError()
        
        return success
    
    @staticmethod
    def check_response_received(response_received: Optional[bool]) -> bool:
        if not isinstance(response_received, bool):
            raise TypeError()
        
        return response_received