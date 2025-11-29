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
  isFeatured?: boolean;
  interested?: number;
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

export interface Session {
  id?: string;
  title: string;
  speaker: string;
  date: string;
  time: string;
  tags: string[];
}

export interface Speaker {
  id?: string;
  name: string;
  title: string;
  company: string;
  bio?: string;
  image?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image: string;
  sessions: Session[];
  speakers: Speaker[];
}

export interface Transaction {
  id: string;
  type: 'investment' | 'return';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
  description: string;
  investmentId?: string;
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
  PlanDetails: { planId: string };
  MySubscription: undefined;
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

