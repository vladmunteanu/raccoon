from __future__ import absolute_import

from motorengine import Document, StringField, DateTimeField


class AuditLog(Document):
    __collection__ = 'auditlogs'

    message = StringField(required=True)
    user = StringField(required=True)
    action = StringField(required=True)
    environment = StringField()
    project = StringField()
    date_added = DateTimeField(required=True, auto_now_on_insert=True)
