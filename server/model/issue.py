from ._base import BaseModel


class Issue(BaseModel):

    def __init__(self):
        super().__init__()
        self.description = ''
        self.title = ''
        self.key = ''
        self.createdAt = ''
        self.updatedAt = ''

    def to_viewmodel(self):
        return {
            'id': self.id,
            'key': self.key,
            'description': self.description,
            'title': self.title,
            'updatedAt': self.updatedAt,
            'createdAt': self.createdAt,
        }