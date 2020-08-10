from .app import API_APP


@API_APP.route('/settings')
def get_settings():
    return ('', 200)
