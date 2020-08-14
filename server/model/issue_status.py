from ._base import BaseModel


class Status(BaseModel):

    def __init__(self, id_, name='', created='', updated=''):
        super().__init__(id_)
        self.name = name
        self.created_at = created
        self.updated_at = updated

    @classmethod
    def from_db_dict(cls, obj):
        return cls(obj.get('id'), obj.get('name'), obj.get('createAt'), obj.get('updatedAt'))

    def to_viewmodel(self):
        return {
            'id': self.id,
            'name': self.name,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
        }
