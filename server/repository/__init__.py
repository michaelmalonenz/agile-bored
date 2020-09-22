from .database_connector import DatabaseConnector
from .settings import SettingsRepository
import repository.local as local
import repository.jira as jira
from enum import Enum, auto


class RepositoryTypes(Enum):
    ISSUE = auto()
    CHANGE_LOG = auto()
    USER = auto()


LOCAL_REPOSITORIES = {
    RepositoryTypes.ISSUE: local.IssueRepository,
    RepositoryTypes.CHANGE_LOG: local.ChangeLogRepository,
    RepositoryTypes.USER: local.UserRepository,
}

JIRA_REPOSITORIES = {
    RepositoryTypes.ISSUE: jira.IssueRepository,
    RepositoryTypes.CHANGE_LOG: jira.ChangeLogRepository,
    RepositoryTypes.USER: jira.UserRepository,
}


def repo_factory(globals_, repo_type):
    settings = globals_.user_settings
    if settings.useJira:
        return JIRA_REPOSITORIES[repo_type](
            settings.jiraRapidBoardId,
            settings.jiraProjectName,
            settings.jiraEpicField,
        )
    else:
        return LOCAL_REPOSITORIES[repo_type](globals_.db)
