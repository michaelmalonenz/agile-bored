from flask import g, jsonify
from .app import API_APP
from repository import repo_factory, RepositoryTypes


@API_APP.route('/me')
def get_logged_in_user():
    if hasattr(g, 'current_user'):
        repo = repo_factory(g, RepositoryTypes.USER)
        user = repo.get_by_external_id(g.current_user.externalId)
        return jsonify(user.to_viewmodel())
    return ('', 404)


@API_APP.route('/users/search')
def search_users():
    return ('', 200)
