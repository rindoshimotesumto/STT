import logging

def get_logger(filename: str = "app.log"):
    logging.basicConfig(
        level=logging.INFO,
        filename=filename,
        filemode="a",
        format="%(name)s | %(asctime)s | %(levelname)s | %(message)s",
        force=True
    )

    return logging.getLogger(__name__)