from .app import API_APP


@API_APP.route('/estimate/<int:epic_id>')
def produce_estimate(epic_id):
    return ('', 200)
