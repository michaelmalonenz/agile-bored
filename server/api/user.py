from flask import g, jsonify
from .app import API_APP


@API_APP.route('/me')
def get_logged_in_user():
    if hasattr(g, 'current_user'):
        return jsonify(g.current_user.to_viewmodel())
    return ('', 404)


@API_APP.route('/users/search')
def search_users():
    return ('', 200)
