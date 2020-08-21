from flask import g, jsonify
from repository.local import IssueRepository
from .app import API_APP


@API_APP.route('/issues')
def get_issues():
    repo = IssueRepository(g.db)
    results = repo.get_in_progress()
    return jsonify([issue.to_viewmodel() for issue in results])


@API_APP.route('/issues-by-epic')
def get_issues_by_epic():
    return ('', 200)


@API_APP.route('/issue/<int:issue_id>')
def get_issue(issue_id):
    repo = IssueRepository(g.db)
    issue = repo.get_by_id(issue_id)
    return jsonify(issue.to_viewmodel())


@API_APP.route('/issues/search')
def search_issues():
    return ('', 200)


@API_APP.route('/issues/standup')
def get_standup_issues():
    return ('', 200)


@API_APP.route('/issues/backlog')
def get_backlog_issues():
    return ('', 200)


@API_APP.route('/issues', methods=['POST'])
def create_issue():
    return ('', 200)


@API_APP.route('/issues/<int:issue_id>', methods=['PUT'])
def update_issue(issue_id):
    return ('', 200)


@API_APP.route('/issues/<int:issue_id>/assign', methods=['PUT'])
def assign_issue(issue_id):
    return ('', 200)


@API_APP.route('/issues/<int:issue_id>/status/<int:status_id>', methods=['PUT'])
def update_issue_status(issue_id, status_id):
    return ('', 200)


@API_APP.route('/issues/<int:issue_id>', methods=['DELETE'])
def delete_issue(issue_id):
    return ('', 200)


@API_APP.route('/issues/<int:issue_id>/subtasks')
def get_issue_subtasks():
    return ('', 200)


@API_APP.route('/issues/<int:issue_id>/changelog')
def get_issue_changelog():
    return ('', 200)
