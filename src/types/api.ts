// API Request Types
export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
  phone: string;
}

export interface VerifyPhoneRequest {
  otp: string;
  phone: string;
}

export interface ResendOtpRequest {
  phone: string;
}

export interface LoginRequest {
  identifier: string; // Can be email or phone
  password: string;
}

export interface UpdateProfileRequest {
  address?: string;
  city?: string;
  country?: string;
  date_of_birth?: string; // ISO 8601 format
}

export interface SubmitKYCRequest {
  id_back_url: string;
  id_front_url: string;
  id_number: string;
  id_type: 'national_id' | 'passport' | 'drivers_license';
  selfie_url: string;
}

// API Response Types
export interface RegisterResponse {
  user_id: string;
  email: string;
  phone: string;
  message: string;
  otp_sent: boolean;
}

export interface VerifyPhoneResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    phone_verified: boolean;
    phone_verified_at: string | null;
    profile_completed: boolean;
    date_of_birth: string | null;
    country: string | null;
    city: string | null;
    address: string | null;
    kyc_status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
    kyc_submitted_at: string | null;
    kyc_reviewed_at: string | null;
    kyc_rejection_reason: string | null;
    is_active: boolean;
    is_verified: boolean;
    can_invest: boolean;
    created_at: string;
    updated_at: string;
    last_login: string;
  };
}

export interface UserResponse {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  phone_verified: boolean;
  phone_verified_at: string | null;
  profile_completed: boolean;
  date_of_birth: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  kyc_status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  kyc_submitted_at: string | null;
  kyc_reviewed_at: string | null;
  kyc_rejection_reason: string | null;
  has_subscription?: boolean; 
  subscription_active?: boolean;
  subscription_expires_at?: string | null;
  is_active: boolean;
  is_verified: boolean;
  can_invest: boolean;
  created_at: string;
  updated_at: string;
  last_login: string;
}

export interface UpdateProfileResponse {
  id: string;
  full_name: string;
  date_of_birth: string;
  country: string;
  city: string;
  address: string;
  profile_completed: boolean;
}

export interface DocumentUploadURL {
  upload_url: string;
  s3_url: string;
}

export interface KYCUploadURLsResponse {
  id_front: DocumentUploadURL;
  id_back: DocumentUploadURL;
  selfie: DocumentUploadURL;
  expires_in: number;
}

export interface KYCSubmitResponse {
  success: boolean;
  message: string;
  kyc_status: 'pending' | 'approved' | 'rejected';
}

export interface KYCStatusResponse {
  status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  submitted_at?: string;
  reviewed_at?: string;
  can_invest: boolean;
}

// Error Response Type
export interface APIErrorResponse {
  error?: string;
  message?: string;
  detail?: string;
}

// Investment Product Types
export type InvestmentType = 'micro-node' | 'mega-node' | 'full-node' | 'terranode';
export type ProductStatus = 'active' | 'draft' | 'funding_complete' | 'cancelled';

export interface InvestmentProduct {
  id: string;
  name: string;
  slug: string;
  investment_type: InvestmentType;
  price_per_unit: number;
  minimum_investment: number;
  expected_annual_return: number;
  status: ProductStatus;
  description?: string;
  investment_duration_months?: number;
  features?: string[];
  technical_specs?: Record<string, any>;
  category?: InvestmentCategory;
}

export interface InvestmentCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

export interface InvestmentProductsResponse {
  products: InvestmentProduct[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface InvestmentProductParams {
  category?: string;
  investment_type?: InvestmentType;
  status?: ProductStatus;
  min_price?: number;
  max_price?: number;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface YearlyReturn {
  year: number;
  return: number;
  cumulative: number;
}

export interface InvestmentProjection {
  investment_amount: number;
  investment_type: InvestmentType;
  duration_years: number;
  yearly_returns: YearlyReturn[];
  total_return: number;
  final_value: number;
  roi_percentage: number;
}

export interface InvestmentProjectionRequest {
  amount: number;
}

export interface CreateInvestmentRequest {
  product_slug: string;
  amount: number;
  payment_method?: string;
}

export interface UserInvestmentResponse {
  id: string;
  product: InvestmentProduct;
  amount: number;
  units: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  expected_return: number;
  current_value: number;
}

