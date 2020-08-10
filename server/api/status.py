from .app import API_APP


@API_APP.route('/statuses', methods=['GET'])
def get_statuses():
    return (r'[{}]', 200)
