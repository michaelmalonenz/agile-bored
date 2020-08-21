from ._base import BaseModel


class IssueType(BaseModel):
    def __init__(self, id_=0, name='', colour='', subtask=False):
        super().__init__(id_)
        self.name = name
        self.colour = colour
        self.subtask = subtask

    def to_viewmodel(self):
        return {
            'id': self.id,
            'name': self.name,
            'colour': self.colour,
            'subtask': self.subtask,
        }
