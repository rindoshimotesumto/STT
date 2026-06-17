from pathlib import Path

from src.service.gpu import GPU
from src.service.logs import get_logger

file = Path(__file__)

gpu = GPU()
logger = get_logger(f"./test/logs/{file.stem}.log")

gpus = gpu.get_devices()
[logger.info(f"{_gpu_id} | {_gpu.name} | {_gpu.memory}GB") for _gpu_id, _gpu in gpus.items()]