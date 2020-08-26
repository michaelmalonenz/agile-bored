from ._base import BaseRepo
from model import Comment


class CommentsRepository(BaseRepo):
    def get_comments_for_issue(self, issue_id):
        sql = 'SELECT * FROM comments WHERE "issueId" = %(issueId)s;'
        results = self.db.fetch(sql, {'issueId': issue_id})
        return [Comment.from_db_dict(comment) for comment in results]

    def get_comments_for_issues(self, issue_ids):
        sql = 'SELECT * FROM comments WHERE "issueId" IN %(issueIds)s;'
        results = self.db.fetch(sql, {'issueIds': issue_ids})
        comment_map = {}
        for result in results:
            comment = Comment.from_db_dict(result)
            comment_map.setdefault(comment.id, [])
            comment_map[comment.id].append(comment)
        return comment_map
