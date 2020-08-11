class BaseRepo:
    def __init__(self, db_connector):
        self.db = db_connector
