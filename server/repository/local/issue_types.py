from ._base import BaseRepo
from model import IssueType


class IssueTypeRepository(BaseRepo):

    def get_all(self):
        sql = 'SELECT * FROM issue_type;'
        results = self.db.fetch(sql, {})
        return [IssueType.from_db_dict(issue_type) for issue_type in results]
