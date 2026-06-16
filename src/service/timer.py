import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        self.end = None
        self.duration = None
        return self

    def __exit__(self, exc_type, exc, tb):
        self.end = time.perf_counter()
        self.duration = self.end - self.start
        return False