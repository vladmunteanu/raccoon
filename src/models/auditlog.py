from motorengine import Document, UUIDField, StringField, DateTimeField


class AuditLog(Document):
    __collection__ = 'auditlogs'

    id = UUIDField()
    message = StringField(required=True)
    user = StringField(required=True)
    action = StringField(required=True)
    environment = StringField(required=True)
    project = StringField(required=True)
    date_added = DateTimeField(required=True, auto_now_on_insert=True)
