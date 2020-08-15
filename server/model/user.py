from ._base import BaseModel


class User(BaseModel):

    def __init__(self):
        super().__init__()
        self.externalId = ''
        self.username = ''
        self.displayName = ''
        self.avatar = ''
        self.createdAt = ''
        self.updatedAt = ''

    def to_viewmodel(self):
        return {
            'id': self.id,
            'externalId': self.externalId,
            'username': self.username,
            'displayName': self.displayName,
            'avatarUrl': self.avatar,
            'largeAvatarUrl': self.avatar,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt,
        }
