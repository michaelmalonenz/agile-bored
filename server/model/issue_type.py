from ._base import BaseModel


class IssueType(BaseModel):
    def __init__(self):
        super().__init__()
        self.name = ''
        self.colour = ''
        self.subtask = False

    def to_viewmodel(self):
        return {
            'id': self.id,
            'name': self.name,
            'colour': self.colour,
            'subtask': self.subtask,
        }
