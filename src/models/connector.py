from motorengine import Document, UUIDField, StringField, EmailField, ListField, DateTimeField, ReferenceField

class Install(Document):
    __collection__ = 'installs'

    id = UUIDField()
    name = StringField(required=True)
    config = ListField()
    date_added = ListField(DateTimeField(required=True, auto_now_on_insert=True))

