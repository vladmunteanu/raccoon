from motorengine import Document, UUIDField, StringField, DateTimeField


class Project(Document):
    __collection__ = 'projects'

    id = UUIDField()
    name = StringField(required=True, unique=True)
    date_added = DateTimeField(required=True, auto_now_on_insert=True)