from dataclasses import asdict

from flask import jsonify, request
from flask.typing import ResponseReturnValue
from flask.views import MethodView

from modules.authentication.rest_api.access_auth_middleware import access_auth_middleware
from modules.task.errors import TaskBadRequestError
from modules.task.task_service import TaskService
from modules.task.types import (
    CreateCommentParams,
    DeleteCommentParams,
    GetCommentsParams,
    UpdateCommentParams,
)


class CommentView(MethodView):
    @access_auth_middleware
    def post(self, account_id: str, task_id: str) -> ResponseReturnValue:
        request_data = request.get_json()

        if request_data is None:
            raise TaskBadRequestError("Request body is required")

        if not request_data.get("content"):
            raise TaskBadRequestError("Content is required")

        create_comment_params = CreateCommentParams(
            task_id=task_id, account_id=account_id, content=request_data["content"]
        )

        created_comment = TaskService.create_comment(params=create_comment_params)
        comment_dict = asdict(created_comment)

        return jsonify(comment_dict), 201

    @access_auth_middleware
    def get(self, account_id: str, task_id: str) -> ResponseReturnValue:
        get_comments_params = GetCommentsParams(task_id=task_id, account_id=account_id)
        comments = TaskService.get_comments(params=get_comments_params)
        
        comments_list = [asdict(comment) for comment in comments]
        return jsonify(comments_list), 200


class CommentDetailView(MethodView):
    @access_auth_middleware
    def patch(self, account_id: str, task_id: str, comment_id: str) -> ResponseReturnValue:
        request_data = request.get_json()

        if request_data is None:
            raise TaskBadRequestError("Request body is required")

        if not request_data.get("content"):
            raise TaskBadRequestError("Content is required")

        update_comment_params = UpdateCommentParams(
            comment_id=comment_id,
            task_id=task_id,
            account_id=account_id,
            content=request_data["content"],
        )

        updated_comment = TaskService.update_comment(params=update_comment_params)
        comment_dict = asdict(updated_comment)

        return jsonify(comment_dict), 200

    @access_auth_middleware
    def delete(self, account_id: str, task_id: str, comment_id: str) -> ResponseReturnValue:
        delete_params = DeleteCommentParams(
            comment_id=comment_id, task_id=task_id, account_id=account_id
        )

        TaskService.delete_comment(params=delete_params)

        return "", 204
