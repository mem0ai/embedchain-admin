from fastapi import APIRouter

from routes.api import EC_APP

router = APIRouter()


@router.get("/api/v1/admin/collections")
async def get_all_collections():
    # Currently only works for ChromaDB but can be extended easily
    # for other vector stores as well
    collections = EC_APP.db.client.list_collections()
    responses = [c.dict() for c in collections]
    return responses


@router.get("/api/v1/admin/collections/chromadb/{collection_name}")
async def get_collection_details(collection_name: str):
    collection = EC_APP.db.client.get_collection(collection_name)
    collection_data = collection.get()
    metadatas, documents = collection_data['metadatas'], collection_data['documents']
    collated_data = []
    for i in zip(metadatas, documents):
        collated_data.append({
            "metadata": i[0],
            "document": i[1]
        })
    response = {"details": collection.dict(), "data": collated_data}
    return response
