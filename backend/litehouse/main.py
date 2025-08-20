from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import sessions, upload, tables, schema, query

app = FastAPI(
    title="LiteHouse API",
    description="A lightweight SQL workbench for file-based data",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router, prefix="/api", tags=["sessions"])
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(tables.router, prefix="/api", tags=["tables"])
app.include_router(schema.router, prefix="/api", tags=["schema"])
app.include_router(query.router, prefix="/api", tags=["query"])


@app.get("/")
async def root():
    return {"message": "LiteHouse API", "version": "0.1.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}