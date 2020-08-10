from .app import API_APP


@API_APP.route('/issues/<int:issue_id>/comments')
def get_issue_comments(issue_id):
    return ('', 200)


@API_APP.route('/issues/<int:issue_id>/comment', methods=['POST'])
def create_comment(issue_id):
    return ('', 200)
