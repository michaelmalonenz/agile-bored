from ._base import BaseModel
from .user import User


class Comment(BaseModel):
    def __init__(self, id_=0, body='', updated='', created=''):
        super().__init__(id_)
        self.author = User()
        self.body = body
        self.updatedAt = updated
        self.createdAt = created

    @classmethod
    def from_db_dict(cls, obj):
        comment = cls(
            obj['id'],
            obj['body'],
            obj['updatedAt'],
            obj['createdAt'],
        )
        comment.author = User(
            obj['user_id'],
            obj['user_externalId'],
            obj['user_username'],
            obj['user_displayName'],
            obj['user_avatar'],
        )
        return comment

    def to_viewmodel(self):
        return {
            'id': self.id,
            'body': self.body,
            'author': self.author.to_viewmodel(),
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt,
        }
