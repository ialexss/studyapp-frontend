export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  permissions?: Permission[];
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Topic {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  parentId: number | null;
  userId?: number | null;
  isPublic?: boolean;
  order: number;
  isActive: boolean;
  children?: Topic[];
  questions?: Question[];
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface Question {
  id: number;
  topicId: number;
  topic?: Topic;
  question: string;
  answer: string;
  keyPoints: string[];
  difficulty: QuestionDifficulty;
  tags: string[];
  isQuickReview: boolean;
  order: number;
  isActive: boolean;
}

export interface UserProgress {
  id: number;
  userId: number;
  questionId: number;
  question?: Question;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  timesReviewed: number;
  timesCorrect: number;
  timesIncorrect: number;
  lastReviewedAt: string;
}

export interface UserStreak {
  id: number;
  userId: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
}

export enum StudyMode {
  FLASHCARD = 'flashcard',
  EXAM = 'exam',
  QUICK_REVIEW = 'quick-review',
}

export interface StudySession {
  id: number;
  userId: number;
  topicId: number;
  topic?: Topic;
  mode: StudyMode;
  startedAt: string;
  endedAt: string | null;
  duration: number;
  questionsReviewed: number;
  questionsCorrect: number;
  questionsIncorrect: number;
  isCompleted: boolean;
  answers?: SessionAnswer[];
}

export interface SessionAnswer {
  id: number;
  sessionId: number;
  questionId: number;
  question?: Question;
  wasCorrect: boolean;
  userAnswer: string | null;
  audioUrl: string | null;
  timeSpent: number;
  answeredAt: string;
}

export interface Statistics {
  totalQuestions: number;
  totalReviews: number;
  totalCorrect: number;
  totalIncorrect: number;
  successRate: number;
  totalMastered: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: number;
  totalSessions: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
