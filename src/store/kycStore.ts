import { create } from 'zustand';
import { KYCStatusResponse, KYCUploadURLsResponse } from '../types/api';

interface KYCState {
  kycStatus: KYCStatusResponse | null;
  uploadUrls: KYCUploadURLsResponse | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  setKYCStatus: (status: KYCStatusResponse) => void;
  setUploadUrls: (urls: KYCUploadURLsResponse) => void;
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  clearKYC: () => void;
}

export const useKYCStore = create<KYCState>((set) => ({
  kycStatus: null,
  uploadUrls: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  setKYCStatus: (status: KYCStatusResponse) => {
    set({ kycStatus: status, error: null });
  },

  setUploadUrls: (urls: KYCUploadURLsResponse) => {
    set({ uploadUrls: urls, error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setSubmitting: (submitting: boolean) => {
    set({ isSubmitting: submitting });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearKYC: () => {
    set({
      kycStatus: null,
      uploadUrls: null,
      error: null,
      isLoading: false,
      isSubmitting: false,
    });
  },
}));

