from ._base import BaseModel


class User(BaseModel):

    def __init__(self, id_=0, externalId='', username='', displayName='', avatar='', created='', updated=''):
        super().__init__(id_)
        self.externalId = externalId
        self.username = username
        self.displayName = displayName
        self.avatar = avatar
        self.createdAt = created
        self.updatedAt = updated

    def to_viewmodel(self):
        return {
            'id': self.id,
            'externalId': self.externalId,
            'username': self.username,
            'displayName': self.displayName,
            'avatarUrl': self.avatar,
            'largeAvatarUrl': self.avatar,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt,
        }

    @classmethod
    def from_jira(cls, jira_obj):
        if jira_obj:
            jira_id = jira_obj.get('accountId', jira_obj.get('key'))
            result = cls(
                jira_id,
                jira_id,
                jira_obj['name'],
                jira_obj['displayName'],
                jira_obj['created'],
                jira_obj['updated'],
            )
            result.avatarUrl = jira_obj['avatarUrls']['24x24']
            result.largeAvatarUrl = jira_obj['avatarUrls']['48x48']
            return result
        return None
