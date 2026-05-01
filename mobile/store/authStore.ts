import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { User } from '../types';

const TOKEN_KEY = 'serein_token';
const USER_KEY  = 'serein_user';

interface AuthState {
  token:     string | null;
  user:      User   | null;
  isLoading: boolean;

  /** Called once on app launch to rehydrate from SecureStore */
  loadAuth: () => Promise<void>;
  setAuth:  (token: string, user: User) => void;
  clearAuth: () => void;
  setUser:  (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token:     null,
  user:      null,
  isLoading: true,

  loadAuth: async () => {
    try {
      const [token, userStr] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);
      const user: User | null = userStr ? (JSON.parse(userStr) as User) : null;
      set({ token, user, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setAuth: (token, user) => {
    // Persist — fire-and-forget (non-blocking UI)
    SecureStore.setItemAsync(TOKEN_KEY, token).catch(console.error);
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)).catch(console.error);
    set({ token, user });
  },

  clearAuth: () => {
    SecureStore.deleteItemAsync(TOKEN_KEY).catch(console.error);
    SecureStore.deleteItemAsync(USER_KEY).catch(console.error);
    set({ token: null, user: null });
  },

  setUser: (user) => {
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)).catch(console.error);
    set({ user });
  },
}));
