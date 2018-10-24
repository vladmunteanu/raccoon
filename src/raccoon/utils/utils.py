import time
from datetime import datetime

from bson import ObjectId


def json_serial(obj):
    if isinstance(obj, datetime):
        return int(time.mktime(obj.timetuple()))

    if isinstance(obj, ObjectId):
        return str(obj)

    raise TypeError


def translate_job_arguments(job_arguments, context):
    """
    Translates the Job arguments given by the user, replacing placeholders
    with actual values from the context dictionary.

    :param job_arguments: list of Job arguments
    :type job_arguments: list
    :param context: dictionary of values sent by frontend at the end of a flow
    :type context: dict
    :return: dictionary of translated Job arguments
    :rtype: dict
    """
    args = {}
    for argument in job_arguments:
        arg_value = str(argument['value'])
        args[argument['name']] = arg_value.format(**context)
    return args
