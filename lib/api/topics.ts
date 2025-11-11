import { apiClient } from './client';
import type { Topic } from '../types';

export const topicsApi = {
  getAll: async (): Promise<Topic[]> => {
    const { data } = await apiClient.get<Topic[]>('/topics');
    return data;
  },

  getById: async (id: number): Promise<Topic> => {
    const { data } = await apiClient.get<Topic>(`/topics/${id}`);
    return data;
  },

  getMyTopics: async (): Promise<Topic[]> => {
    const { data } = await apiClient.get<Topic[]>('/topics/my');
    return data;
  },

  create: async (topicData: Partial<Topic>): Promise<Topic> => {
    const { data } = await apiClient.post<Topic>('/topics', topicData);
    return data;
  },

  update: async (id: number, topicData: Partial<Topic>): Promise<Topic> => {
    const { data } = await apiClient.patch<Topic>(`/topics/${id}`, topicData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/topics/${id}`);
  },

  getSubtopics: async (id: number): Promise<Topic[]> => {
    const { data } = await apiClient.get<Topic[]>(`/topics/${id}/subtopics`);
    return data;
  },
};
