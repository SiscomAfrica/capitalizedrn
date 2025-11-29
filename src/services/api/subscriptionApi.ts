import apiClient from '../../config/api';

// Types for subscription API
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  duration_days: number;
  features: {
    api_access: boolean;
    max_investments: string;
    priority_support: boolean;
    advanced_analytics: boolean;
    portfolio_tracking: boolean;
    email_notifications: boolean;
    withdrawal_requests: string;
    investment_calculator: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlansResponse {
  plans: SubscriptionPlan[];
}

export interface SubscriptionPlanDetailsResponse extends SubscriptionPlan {}

export interface SubscribeRequest {
  plan_id: string;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
  subscription: any;
  payment_info: any;
}

export interface MySubscriptionResponse {
  subscription: {
    id: string;
    plan: SubscriptionPlan;
    status: string;
    start_date: string;
    end_date: string;
    days_remaining: number;
    auto_renew: boolean;
    is_trial: boolean;
  };
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message: string;
  subscription: any;
}

export interface StartTrialResponse {
  success: boolean;
  message: string;
  subscription: any;
}

/**
 * Subscription API Service
 * Handles all subscription-related API calls
 */
export const subscriptionApi = {

  getPlans: async (): Promise<SubscriptionPlansResponse> => {
    try {
      console.log('Fetching subscription plans...');
      const response = await apiClient.get<SubscriptionPlansResponse>('/subscriptions/plans');
      console.log('Plans fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  },


  getPlanDetails: async (planId: string): Promise<SubscriptionPlanDetailsResponse> => {
    try {
      console.log('Fetching plan details for:', planId);
      const response = await apiClient.get<SubscriptionPlanDetailsResponse>(
        `/subscriptions/plans/${planId}`
      );
      console.log('Plan details fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching plan details:', error);
      throw error;
    }
  },


  subscribe: async (planId: string): Promise<SubscribeResponse> => {
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💳 subscriptionApi.subscribe() called');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📤 API Request Details:');
      console.log('  - Endpoint: POST /subscriptions/subscribe');
      console.log('  - Plan ID:', planId);
      console.log('  - Request Body:', JSON.stringify({ plan_id: planId }, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const response = await apiClient.post<SubscribeResponse>('/subscriptions/subscribe', {
        plan_id: planId,
      });
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ subscriptionApi.subscribe() successful');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📥 API Response:');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('  - HTTP Status:', response.status);
      console.log('  - Status Text:', response.statusText);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return response.data;
    } catch (error) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('❌ subscriptionApi.subscribe() failed');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Error:', error);
      throw error;
    }
  },


  getMySubscription: async (): Promise<MySubscriptionResponse> => {
    try {
      console.log('📋 Fetching user subscription...');
      const response = await apiClient.get<MySubscriptionResponse>('/subscriptions/my-subscription');
      console.log('✅ User subscription fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user subscription:', error);
      throw error;
    }
  },


  cancelSubscription: async (): Promise<CancelSubscriptionResponse> => {
    try {
      console.log('🚫 Cancelling subscription...');
      const response = await apiClient.post<CancelSubscriptionResponse>('/subscriptions/cancel');
      console.log('✅ Subscription cancelled successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error cancelling subscription:', error);
      throw error;
    }
  },


  startTrial: async (): Promise<StartTrialResponse> => {
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎁 subscriptionApi.startTrial() called');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📤 API Request Details:');
      console.log('  - Endpoint: POST /subscriptions/start-trial');
      console.log('  - Request Body: (empty - no payload required)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const response = await apiClient.post<StartTrialResponse>('/subscriptions/start-trial');
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ subscriptionApi.startTrial() successful');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📥 API Response:');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('  - HTTP Status:', response.status);
      console.log('  - Status Text:', response.statusText);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return response.data;
    } catch (error) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('❌ subscriptionApi.startTrial() failed');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Error:', error);
      throw error;
    }
  },
};

