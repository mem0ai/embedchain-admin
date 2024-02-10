from fastapi import APIRouter, Query, responses
from fastapi.responses import StreamingResponse

from utils.embedchain import send_message

router = APIRouter()


@router.get("/api/v1/chat")
async def handle_chat(query: str, session_id: str = Query(None), number_documents: int = 3, citations: bool = True, stream: bool = True, model: str = "gpt-3.5-turbo-1106"):
    """
    Handles a chat request to the Embedchain app.
    Accepts 'query' and 'session_id' as query parameters.
    """
    generator = send_message(query, session_id, number_documents, citations, stream, model)
    return StreamingResponse(generator)


@router.get("/")
async def root():
    return responses.RedirectResponse(url="/docs")
