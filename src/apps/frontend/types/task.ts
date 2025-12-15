export interface Task {
    id: string;
    account_id: string;
    title: string;
    description: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateTaskParams {
    title: string;
    description: string;
}

export interface UpdateTaskParams {
    title: string;
    description: string;
}
