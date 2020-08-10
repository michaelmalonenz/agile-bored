from .app import API_APP


@API_APP.route('/projects/<int:project_id>')
def get_project(project_id):
    return ('', 200)
