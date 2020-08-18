from model import Settings


class SettingsRepository:
    def __init__(self, db_connector):
        self.db = db_connector

    def read_for_user(self, user_id):
        sql = 'SELECT * FROM settings WHERE "userId" = %(id)s;'
        return Settings.from_db_dict(self.db.fetch_one(sql, {'id': user_id}))

    def upsert_user_settings(self, settings):
        sql = (
            'INSERT INTO settings '
            '("jiraUrl","jiraProjectName","jiraRapidBoardId","useJira",'
            '"groupByEpic","jiraEpicField","userId") VALUES '
            '(%(jiraUrl)s, %(jiraProjectName)s, %(jiraRapidBoardId)s, %(useJira)s,'
            '%(groupByEpic)s, %(jiraEpicField)s, %(userId)s) '
            'ON CONFLICT ("userId") DO UPDATE SET '
            '"jiraUrl" = %(jiraUrl)s, "jiraProjectName" = %(jiraProjectName)s, '
            '"jiraRapidBoardId" = %(jiraRapidBoardId)s, "useJira" = %(useJira)s, '
            '"groupByEpic" = %(groupByEpic)s, "jiraEpicField" = %(jiraEpicField)s'
            'RETURNING *;'
        )
        return Settings.from_db_dict(self.db.fetch_one(sql, settings.to_db_dict()))
