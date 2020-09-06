from ._base import BaseModel
from .issue_status import Status
from .issue_type import IssueType
from .user import User


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
        self.assignee = None
        self.reporter = None
        self.editor = None

    @classmethod
    def from_db_dict(cls, obj, comments=[], children=[]):
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
        type_ = IssueType(
            obj.get('type_id'),
            obj.get('type_name'),
            obj.get('type_colour'),
            obj.get('type_subtask'),
        )
        issue.type = type_
        assignee = User(
            obj.get('assignee_id'),
            obj.get('assignee_externalId'),
            obj.get('assignee_username'),
            obj.get('assignee_displayName'),
            obj.get('assignee_avatar'),
            obj.get('assignee_createdAt'),
            obj.get('assignee_updatedAt'),
        )
        issue.assignee = assignee if assignee.id else None
        reporter = User(
            obj.get('reporter_id'),
            obj.get('reporter_externalId'),
            obj.get('reporter_username'),
            obj.get('reporter_displayName'),
            obj.get('reporter_avatar'),
            obj.get('reporter_createdAt'),
            obj.get('reporter_updatedAt'),
        )
        issue.reporter = reporter if reporter.id else None
        editor = User(
            obj.get('editor_id'),
            obj.get('editor_externalId'),
            obj.get('editor_username'),
            obj.get('editor_displayName'),
            obj.get('editor_avatar'),
            obj.get('editor_createdAt'),
            obj.get('editor_updatedAt'),
        )
        issue.editor = editor if editor.id else None
        return issue

    def to_viewmodel(self):
        return {
            'id': self.id,
            'key': self.key,
            'description': self.description,
            'title': self.title,
            'updatedAt': self.updatedAt,
            'createdAt': self.createdAt,
            'issueStatus': self.status.to_viewmodel() if self.status else None,
            'issueType': self.type.to_viewmodel() if self.type else None,
            'assignee': self.assignee.to_viewmodel() if self.assignee else None,
            'reporter': self.reporter.to_viewmodel() if self.reporter else None,
        }

    @classmethod
    def from_jira(cls, jira_obj):
        fields = jira_obj['fields']
        result = cls(
            jira_obj['id'],
            fields['summary'],
            fields['description'],
            fields['key'],
            fields['created'],
            fields['updated'],
        )
        result.assignee = User.from_jira(fields.get('assignee'))
        result.assignee = User.from_jira(fields.get('reporter'))
        return result
        # if (obj.fields.attachment) {
        #     for (let attachment of obj.fields.attachment) {
        #         result.attachments.push(AttachmentViewModel.createFromJira(attachment))
        #     }
        # }
        # result.issueStatus = StatusViewModel.createFromJira(obj.fields.status)
        # result.issueType = IssueTypeViewModel.createFromJira(obj.fields.issuetype, colorObj)
        # result.epic = EpicViewModel.createFromJira(obj.fields.epic)
        # result.tags = obj.fields.labels ? obj.fields.labels : []
        # const comments = obj.fields.comment ? obj.fields.comment.comments : []
        # for (let comment of comments) {
        #     result.comments.push(CommentViewModel.createFromJira(comment))
        # }
        # return result
