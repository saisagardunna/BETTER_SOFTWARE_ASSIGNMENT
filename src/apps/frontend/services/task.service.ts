import APIService from 'frontend/services/api.service';
import { ApiResponse } from 'frontend/types';
import { Task, CreateTaskParams, UpdateTaskParams } from 'frontend/types/task';

export default class TaskService extends APIService {
    getTasks = async (accountId: string): Promise<ApiResponse<Task[]>> =>
        this.apiClient.get(`/accounts/${accountId}/tasks`);

    createTask = async (
        accountId: string,
        params: CreateTaskParams,
    ): Promise<ApiResponse<Task>> =>
        this.apiClient.post(`/accounts/${accountId}/tasks`, params);

    updateTask = async (
        accountId: string,
        taskId: string,
        params: UpdateTaskParams,
    ): Promise<ApiResponse<Task>> =>
        this.apiClient.patch(`/accounts/${accountId}/tasks/${taskId}`, params);

    deleteTask = async (
        accountId: string,
        taskId: string,
    ): Promise<ApiResponse<void>> =>
        this.apiClient.delete(`/accounts/${accountId}/tasks/${taskId}`);
}
