from ._base import BaseRepo
from model import Issue


BASE_ISSUE_SELECTOR = (
    "SELECT i.id, CONCAT('AB-', CAST(i.id AS VARCHAR)) AS key, i.title, i.description, "
    'i."createdAt", i."updatedAt", '
    'status.id status_id, status.name status_name, '
    'type.id type_id, type.name type_name, type.colour type_colour, type.subtask type_subtask, '
    'assignee.id assignee_id, assignee."externalId" "assignee_externalId", assignee."displayName" "assignee_displayName", '
    'assignee.username assignee_username, assignee.avatar assignee_avatar, '
    'assignee."createdAt" "assignee_createdAt", assignee."updatedAt" "assignee_updatedAt", '
    'reporter.id reporter_id, reporter."externalId" "reporter_externalId", reporter."displayName" "reporter_displayName", '
    'reporter.username reporter_username, reporter.avatar reporter_avatar, '
    'reporter."createdAt" "reporter_createdAt", reporter."updatedAt" "reporter_updatedAt", '
    'editor.id editor_id, editor."externalId" "editor_externalId", editor."displayName" "editor_displayName", '
    'editor.username editor_username, editor.avatar editor_avatar, '
    'editor."createdAt" "editor_createdAt", editor."updatedAt" "editor_updatedAt" '
    'FROM issues i '
    'LEFT JOIN issue_statuses status ON i."statusId" = status.id '
    'INNER JOIN issue_type type ON i."typeId" = type.id '
    'LEFT JOIN users assignee ON i."assigneeId" = assignee.id '
    'INNER JOIN users reporter ON i."reporterId" = reporter.id '
    'LEFT JOIN users editor ON i."latestEditorId" = editor.id '
)


class IssueRepository(BaseRepo):

    def get_by_id(self, id_):
        sql = BASE_ISSUE_SELECTOR + 'WHERE i.id = %(id)s;'
        return Issue.from_db_dict(self.db.fetch_one(sql, {'id': id_}))

    def get_in_progress(self):
        sql = (
            BASE_ISSUE_SELECTOR +
            "WHERE (status.name != 'Done' OR i.\"statusId\" IS NULL) "
            "AND type.subtask IS FALSE AND type.name != 'Epic';"
        )
        results = self.db.fetch(sql, {})
        return [Issue.from_db_dict(x) for x in results]

    def assign(self, assignee_id, issue_id, editor_id):
        sql = (
            'UPDATE issues SET "assigneeId" = %(assignee)s, "latestEditorId" = %(editor)s '
            'WHERE id = %(issue_id)s;'
        )
        self.db.execute(sql, {
            'assignee': assignee_id,
            'editor': editor_id,
            'issue_id': issue_id,
        })
        return self.get_by_id(issue_id)
