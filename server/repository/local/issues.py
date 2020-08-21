from ._base import BaseRepo
from model import Issue


class IssueRepository(BaseRepo):

    def get_by_id(self, id_):
        sql = (
            'SELECT * FROM issues WHERE "id" = %(id)s;'
        )
        return Issue.from_db_dict(self.db.fetch_one(sql, {'id': id_}))

    def get_in_progress(self):
        sql = (
            'SELECT i.* '
            'FROM issues i '
            'LEFT JOIN issue_statuses status ON i."statusId" = status.id '
            'INNER JOIN issue_type ON i."typeId" = issue_type.id '
            'LEFT JOIN users assignees ON i."assigneeId" = assignees.id '
            'INNER JOIN users reporters ON i."reporterId" = reporters.id '
            'LEFT JOIN users editors ON i."latestEditorId" = editors.id '
            "WHERE status.name != 'Done' OR i.\"statusId\" IS NULL;"
        )
        results = self.db.fetch(sql, {})
        return [Issue.from_db_dict(x) for x in results]
