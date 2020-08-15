from ._base import BaseRepo
from model import Status


class StatusRepository(BaseRepo):

    def read_all(self):
        sql = 'SELECT "id", "name", "createdAt", "updatedAt" FROM issue_statuses;'
        return [Status.from_db_dict(x) for x in self.db.fetch(sql, [])]
