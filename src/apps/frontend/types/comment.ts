export interface Comment {
    id: string;
    task_id: string;
    account_id: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface CreateCommentParams {
    content: string;
}

export interface UpdateCommentParams {
    content: string;
}
