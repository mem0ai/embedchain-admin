from fastapi import APIRouter

router = APIRouter()


@router.get("/api/v1/admin/data_sources")
async def get_all_data_sources():
    collections = client.list_collections()
    responses = [c.dict() for c in collections]
    return responses


# TODO(deshraj): Add pagination and make this endpoint agnostic to the vector store
@router.get("/api/v1/admin/collections/chromadb/{collection_name}")
async def get_collection_details(collection_name: str):
    collection = client.get_collection(collection_name)
    collection_data = collection.get()
    metadatas, documents = collection_data['metadatas'], collection_data['documents']
    collated_data = []
    for i in zip(metadatas, documents):
        collated_data.append({
            "metadata": i[0],
            "document": i[1]
        })
    response = {"details": collection.model_dump(), "data": collated_data}
    return response
