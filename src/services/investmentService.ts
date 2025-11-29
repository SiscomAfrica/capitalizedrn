import { apiClient } from '../config/api';
import {
  InvestmentProduct,
  InvestmentProductsResponse,
  InvestmentProductParams,
  InvestmentCategory,
  InvestmentProjection,
  InvestmentProjectionRequest,
  CreateInvestmentRequest,
  UserInvestmentResponse,
} from '../types/api';

const INVESTMENT_BASE_URL = 'https://api.siscom.com/api/v1/investments';

export const investmentService = {
  /**
   * Get paginated list of investment products with optional filtering
   */
  getProducts: async (params?: InvestmentProductParams): Promise<InvestmentProductsResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.category) queryParams.append('category', params.category);
      if (params?.investment_type) queryParams.append('investment_type', params.investment_type);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.min_price) queryParams.append('min_price', params.min_price.toString());
      if (params?.max_price) queryParams.append('max_price', params.max_price.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

      const url = `${INVESTMENT_BASE_URL}/products/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log('🔍 Fetching investment products:', url);
      
      const response = await apiClient.get<InvestmentProductsResponse>(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching investment products:', error);
      throw error;
    }
  },

  /**
   * Get list of investment categories
   */
  getCategories: async (activeOnly: boolean = true): Promise<InvestmentCategory[]> => {
    try {
      const url = `${INVESTMENT_BASE_URL}/products/categories?active_only=${activeOnly}`;
      
      console.log('🔍 Fetching investment categories:', url);
      
      const response = await apiClient.get<InvestmentCategory[]>(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching investment categories:', error);
      throw error;
    }
  },

  /**
   * Get detailed information about a specific product
   */
  getProductDetails: async (slug: string): Promise<InvestmentProduct> => {
    try {
      const url = `${INVESTMENT_BASE_URL}/products/${slug}`;
      
      console.log('🔍 Fetching product details:', url);
      
      const response = await apiClient.get<InvestmentProduct>(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching product details:', error);
      throw error;
    }
  },

  /**
   * Calculate investment projection for a specific product
   */
  getProjection: async (slug: string, amount: number): Promise<InvestmentProjection> => {
    try {
      const url = `${INVESTMENT_BASE_URL}/products/${slug}/projection`;
      
      console.log('🔍 Calculating investment projection:', { slug, amount });
      
      const request: InvestmentProjectionRequest = { amount };
      const response = await apiClient.post<InvestmentProjection>(url, request);
      return response.data;
    } catch (error) {
      console.error('❌ Error calculating projection:', error);
      throw error;
    }
  },

  /**
   * Create a new investment
   */
  createInvestment: async (data: CreateInvestmentRequest): Promise<UserInvestmentResponse> => {
    try {
      const url = `${INVESTMENT_BASE_URL}/investments`;
      
      console.log('🔍 Creating investment:', data);
      
      const response = await apiClient.post<UserInvestmentResponse>(url, data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating investment:', error);
      throw error;
    }
  },

  /**
   * Get user's portfolio (all investments)
   */
  getUserPortfolio: async (): Promise<UserInvestmentResponse[]> => {
    try {
      const url = `${INVESTMENT_BASE_URL}/investments/portfolio`;
      
      console.log('🔍 Fetching user portfolio');
      
      const response = await apiClient.get<UserInvestmentResponse[]>(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching portfolio:', error);
      throw error;
    }
  },
};

