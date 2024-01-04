from fastapi import responses, Query
from pydantic import BaseModel

from embedchain import Pipeline
from fastapi import APIRouter

router = APIRouter()

app_config = {
    "app": {
        "config": {
            "id": "open_source_app",
        }
    },
    "llm": {
        "provider": "openai",
        "config": {
            "model": "gpt-3.5-turbo-1106",
        }
    }
}

ec_app = Pipeline.from_config(config=app_config)


class SourceModel(BaseModel):
    source: str


class QuestionModel(BaseModel):
    question: str
    session_id: str


@router.post("/api/v1/add")
async def add_source(source_model: SourceModel):
    """
    Adds a new source to the Embedchain app.
    Expects a JSON with a "source" key.
    """
    source = source_model.source
    ec_app.add(source)
    return {"message": f"Source '{source}' added successfully."}


@router.post("/api/v1/query")
async def handle_query(question_model: QuestionModel):
    """
    Handles a query to the Embedchain app.
    Expects a JSON with a "question" key.
    """
    question = question_model.question
    answer = ec_app.query(question)
    return {"answer": answer}


@router.get("/api/v1/chat")
async def handle_chat(query: str, session_id: str = Query(None)):
    """
    Handles a chat request to the Embedchain app.
    Accepts 'query' and 'session_id' as query parameters.
    """
    response = ec_app.chat(query, session_id=session_id)
    return {"response": response}


@router.get("/")
async def root():
    return responses.RedirectResponse(url="/docs")
