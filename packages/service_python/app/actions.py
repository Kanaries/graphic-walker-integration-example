from typing import List, Dict, Any
from ctypes import CDLL, c_char_p
import json

from app.common.database import DBSession
from sqlalchemy import text


def _get_sql_from_payload_on_so_go(table_name: str, payload: Dict[str, Any]) -> str:
    lib = CDLL("./dsl_to_sql.so")
    lib.ParseByString.argtypes = [c_char_p, c_char_p]
    lib.ParseByString.restype = c_char_p
    dataset = {
        "type": "table",
        "source": table_name
    }
    sql = lib.ParseByString(
        json.dumps(dataset).encode("utf-8"),
        json.dumps(payload).encode("utf-8")
    ).decode("utf-8")
    return sql


def get_table_meta(table_name: str) -> List[Dict[str, str]]:
    semantic_type_map = {
        "text": "nominal",
        "integer": "quantitative",
        "numeric": "quantitative",
        "boolean": "nominal",
        "date": "temporal",
        "timestamp": "temporal",
    }

    sql = """SELECT column_name, data_type FROM information_schema.columns WHERE table_name = :table_name"""
    return [
        {
            "fid": row.column_name,
            "name": row.column_name,
            "dataType": row.data_type,
            "semanticType": semantic_type_map.get(row.data_type, "nominal"),
        }
        for row in DBSession().execute(text(sql), {"table_name": table_name})
    ]


def get_datas_from_payload(
    table_name: str,
    payload: Dict[str, Any]
) -> List[Dict[str, Any]]:
    sql = _get_sql_from_payload_on_so_go(table_name, payload)
    return list(DBSession().execute(text(sql)).mappings())
