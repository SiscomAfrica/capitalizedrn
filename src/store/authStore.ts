import { create } from 'zustand';
import { tokenManager } from '../config/api';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  setTokensOnly: (accessToken: string, refreshToken: string) => Promise<void>;
  setAuthenticated: (authenticated: boolean) => void;
  clearAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  error: null,

  setTokens: async (accessToken: string, refreshToken: string) => {
    await tokenManager.setTokens(accessToken, refreshToken);
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
      error: null,
    });
  },

  setTokensOnly: async (accessToken: string, refreshToken: string) => {
    await tokenManager.setTokens(accessToken, refreshToken);
    set({
      accessToken,
      refreshToken,
      error: null,
    });
  },

  setAuthenticated: (authenticated: boolean) => {
    set({ isAuthenticated: authenticated });
  },

  clearAuth: async () => {
    await tokenManager.clearAll();
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  initialize: async () => {
    try {
      set({ isLoading: true });
      const accessToken = await tokenManager.getAccessToken();
      const refreshToken = await tokenManager.getRefreshToken();

      if (accessToken && refreshToken) {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

