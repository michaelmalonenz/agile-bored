from ._base import BaseRepo
from model import ChangeLog


class ChangeLogRepository(BaseRepo):
    def get_changelog_for_issue(self, issue_id):
        sql = (
            'SELECT id, field, "oldValue", "newValue", timestamp FROM changelog '
            'WHERE "issueId" = %(issue_id)s;'
        )
        results = self.db.fetch(sql, {'issue_id': issue_id})
        return [ChangeLog.from_db_dict(log) for log in results]
