import { create } from 'zustand';
import { journalApi, moodApi } from '../services/api';
import type { JournalEntry, MoodEntry } from '../types';
import type { CreateEntryPayload } from '../services/api';
import type { MoodValue } from '../types';

interface JournalState {
  entries:      JournalEntry[];
  moodHistory:  MoodEntry[];
  isLoading:    boolean;
  isSaving:     boolean;
  totalEntries: number;
  currentPage:  number;

  fetchEntries:    (page?: number) => Promise<void>;
  fetchMoreEntries: () => Promise<void>;
  createEntry:     (payload: CreateEntryPayload) => Promise<void>;
  deleteEntry:     (id: string) => Promise<void>;
  fetchMoodHistory: (days?: number) => Promise<void>;
  logMood:         (mood: MoodValue, note?: string) => Promise<void>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries:      [],
  moodHistory:  [],
  isLoading:    false,
  isSaving:     false,
  totalEntries: 0,
  currentPage:  1,

  fetchEntries: async (page = 1) => {
    set({ isLoading: true });
    try {
      const res = await journalApi.getEntries(page, 20);
      set({
        entries:      page === 1 ? res.data.entries : [...get().entries, ...res.data.entries],
        totalEntries: res.data.total,
        currentPage:  page,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMoreEntries: async () => {
    const { currentPage, totalEntries, entries, isLoading } = get();
    if (isLoading || entries.length >= totalEntries) return;
    await get().fetchEntries(currentPage + 1);
  },

  createEntry: async (payload) => {
    set({ isSaving: true });
    try {
      const res = await journalApi.createEntry(payload);
      set((state) => ({
        entries:      [res.data.entry, ...state.entries],
        totalEntries: state.totalEntries + 1,
      }));
    } finally {
      set({ isSaving: false });
    }
  },

  deleteEntry: async (id) => {
    await journalApi.deleteEntry(id);
    set((state) => ({
      entries:      state.entries.filter((e) => e._id !== id),
      totalEntries: state.totalEntries - 1,
    }));
  },

  fetchMoodHistory: async (days = 7) => {
    const res = await moodApi.getHistory(days);
    set({ moodHistory: res.data.entries });
  },

  logMood: async (mood, note) => {
    const res = await moodApi.logMood(mood, note);
    set((state) => ({ moodHistory: [...state.moodHistory, res.data.entry] }));
  },
}));
