from flask import g, jsonify, request
from model import Settings
from repository import SettingsRepository
from .app import API_APP


@API_APP.route('/settings', methods=['GET'])
def get_settings():
    return jsonify(g.user_settings.to_viewmodel())


@API_APP.route('/settings', methods=['POST', 'PUT'])
def save_settings():
    repo = SettingsRepository(g.db)
    g.user_settings = repo.upsert_user_settings(
        Settings.from_viewmodel(request.json()))
    return jsonify(g.user_settings.to_viewmodel())
