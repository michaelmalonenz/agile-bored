from ._base import BaseModel


class Issue(BaseModel):

    def from_db_dict(self, obj_dict):
        pass

    def to_db_dict(self, obj_dict):
        pass
