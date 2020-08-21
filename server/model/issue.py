from ._base import BaseModel
from .issue_status import Status


class Issue(BaseModel):

    def __init__(self, id_=0, description='', title='', key='', created='', updated=''):
        super().__init__(id_)
        self.description = description
        self.title = title
        self.key = key
        self.createdAt = created
        self.updatedAt = updated
        self.status = None
        self.type = None

    @classmethod
    def from_db_dict(cls, obj):
        issue = cls(
            obj.get('id'),
            obj.get('description'),
            obj.get('title'),
            obj.get('key'),
            obj.get('createdAt'),
            obj.get('updatedAt'),
        )
        status = Status(obj.get('status_id'), obj.get('status_name'))
        issue.status = status
        return issue

    def to_viewmodel(self):
        return {
            'id': self.id,
            'key': self.key,
            'description': self.description,
            'title': self.title,
            'updatedAt': self.updatedAt,
            'createdAt': self.createdAt,
            'IssueStatus': self.status.to_viewmodel() if self.status else None
        }
