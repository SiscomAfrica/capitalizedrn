export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  title?: string;
  company?: string;
  profileImage?: string;
  isVerified: boolean;
  kycCompleted: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  subscriptionStatus: 'active' | 'inactive' | 'expired';
  subscriptionExpiry?: Date;
}

export interface Investment {
  id: string;
  title: string;
  description: string;
  category: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  minInvestment: number;
  targetAmount: number;
  raisedAmount: number;
  expectedReturn: number;
  risks: string[];
  image: string;
  status: 'active' | 'closed' | 'upcoming';
}

export interface UserInvestment {
  id: string;
  investmentId: string;
  investment: Investment;
  amount: number;
  date: Date;
  status: 'pending' | 'confirmed' | 'failed';
  returns: number;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  benefits: string[];
  isActive: boolean;
}

export interface CommunityMember {
  id: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

export interface KYCData {
  idNumber: string;
  idPhoto?: string;
  selfiePhoto?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt?: Date;
  reviewedAt?: Date;
}

export type RootStackParamList = {
  Auth: undefined;
  ProfileCompletion: undefined;
  KYC: undefined;
  Subscription: undefined;
  MainTabs: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Registration: undefined;
  VerifyCode: { email: string; phone: string };
  KYC: undefined;
};

export type MainTabParamList = {
  Investments: undefined;
  Portfolio: undefined;
  Community: undefined;
  Profile: undefined;
};

export type InvestmentsStackParamList = {
  InvestmentList: undefined;
  InvestmentDetails: { investmentId: string };
  InvestmentConfirmation: { investmentId: string; amount: number };
};

