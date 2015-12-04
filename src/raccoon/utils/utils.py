from datetime import datetime
from bson.objectid import ObjectId


def json_serial(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()

    if isinstance(obj, ObjectId):
        return str(obj)

    raise TypeError
