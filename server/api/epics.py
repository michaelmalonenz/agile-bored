from .app import API_APP


# So, I'm going to fold and decide that Epics aren't a special
# case of issue, but their own thing.
@API_APP.route('/epics/search')
def search_epics():
    return ('', 200)


@API_APP.route('/epics/<int:epic_id>')
def get_epic(epic_id):
    return ('', 200)
