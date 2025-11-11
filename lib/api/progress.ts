import { apiClient } from './client';
import type { UserProgress, UserStreak } from '../types';

export const progressApi = {
  getMyProgress: async (topicId?: number): Promise<UserProgress[]> => {
    const params = topicId ? { topicId } : {};
    const { data } = await apiClient.get<UserProgress[]>('/progress/my-progress', { params });
    return data;
  },

  getDueToday: async (): Promise<UserProgress[]> => {
    const { data } = await apiClient.get<UserProgress[]>('/progress/due-today');
    return data;
  },

  getStreak: async (): Promise<UserStreak> => {
    const { data } = await apiClient.get<UserStreak>('/progress/streak');
    return data;
  },

  reviewQuestion: async (questionId: number, wasCorrect: boolean): Promise<UserProgress> => {
    const { data } = await apiClient.post<UserProgress>('/progress/review', {
      questionId,
      wasCorrect,
    });
    return data;
  },
};
