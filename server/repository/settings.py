from model import Settings


class SettingsRepository:
    def __init__(self, db_connector):
        self.db = db_connector

    def read_for_current_user(self, user_id):
        sql = 'SELECT * FROM settings WHERE "userId" = %(id)s;'
        return Settings.from_db_dict(self.db.fetch_one(sql, {'id': user_id}))
