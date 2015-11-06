from motorengine import Document, UUIDField, StringField, EmailField


class User(Document):
    __collection__ = 'users'

    id = UUIDField()
    email = EmailField(required=True, unique=True)
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    first_name = StringField()
    last_name = StringField()


    @property
    def full_name(self):
        return '%s, %s' % (self.last_name, self.first_name)
