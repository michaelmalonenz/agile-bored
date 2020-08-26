from flask import g, jsonify
from .app import API_APP
from repository.local import CommentsRepository


@API_APP.route('/issues/<int:issue_id>/comments')
def get_issue_comments(issue_id):
    repo = CommentsRepository(g.db)
    comments = repo.get_comments_for_issue(issue_id)
    return jsonify([comment.to_viewmodel() for comment in comments])


@API_APP.route('/issues/<int:issue_id>/comment', methods=['POST'])
def create_comment(issue_id):
    return ('', 200)
