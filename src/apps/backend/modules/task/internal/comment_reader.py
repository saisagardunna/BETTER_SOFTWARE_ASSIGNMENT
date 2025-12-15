from modules.task.internal.store.comment_repository import CommentRepository
from modules.task.internal.comment_util import CommentUtil
from modules.task.types import GetCommentsParams, Comment


class CommentReader:
    @staticmethod
    def get_comments_by_task_id(*, params: GetCommentsParams) -> list[Comment]:
        filter_query = {"task_id": params.task_id, "account_id": params.account_id}
        cursor = CommentRepository.collection().find(filter_query).sort("created_at", -1)
        comments_bson = list(cursor)
        return [CommentUtil.convert_comment_bson_to_comment(c) for c in comments_bson]
