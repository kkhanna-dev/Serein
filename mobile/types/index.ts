// ─── Shared TypeScript types ──────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  university?: string;
  country?: string;
  streakDays: number;
  createdAt: string;
}

export type MoodValue = 1 | 2 | 3 | 4 | 5;
export type MoodLabel = 'very_low' | 'low' | 'neutral' | 'good' | 'great';

export interface JournalEntry {
  _id: string;
  content: string;
  mood: MoodValue;
  moodLabel: MoodLabel;
  tags: string[];
  date: string;
  createdAt: string;
}

export interface MoodEntry {
  _id: string;
  mood: MoodValue;
  note?: string;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  /** Local-only identifier for list rendering */
  localId?: string;
}

export interface ChatSession {
  _id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  entries: T[];
  total: number;
  page: number;
  pages: number;
}
