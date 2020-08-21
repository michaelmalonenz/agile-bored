from ._base import BaseModel


class User(BaseModel):

    def __init__(self, id_=0, externalId='', username='', displayName='', avatar='', created='', updated=''):
        super().__init__(id_)
        self.externalId = externalId
        self.username = username
        self.displayName = displayName
        self.avatar = avatar
        self.createdAt = created
        self.updatedAt = updated

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
