from ._base import BaseModel
from .user import User


class ChangeLog(BaseModel):

    def __init__(self, id_=0, field='', oldValue='', newValue='', timestamp=''):
        super().__init__(id_)
        self.field = field
        self.oldValue = oldValue
        self.newValue = newValue
        self.timestamp = timestamp
        self.author = None

    @classmethod
    def from_db_dict(cls, obj):
        return cls(
            obj.get('id'),
            obj.get('field'),
            obj.get('oldValue'),
            obj.get('newValue'),
            obj.get('timestamp'),
        )

    def to_viewmodel(self):
        return {
            'id': self.id,
            'field': self.field,
            'fromValue': self.oldValue,
            'toValue': self.newValue,
            'timestamp': self.timestamp,
            'author': self.author.to_viewmodel(),
        }
