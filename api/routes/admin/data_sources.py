from fastapi import APIRouter, Response, status
from pydantic import BaseModel

from routes.admin.utils import (set_env_variables, unset_env_variables,
                                validate_json)
from routes.api import EC_APP

router = APIRouter()


class DataSourceModel(BaseModel):
    dataType: str
    dataValue: str
    metadata: str
    envVariables: str


@router.get("/api/v1/admin/data_sources")
async def get_all_data_sources():
    data_sources = EC_APP.get_data_sources()
    response = data_sources
    for i in response:
        i.update({"app_id": EC_APP.config.id})
    return response


@router.post("/api/v1/admin/data_sources", status_code=201)
async def add_data_source(data_source: DataSourceModel, response: Response):
    """
    Adds a new source to the Embedchain app.
    """
    data_type = data_source.dataType
    data_value = data_source.dataValue
    metadata = data_source.metadata
    env_variables = data_source.envVariables

    # Validate json metadata
    params = {"source": data_value, "data_type": data_type}
    if metadata and not validate_json(metadata):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "Invalid metadata. Enter a valid JSON object."}

    if env_variables and not validate_json(env_variables):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "Invalid environment variables. Enter a valid JSON object."}

    try:
        set_env_variables(env_variables)
        EC_APP.add(**params)
        unset_env_variables(env_variables)
        return {"message": f"Data of {data_type=} added successfully."}
    except Exception as e:
        message = f"An error occurred: Error message: {str(e)}."  # noqa:E501
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": message}
