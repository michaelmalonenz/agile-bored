from flask import g, jsonify
from repository.local import IssueTypeRepository
from .app import API_APP


@API_APP.route('/issuetypes')
def get_issue_types():
    repo = IssueTypeRepository(g.db)
    issue_types = repo.get_all()
    return jsonify([issue_type.to_viewmodel() for issue_type in issue_types])
