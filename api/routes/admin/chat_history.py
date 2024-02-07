from fastapi import APIRouter

from routes.api import EC_APP

router = APIRouter()


@router.get("/api/v1/admin/chat_history")
async def get_all_chat_history():
    chat_history = EC_APP.llm.memory.get(
        app_id=EC_APP.config.id,
        num_rounds=100,
        display_format=True,
        fetch_all=True,
    )
    return chat_history
