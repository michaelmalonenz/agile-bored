from ._base import BaseModel


class Status(BaseModel):

    def __init__(self, db):
        super().__init__(db)
        self.name = ''
        self.created_at = ''
        self.updated_at = ''

    def to_viewmodel(self):
        return {
            'id': self.id,
            'name': self.name,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
        }
