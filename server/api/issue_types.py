from .app import API_APP


@API_APP.route('/issuetypes')
def get_issue_types():
    return ('', 200)
