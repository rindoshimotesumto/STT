from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from src.presentation.api.routers.stt import router as STT_ROUTER

app = FastAPI(
    title="STT API",
    version="1.0.0"
)

app.mount(
    "/static",
    StaticFiles(directory="src/presentation/web/home/assets"),
    name="assets"
)
templates = Jinja2Templates(directory="src/presentation/web/home")

app.include_router(STT_ROUTER)

@app.get("/")
async def get_event(request: Request) :
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )