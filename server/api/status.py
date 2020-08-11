from flask import g, jsonify
from repository.local import StatusRepository as LocalStatusRepository
from .app import API_APP


@API_APP.route('/statuses', methods=['GET'])
def get_statuses():
    repo = LocalStatusRepository(g.db)
    statuses = repo.read_all()
    results = [status.to_viewmodel() for status in statuses]
    return (jsonify(results), 200)
