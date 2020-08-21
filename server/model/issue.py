from ._base import BaseModel


class Issue(BaseModel):

    def __init__(self):
        super().__init__()
        self.description = ''
        self.title = ''
        self.rank = 0
        self.statusId = 0
        self.typeId = 0
        self.assigneeId = 0
        self.reporterId = 0
        self.parentId = 0
        self.latestEditorId = 0
        self.createdAt = ''
        self.updatedAt = ''

    def to_viewmodel(self):
        return {
            'id': self.id,
            'description': self.description,
            'title': self.title,
            'updatedAt': self.updatedAt,
            'createdAt': self.createdAt,
        }