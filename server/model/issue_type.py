from ._base import BaseModel


class IssueType(BaseModel):
    def __init__(self, id_, name='', colour='', subtask=False):
        super().__init__(id_)
        self.name = name
        self.colour = colour
        self.subtask = subtask

    @classmethod
    def from_db_dict(cls, obj):
        return cls(obj.get('id'), obj.get('name'), obj.get('colour'), obj.get('subtask'))

    def to_viewmodel(self):
        return {
            'id': self.id,
            'name': self.name,
            'colour': self.colour,
            'subtask': self.subtask,
        }
