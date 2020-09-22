from flask import g, jsonify, request
from repository import repo_factory, RepositoryTypes
from .app import API_APP


@API_APP.route('/issues', methods=["GET"])
def get_issues():
    repo = repo_factory(g, RepositoryTypes.ISSUE)
    results = repo.get_in_progress()
    return jsonify([issue.to_viewmodel() for issue in results])


@API_APP.route('/issues-by-epic', methods=["GET"])
def get_issues_by_epic():
    return ('', 200)


@API_APP.route('/issues/<int:issue_id>', methods=['GET'])
def get_issue(issue_id):
    repo = repo_factory(g, RepositoryTypes.ISSUE)
    issue = repo.get_by_id(issue_id)
    return jsonify(issue.to_viewmodel())


@API_APP.route('/issues/search', methods=["GET"])
def search_issues():
    repo = repo_factory(g, RepositoryTypes.ISSUE)
    return ('', 200)


@API_APP.route('/issues/standup', methods=["GET"])
def get_standup_issues():
    repo = repo_factory(g, RepositoryTypes.ISSUE)
    return ('', 200)


@API_APP.route('/issues/backlog', methods=["GET"])
def get_backlog_issues():
    repo = repo_factory(g, RepositoryTypes.ISSUE)
    results = repo.get_backlog_issues()
    return jsonify([issue.to_viewmodel() for issue in results])


@API_APP.route('/issues', methods=['POST'])
def create_issue():
    repo = repo_factory(g, RepositoryTypes.ISSUE)
    issue = repo.create(request.json, g.current_user.id)
    return jsonify(issue.to_viewmodel())


@API_APP.route('/issues/<int:issue_id>', methods=['PUT'])
def update_issue(issue_id):
    repo = repo_factory(g, RepositoryTypes.ISSUE)
    issue = repo.update_issue(request.json, g.current_user.id)
    return jsonify(issue.to_viewmodel())


@API_APP.route('/issues/<int:issue_id>/assign', methods=['PUT'])
def assign_issue(issue_id):
    repo = repo_factory(g, RepositoryTypes.ISSUE)
    assignee = request.json if request.json else {}
    issue = repo.assign(assignee.get('id'), issue_id, g.current_user.id)
    return jsonify(issue.to_viewmodel())


@API_APP.route('/issues/<int:issue_id>/status/<int:status_id>', methods=['PUT'])
def update_issue_status(issue_id, status_id):
    repo = repo_factory(g, RepositoryTypes.ISSUE)
    issue = repo.update_status(issue_id, status_id, g.current_user.id)
    return jsonify(issue.to_viewmodel())


@API_APP.route('/issues/<int:issue_id>', methods=['DELETE'])
def delete_issue(issue_id):
    repo = repo_factory(g, RepositoryTypes.ISSUE)
    repo.delete(issue_id)
    return ('', 204)


@API_APP.route('/issues/<int:issue_id>/subtasks', methods=["GET"])
def get_issue_subtasks(issue_id):
    repo = repo_factory(g, RepositoryTypes.ISSUE)
    results = repo.get_children(issue_id)
    return jsonify([issue.to_viewmodel() for issue in results])


@API_APP.route('/issues/<int:issue_id>/changelog', methods=["GET"])
def get_issue_changelog(issue_id):
    repo = repo_factory(g, RepositoryTypes.CHANGE_LOG)
    history = repo.get_changelog_for_issue(issue_id)
    return jsonify([log.to_viewmodel() for log in history])
