import { Investment } from '../types';
import { mockInvestments } from './mockData';

export const investmentService = {
  getAllInvestments: async (): Promise<Investment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockInvestments);
      }, 500);
    });
  },

  getFeaturedInvestments: async (): Promise<Investment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockInvestments.filter((inv) => inv.isFeatured));
      }, 500);
    });
  },

  getInvestmentById: async (id: string): Promise<Investment | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const investment = mockInvestments.find((inv) => inv.id === id);
        resolve(investment || null);
      }, 500);
    });
  },

  expressInterest: async (investmentId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Expressed interest in investment: ${investmentId}`);
        resolve(true);
      }, 500);
    });
  },
};

