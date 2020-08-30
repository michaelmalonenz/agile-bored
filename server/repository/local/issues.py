import logging
from ._base import BaseRepo
from .comments import CommentsRepository
from model import Issue


LOGGER = logging.getLogger(__name__)
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
        issue = Issue.from_db_dict(self.db.fetch_one(sql, {'id': id_}))
        issue.children = self.get_children(id_)

        comments_repo = CommentsRepository(self.db)
        issue.comments = comments_repo.get_comments_for_issue(id_)

        return issue

    def get_in_progress(self):
        sql = (
            BASE_ISSUE_SELECTOR +
            "WHERE (status.name != 'Done' OR i.\"statusId\" IS NULL) "
            "AND type.name != 'Epic' ORDER BY i.id;"
        )
        results = self.db.fetch(sql, {})
        return [Issue.from_db_dict(x) for x in results]

    def get_children(self, issue_id):
        sql = BASE_ISSUE_SELECTOR + 'WHERE i."parentId" = %(id)s;'
        results = self.db.fetch(sql, {'id': issue_id})
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

    def update_status(self, issue_id, status_id, editor_id):
        sql = (
            'UPDATE issues SET "statusId" = %(status_id)s, "latestEditorId" = %(editor)s '
            'WHERE id = %(issue_id)s;'
        )
        self.db.execute(sql, {
            'status_id': status_id,
            'editor': editor_id,
            'issue_id': issue_id,
        })
        return self.get_by_id(issue_id)

    def create(self, issue, reporter_id):
        sql = (
            'INSERT INTO issues (description, title, "typeId", "statusId", '
            '"parentId", "reporterId", "latestEditorId") '
            'VALUES (%(description)s, %(title)s, %(type_id)s, '
            "(SELECT id FROM issue_statuses WHERE name = 'Todo'), "
            '%(parent_id)s, %(reporter)s, %(editor)s) '
            'RETURNING *;'
        )
        created = self.db.fetch_one(sql, {
            'description': issue.get('description'),
            'title': issue.get('title'),
            'type_id': issue.get('issueType', {}).get('id'),
            'parent_id': issue.get('parentId'),
            'reporter': reporter_id,
            'editor': reporter_id,
        })
        return self.get_by_id(created['id'])

    def delete(self, issue_id):
        sql = 'DELETE FROM issues WHERE id = %(id)s;'
        self.db.execute(sql, {})

    def update_issue(self, issue, editor_id):
        sql = (
            'UPDATE issues SET '
            'title = %(title)s, description = %(description)s, "typeId" = %(type_id)s, '
            '"lastEditorId" = %(editor)s '
            'WHERE id = %(id)s;'
        )
        self.db.execute(sql, {
            'title': issue.get('title'),
            'description': issue.get('description'),
            'type_id': issue.get('issueType', {}).get('id'),
            'editor': editor_id,
        })
        return self.get_by_id(issue['id'])

    def get_backlog_issues(self):
        sql = (
            BASE_ISSUE_SELECTOR + "WHERE status.name = 'Todo';"
        )
        issues = self.db.fetch(sql, {})
        return [Issue.from_db_dict(issue) for issue in issues]
