from typing import Dict, List, Any

from traceback import print_exc
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, Query
from fastapi.responses import JSONResponse

from app.actions import get_table_meta, get_datas_from_payload


async def any_exception_handler(_: Request, exc: Exception):
    print_exc()
    return JSONResponse(
        status_code=200,
        content={
            "success": False,
            "message": "error",
            "data": None
        }
    )


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(Exception, any_exception_handler)


class BaseResponse(BaseModel):
    success: bool = True
    data: Dict[str, Any] = {}
    message: str = ""


class QueryDataRequest(BaseModel):
    dataset_id: str = Field(..., alias="datasetId")
    payload: Dict[str, Any]


@app.get("/meta/query")
def meta_get(
    dataset_id: str = Query(..., alias="datasetId"),
) -> BaseResponse:
    resp_data = {
        "fieldsMeta": get_table_meta(dataset_id),
        "name": dataset_id,
        "datasetId": dataset_id,
    }
    return {"data": resp_data}


@app.post("/dsl/query")
def dsl_query_get(
    req: QueryDataRequest,
):
    return {
        "success": True,
        "data": get_datas_from_payload(req.dataset_id, req.payload)
    }
