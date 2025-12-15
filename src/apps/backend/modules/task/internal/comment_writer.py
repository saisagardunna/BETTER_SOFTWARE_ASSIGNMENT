from datetime import datetime

from bson.objectid import ObjectId
from pymongo import ReturnDocument

from modules.task.internal.store.comment_model import CommentModel
from modules.task.internal.store.comment_repository import CommentRepository
from modules.task.internal.comment_util import CommentUtil
from modules.task.types import (
    CreateCommentParams,
    UpdateCommentParams,
    DeleteCommentParams,
    Comment,
)
from modules.task.errors import TaskNotFoundError


class CommentWriter:
    @staticmethod
    def create_comment(*, params: CreateCommentParams) -> Comment:
        comment_bson = CommentModel(
            task_id=params.task_id,
            account_id=params.account_id,
            content=params.content,
        ).to_bson()

        query = CommentRepository.collection().insert_one(comment_bson)
        created_comment_bson = CommentRepository.collection().find_one({"_id": query.inserted_id})

        return CommentUtil.convert_comment_bson_to_comment(created_comment_bson)

    @staticmethod
    def update_comment(*, params: UpdateCommentParams) -> Comment:
        updated_comment_bson = CommentRepository.collection().find_one_and_update(
            {"_id": ObjectId(params.comment_id), "task_id": params.task_id, "account_id": params.account_id},
            {"$set": {"content": params.content, "updated_at": datetime.now()}},
            return_document=ReturnDocument.AFTER,
        )

        if updated_comment_bson is None:
             # Using TaskNotFoundError as a generic "Not Found" for now or create a specific one
            raise TaskNotFoundError(task_id=params.comment_id)

        return CommentUtil.convert_comment_bson_to_comment(updated_comment_bson)

    @staticmethod
    def delete_comment(*, params: DeleteCommentParams) -> bool:
        result = CommentRepository.collection().delete_one(
            {"_id": ObjectId(params.comment_id), "task_id": params.task_id, "account_id": params.account_id}
        )
        return result.deleted_count > 0
