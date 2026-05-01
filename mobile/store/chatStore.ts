import { create } from 'zustand';
import { chatApi } from '../services/api';
import type { ChatMessage } from '../types';

let localId = 0;
function nextId() {
  return `local_${++localId}`;
}

interface ChatState {
  messages:  ChatMessage[];
  sessionId: string | null;
  isSending: boolean;

  sendMessage: (text: string) => Promise<void>;
  startNewSession: () => void;
  loadSession: (id: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages:  [],
  sessionId: null,
  isSending: false,

  sendMessage: async (text) => {
    const userMsg: ChatMessage = {
      role:    'user',
      content: text,
      localId: nextId(),
      timestamp: new Date().toISOString(),
    };

    set((s) => ({ messages: [...s.messages, userMsg], isSending: true }));

    try {
      const res = await chatApi.sendMessage(text, get().sessionId ?? undefined);
      const aiMsg: ChatMessage = {
        role:    'assistant',
        content: res.data.response,
        localId: nextId(),
        timestamp: new Date().toISOString(),
      };
      set((s) => ({
        messages:  [...s.messages, aiMsg],
        sessionId: res.data.sessionId,
      }));
    } catch (err: unknown) {
      const errMsg: ChatMessage = {
        role:    'assistant',
        content: 'Sorry, I had trouble connecting. Please check your connection and try again.',
        localId: nextId(),
        timestamp: new Date().toISOString(),
      };
      set((s) => ({ messages: [...s.messages, errMsg] }));
      throw err;
    } finally {
      set({ isSending: false });
    }
  },

  startNewSession: () => {
    set({ messages: [], sessionId: null });
  },

  loadSession: async (id) => {
    const res = await chatApi.getSession(id);
    set({ messages: res.data.session.messages, sessionId: id });
  },
}));
