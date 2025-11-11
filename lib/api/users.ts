import { apiClient } from './client';
import type { User } from '../types';

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  getById: async (id: number): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  create: async (userData: Partial<User>): Promise<User> => {
    const { data } = await apiClient.post<User>('/users', userData);
    return data;
  },

  update: async (id: number, userData: Partial<User>): Promise<User> => {
    const { data } = await apiClient.patch<User>(`/users/${id}`, userData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  updateRoles: async (id: number, roleIds: number[]): Promise<User> => {
    const { data } = await apiClient.patch<User>(`/users/${id}/roles`, { roleIds });
    return data;
  },

  toggleActive: async (id: number): Promise<User> => {
    const { data } = await apiClient.patch<User>(`/users/${id}/toggle-active`);
    return data;
  },
};
