import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/api';
import { UserResponse } from '../types/api';

interface UserState {
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: UserResponse) => Promise<void>;
  updateUser: (updates: Partial<UserResponse>) => void;
  clearUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: async (user: UserResponse) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      set({ user, error: null });
    } catch (error) {
      console.error('Error saving user data:', error);
      set({ error: 'Failed to save user data' });
    }
  },

  updateUser: (updates: Partial<UserResponse>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      get().setUser(updatedUser);
    }
  },

  clearUser: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      set({ user: null, error: null });
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        set({ user: JSON.parse(userData), error: null });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      set({ error: 'Failed to load user data' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

