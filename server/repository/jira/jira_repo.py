from urllib.parse import urljoin
from flask import g, request
import requests


def _build_request(api_prefix, api_suffix, method='GET'):
    return requests.request(
        method,
        url=urljoin(g.user_settings.jiraUrl, api_prefix + api_suffix),
        headers={
            'Content-Type': 'application/json',
            'Authorization': request.headers.get('Authorization')
        }
    )


class JiraRepo:

    def __init__(self, rapid_board_id, project_name, epic_field):
        self.rapid_board_id = rapid_board_id
        self.project_name = project_name
        self.epic_field = epic_field

    def jira_request(self, api_suffix, method='GET'):
        return _build_request('/rest/api/2', api_suffix, method)

    def agile_request(self, api_suffix, method='GET'):
        return _build_request('/rest/agile/1.0', api_suffix, method)

    def greenhopper_request(self, api_suffix, method='GET'):
        return _build_request('/rest/greenhopper/1.0', api_suffix, method)
