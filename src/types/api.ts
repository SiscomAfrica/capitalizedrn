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
  has_subscription?: boolean; // Track if user has chosen any subscription plan
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

