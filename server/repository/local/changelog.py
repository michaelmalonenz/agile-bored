from ._base import BaseRepo
from model import ChangeLog, User


class ChangeLogRepository(BaseRepo):
    def get_changelog_for_issue(self, issue_id):
        sql = (
            'SELECT c.id id, c.field, c."oldValue", c."newValue", c.timestamp, '
            'u.id user_id, u.username user_username, u."displayName" "user_displayName", '
            'u."externalId" "user_externalId", u.avatar user_avatar '
            'FROM changelog c '
            'INNER JOIN users u ON c."authorId" = u.id '
            'WHERE "issueId" = %(issue_id)s;'
        )
        results = self.db.fetch(sql, {'issue_id': issue_id})
        models = []
        for log in results:
            changelog = ChangeLog.from_db_dict(log)
            changelog.author = User(
                log['user_id'],
                log['user_externalId'],
                log['user_username'],
                log['user_displayName'],
                log['user_avatar'],
            )
            models.append(changelog)
        return models
