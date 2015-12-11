from copy import deepcopy
from motorengine import Document


class BaseModel(Document):
    ignore = []

    def getDict(self):
        result = deepcopy(super(Document, self).to_son())
        result['id'] = self._id
        for key in self.ignore:
            result.pop(key, None)
        return result
