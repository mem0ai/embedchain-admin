from fastapi import FastAPI
from dotenv import load_dotenv
from routes import api, admin

load_dotenv(".env")

app = FastAPI(title="Embedchain API")

app.include_router(api.router)
app.include_router(admin.router)
