import { apiClient } from './client';
import type { StudySession, SessionAnswer, StudyMode } from '../types';

export const sessionsApi = {
  create: async (topicId: number, mode: StudyMode): Promise<StudySession> => {
    const { data } = await apiClient.post<StudySession>('/study-sessions', {
      topicId,
      mode,
    });
    return data;
  },

  getAll: async (): Promise<StudySession[]> => {
    const { data } = await apiClient.get<StudySession[]>('/study-sessions');
    return data;
  },

  getById: async (id: number): Promise<StudySession> => {
    const { data } = await apiClient.get<StudySession>(`/study-sessions/${id}`);
    return data;
  },

  addAnswer: async (
    sessionId: number,
    answer: {
      questionId: number;
      wasCorrect: boolean;
      userAnswer?: string;
      audioUrl?: string;
      timeSpent?: number;
    }
  ): Promise<SessionAnswer> => {
    const { data } = await apiClient.post<SessionAnswer>(
      `/study-sessions/${sessionId}/answer`,
      answer
    );
    return data;
  },

  endSession: async (sessionId: number): Promise<StudySession> => {
    const { data } = await apiClient.patch<StudySession>(
      `/study-sessions/${sessionId}/end`
    );
    return data;
  },
};
