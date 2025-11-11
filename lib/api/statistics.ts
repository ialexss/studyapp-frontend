import { apiClient } from './client';
import type { Statistics } from '../types';

export const statisticsApi = {
  getOverview: async (): Promise<Statistics> => {
    const { data } = await apiClient.get<Statistics>('/statistics/overview');
    return data;
  },

  getDifficult: async (limit: number = 10): Promise<any[]> => {
    const { data } = await apiClient.get('/statistics/difficult', {
      params: { limit },
    });
    return data;
  },

  getByTopic: async (): Promise<any[]> => {
    const { data } = await apiClient.get('/statistics/by-topic');
    return data;
  },
};
