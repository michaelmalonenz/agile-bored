from .app import API_APP


@API_APP.route('/me')
def get_logged_in_user():
    return ('', 200)


@API_APP.route('/users/search')
def search_users():
    return ('', 200)
