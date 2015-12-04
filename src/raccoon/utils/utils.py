from datetime import datetime
import time

from bson.objectid import ObjectId


def json_serial(obj):
    if isinstance(obj, datetime):
        return int(time.mktime(obj.timetuple()))

    if isinstance(obj, ObjectId):
        return str(obj)

    raise TypeError
