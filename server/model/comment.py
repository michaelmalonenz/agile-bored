from ._base import BaseModel
from .user import User


class Comment(BaseModel):
    def __init__(self):
        super().__init__()
        self.author = User()
        self.body = ''
        self.updatedAt = ''
        self.createdAt = ''

    @classmethod
    def from_db_dict(cls, obj):
        pass

    def to_viewmodel(self):
        return {
            'id': self.id,
            'body': self.body,
            'author': self.author.to_viewmodel(),
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt,
        }
