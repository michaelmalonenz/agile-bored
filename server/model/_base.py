class BaseModel:
    def __init__(self, id_ = 0):
        self.id = id_

    def to_db_dict(self):
        return {'id': self.id}

    @classmethod
    def from_db_dict(cls, obj):
        instance = cls()
        for key, value in obj.items():
            setattr(instance, key, value)
        return instance

    def to_viewmodel(self):
        return {'id': self.id}

    @classmethod
    def from_viewmodel(cls, viewmodel):
        instance = cls()
        for key, value in viewmodel.items():
            setattr(instance, key, value)
        return instance
