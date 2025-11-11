import { apiClient } from './client';
import type { Question } from '../types';

export const questionsApi = {
  getAll: async (topicId?: number): Promise<Question[]> => {
    const params = topicId ? { topicId } : {};
    const { data } = await apiClient.get<Question[]>('/questions', { params });
    return data;
  },

  getQuickReview: async (topicId?: number): Promise<Question[]> => {
    const url = topicId 
      ? `/questions/topic/${topicId}/quick-review`
      : '/questions/quick-review';
    const { data } = await apiClient.get<Question[]>(url);
    return data;
  },

  getById: async (id: number): Promise<Question> => {
    const { data } = await apiClient.get<Question>(`/questions/${id}`);
    return data;
  },

  getMyQuestions: async (): Promise<Question[]> => {
    const { data } = await apiClient.get<Question[]>('/questions/my');
    return data;
  },

  create: async (questionData: Partial<Question>): Promise<Question> => {
    const { data } = await apiClient.post<Question>('/questions', questionData);
    return data;
  },

  bulkCreate: async (topicId: number, questions: Partial<Question>[]): Promise<Question[]> => {
    const { data } = await apiClient.post<Question[]>('/questions/bulk', {
      topicId,
      questions,
    });
    return data;
  },

  update: async (id: number, questionData: Partial<Question>): Promise<Question> => {
    const { data } = await apiClient.patch<Question>(`/questions/${id}`, questionData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/questions/${id}`);
  },
};
