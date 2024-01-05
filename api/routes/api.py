from embedchain import Pipeline
from fastapi import APIRouter, Query, responses
from pydantic import BaseModel

router = APIRouter()

# Open source app config using Mixtral-8x7B-Instruct-v0.1 as LLM
app_config = {
    "app": {
        "config": {
            "name": "open-source-demo-app"
        }
    },
    "llm": {
        "provider": "huggingface",
        "config": {
            "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            "temperature": 0.1,
            "max_tokens": 250,
            "top_p": 0.1
        }
    },
    "embedder": {
        "provider": "huggingface",
        "config": {
            "model": "sentence-transformers/all-mpnet-base-v2"
        }
    }
}

# Uncomment the following lines to use the app config using OpenAI GPT-3.5-turbo-1106 as LLM
# app_config = {
#     "app": {
#         "config": {
#             "id": "embedchain-demo-app",
#         }
#     },
#     "llm": {
#         "provider": "openai",
#         "config": {
#             "model": "gpt-3.5-turbo-1106",
#         }
#     }
# }

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
    try:
        ec_app.add(source)
        return {"message": f"Source '{source}' added successfully."}
    except Exception as e:
        response = f"An error occurred: Error message: {str(e)}. Contact Embedchain founders on Slack: https://embedchain.com/slack or Discord: https://embedchain.com/discord"  # noqa:E501
        return {"message": response}


@router.get("/api/v1/chat")
async def handle_chat(query: str, session_id: str = Query(None)):
    """
    Handles a chat request to the Embedchain app.
    Accepts 'query' and 'session_id' as query parameters.
    """
    try:
        response = ec_app.chat(query, session_id=session_id)
    except Exception as e:
        response = f"An error occurred: Error message: {str(e)}. Contact Embedchain founders on Slack: https://embedchain.com/slack or Discord: https://embedchain.com/discord"  # noqa:E501
    return {"response": response}


@router.get("/")
async def root():
    return responses.RedirectResponse(url="/docs")
