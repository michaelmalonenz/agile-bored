from ._base import BaseRepo
from model import User


class UserRepository(BaseRepo):

    def upsert_external_user(self, external_id, display_name, nickname, avatar):
        sql = (
            'INSERT INTO users ("externalId","username","displayName","avatar") VALUES '
            '(%(externalId)s, %(username)s, %(displayName)s, %(avatar)s) '
            'ON CONFLICT ("externalId") DO UPDATE SET '
            'username = %(username)s, displayName = %(displayName)s, avatar = %(avatar)s'
            'RETURNING *;'
        )
        params = {
            'externalId': external_id,
            'username': nickname,
            'displayName': display_name,
            'avatar': avatar,
        }
        return User.from_db_dict(self.db.fetch_one(sql, params))

    def get_by_external_id(self, external_id):
        sql = 'SELECT * FROM users WHERE "externalId" = %(external_id)s;'
        return User.from_db_dict(self.db.fetch_one(sql, {'external_id': external_id}))
