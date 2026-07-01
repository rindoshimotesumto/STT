import torch

class GPUinfo:
    def __init__(
        self,
        gpu_id: int,
        name: str,
        memory: int
    ):
        self.gpu_id = gpu_id
        self.name = name
        self.memory = memory

class GPU:
    def __init__(self):
        pass

    def get_devices(self) -> dict[int, GPUinfo] | bool | None:
        if not torch.cuda.is_available():
            return None
        
        gpus = {}

        device_count = torch.cuda.device_count()
        if device_count > 0:
            for i in range(device_count):
                gpu = torch.cuda.get_device_properties(i)

                gpus[f"cuda:{i}"] = GPUinfo(
                    gpu_id=i,
                    name=gpu.name,
                    memory=self._to_gb(gpu.total_memory)
                )
        
        else:
            return None

        return gpus if gpus != {} else None
    
    def _to_gb(self, value_on_bytes: int) -> int:
        if not isinstance(value_on_bytes, int):
            raise ValueError("error: value not in int")
        
        if value_on_bytes == 0:
            raise ValueError("error: value == 0")

        return round(value_on_bytes/1024**3, 2)