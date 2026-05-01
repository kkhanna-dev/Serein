import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '../store/authStore';
import type {
  User,
  JournalEntry,
  MoodEntry,
  ChatSession,
  PaginatedResponse,
} from '../types';

const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ||
  process.env.EXPO_PUBLIC_API_URL ||
  'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30_000,
});

// ── Attach JWT on every request ───────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auto-logout on 401 ────────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  },
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  university?: string;
  country?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  me: () => api.get<{ user: User }>('/auth/me'),
};

// ── Journal ───────────────────────────────────────────────────────────────────
export interface CreateEntryPayload {
  content: string;
  mood: number;
  tags?: string[];
  date?: string;
}

export const journalApi = {
  getEntries: (page = 1, limit = 20) =>
    api.get<PaginatedResponse<JournalEntry>>('/journal', { params: { page, limit } }),
  createEntry: (data: CreateEntryPayload) =>
    api.post<{ entry: JournalEntry }>('/journal', data),
  deleteEntry: (id: string) =>
    api.delete<{ message: string }>(`/journal/${id}`),
};

// ── Mood ──────────────────────────────────────────────────────────────────────
export const moodApi = {
  getHistory: (days = 7) =>
    api.get<{ entries: MoodEntry[] }>('/mood/history', { params: { days } }),
  logMood: (mood: number, note?: string) =>
    api.post<{ entry: MoodEntry }>('/mood', { mood, note }),
};

// ── Chat ──────────────────────────────────────────────────────────────────────
export const chatApi = {
  sendMessage: (message: string, sessionId?: string) =>
    api.post<{ response: string; sessionId: string }>('/chat/message', {
      message,
      sessionId,
    }),
  getSessions: () =>
    api.get<{ sessions: Pick<ChatSession, '_id' | 'title' | 'createdAt' | 'updatedAt'>[] }>(
      '/chat/sessions',
    ),
  getSession: (id: string) =>
    api.get<{ session: ChatSession }>(`/chat/sessions/${id}`),
};

export default api;
