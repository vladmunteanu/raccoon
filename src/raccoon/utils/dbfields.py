from motorengine import BaseField


class DictField(BaseField):
    """
    Field responsible for storing dict objects.
    """

    def validate(self, value):
        return isinstance(value, dict)

    def to_son(self, value):
        return value

    def from_son(self, value):
        return value