from ._base import BaseModel


class Settings(BaseModel):

    def __init__(self):
        self.jiraUrl = ''
        self.jiraProjectName = ''
        self.jiraRapidBoardId = 0
        self.useJira = False
        self.groupByEpic = False
        self.jiraEpicField = ''
        self.userId = 0
        self.perfStatsIssueTypes = ''

    def to_viewmodel(self):
        return {
            'id': self.id,
            'jiraUrl': self.jiraUrl,
            'jiraProjectName': self.jiraProjectName,
            'jiraRapidBoardId': self.jiraRapidBoardId,
            'useJira': self.useJira,
            'groupByEpic': self.groupByEpic,
            'jiraEpicField': self.jiraEpicField,
            'userId': self.userId,
            'perfStatsIssueTypes': self.perfStatsIssueTypes,
        }

    def to_db_dict(self):
        return self.to_viewmodel()
