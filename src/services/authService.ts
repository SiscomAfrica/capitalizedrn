// Mock authentication service
export const authService = {
  sendVerificationCode: async (email: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Verification code sent to ${email}`);
        resolve(true);
      }, 1000);
    });
  },

  verifyCode: async (email: string, code: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock verification - accept any 6-digit code
        const isValid = code.length === 6;
        resolve(isValid);
      }, 1000);
    });
  },

  completeOnboarding: async (userData: {
    email: string;
    about?: string;
    jobTitle?: string;
    company?: string;
  }): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Onboarding completed:', userData);
        resolve(true);
      }, 1000);
    });
  },

  logout: async (): Promise<void> => {
    // Simulate logout
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('User logged out');
        resolve();
      }, 500);
    });
  },
};

