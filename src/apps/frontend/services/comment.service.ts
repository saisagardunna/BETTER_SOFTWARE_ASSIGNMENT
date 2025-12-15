import APIService from 'frontend/services/api.service';
import { ApiResponse } from 'frontend/types';
import { Comment, CreateCommentParams, UpdateCommentParams } from 'frontend/types/comment';

export default class CommentService extends APIService {
    getComments = async (
        accountId: string,
        taskId: string,
    ): Promise<ApiResponse<Comment[]>> =>
        this.apiClient.get(`/accounts/${accountId}/tasks/${taskId}/comments`);

    createComment = async (
        accountId: string,
        taskId: string,
        params: CreateCommentParams,
    ): Promise<ApiResponse<Comment>> =>
        this.apiClient.post(
            `/accounts/${accountId}/tasks/${taskId}/comments`,
            params,
        );

    updateComment = async (
        accountId: string,
        taskId: string,
        commentId: string,
        params: UpdateCommentParams,
    ): Promise<ApiResponse<Comment>> =>
        this.apiClient.patch(
            `/accounts/${accountId}/tasks/${taskId}/comments/${commentId}`,
            params,
        );

    deleteComment = async (
        accountId: string,
        taskId: string,
        commentId: string,
    ): Promise<ApiResponse<void>> =>
        this.apiClient.delete(
            `/accounts/${accountId}/tasks/${taskId}/comments/${commentId}`,
        );
}
