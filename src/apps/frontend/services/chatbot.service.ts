import APIService from 'frontend/services/api.service';
import { ApiResponse } from 'frontend/types';

export interface ChatbotQuery {
    query: string;
}

export interface ChatbotResponse {
    success: boolean;
    response: string;
    data?: any;
    type?: string;
    error?: string;
}

export default class ChatbotService extends APIService {
    sendQuery = async (query: string): Promise<ApiResponse<ChatbotResponse>> =>
        this.apiClient.post('/chatbot/query', { query });
}
