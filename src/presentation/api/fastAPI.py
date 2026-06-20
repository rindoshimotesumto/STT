from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from src.presentation.api.routers.stt import router as STT_ROUTER

file = Path(__file__)
web_dir = file.resolve().parent.parent / "web" / "home"
assets_dir = web_dir / "assets"

app = FastAPI(
    title="STT API",
    version="1.0.0"
)

app.mount(
    "/static",
    StaticFiles(directory=str(assets_dir)),
    name="static"
)
templates = Jinja2Templates(directory=str(web_dir))

app.include_router(STT_ROUTER)

@app.get("/")
async def get_event(request: Request) :
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )