from .app import API_APP


@API_APP.route('/issue/<int:issue_id>/comments')
def get_issue_comments(issue_id):
    return ('', 200)


@API_APP.route('/issue/<int:issue_id>/comment', methods=['POST'])
def create_comment(issue_id):
    return ('', 200)

# const localComments = require('./local/comments')
# const jiraComments = require('./jira/comments')

# module.exports = function (router) {
#   router.get('/issue/:issueId/comments', function (req, res) {
#     if (req.settings && req.settings.useJira) {
#       return jiraComments.getCommentsForIssue(req, res)
#     }
#     return localComments.getCommentsForIssue(req, res)
#   })

#   router.post('/issue/:issueId/comment', function (req, res) {
#     if (req.settings && req.settings.useJira) {
#       return jiraComments.addComment(req, res)
#     }
#     return localComments.addComment(req, res)
#   })
# }
