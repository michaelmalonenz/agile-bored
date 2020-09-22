from model import User
from .jira_repo import JiraRepo


class UserRepository(JiraRepo):

    def get_by_external_id(self, external_id):
        response = self.jira_request('/myself')
        return User.from_jira(response.json())
