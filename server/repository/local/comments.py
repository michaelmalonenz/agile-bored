from ._base import BaseRepo
from model import Comment
import logging


LOGGER = logging.getLogger(__name__)
BASE_COMMENT_SELECTOR = (
    'SELECT c.id, c.body, c."createdAt", c."updatedAt", '
    'u.id user_id, u.username user_username, u."displayName" "user_displayName", '
    'u."externalId" "user_externalId", u.avatar user_avatar '
    'FROM comments c INNER JOIN users u ON u.id = c."authorId" '
)


class CommentsRepository(BaseRepo):
    def get_comments_for_issue(self, issue_id):
        sql = BASE_COMMENT_SELECTOR + 'WHERE "issueId" = %(issueId)s;'
        results = self.db.fetch(sql, {'issueId': issue_id})
        return [Comment.from_db_dict(comment) for comment in results]

    def get_comments_for_issues(self, issue_ids):
        sql = BASE_COMMENT_SELECTOR + 'WHERE "issueId" = %(issueId)s;'
        results = self.db.fetch(sql, {'issueIds': issue_ids})
        comment_map = {}
        for result in results:
            comment = Comment.from_db_dict(result)
            comment_map.setdefault(comment.id, [])
            comment_map[comment.id].append(comment)
        return comment_map

    def create(self, comment, author_id):
        sql = (
            'INSERT INTO comments (body, "authorId") VALUES '
            '(%(body)s, %(author_id)s) RETURNING *;'
        )
        result = self.db.fetch_one(sql, {
            'body': comment.get('body'),
            'author_id': comment.get('author', {}).get('id'),
        })
        sql = BASE_COMMENT_SELECTOR + 'WHERE id = %(id)s;'
        result = self.db.fetch_one(sql, {'id': result['id']})
        return Comment.from_db_dict(result)
