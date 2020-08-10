class BaseModel:
    def __init__(self):
        self.id = 0

    def to_dict(self):
        return {'id', self.id}

    def from_dict(self, obj):
        for key, value in obj.items():
            setattr(self, key, value)
