from .app import API_APP


@API_APP.route('/reports/perf-stats', methods=['GET'])
def get_perf_stats_report():
    return ('', 200)


@API_APP.route('/reports/epicremaining', methods=['GET'])
def get_epic_remaining_report():
    return ('', 200)
