import { create } from 'zustand';
import {
  InvestmentProduct,
  InvestmentCategory,
  InvestmentProjection,
  InvestmentProductParams,
  UserInvestmentResponse,
} from '../types/api';
import { investmentService } from '../services/investmentService';

interface InvestmentState {
  // Products
  products: InvestmentProduct[];
  selectedProduct: InvestmentProduct | null;
  productsLoading: boolean;
  productsError: string | null;
  
  // Categories
  categories: InvestmentCategory[];
  categoriesLoading: boolean;
  
  // Projection
  projection: InvestmentProjection | null;
  projectionLoading: boolean;
  
  // Portfolio
  portfolio: UserInvestmentResponse[];
  portfolioLoading: boolean;
  portfolioError: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  
  // Filters
  filters: InvestmentProductParams;
  
  // Actions
  fetchProducts: (params?: InvestmentProductParams) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductDetails: (slug: string) => Promise<void>;
  calculateProjection: (slug: string, amount: number) => Promise<void>;
  fetchPortfolio: () => Promise<void>;
  setFilters: (filters: InvestmentProductParams) => void;
  clearFilters: () => void;
  clearSelectedProduct: () => void;
  clearProjection: () => void;
  resetState: () => void;
}

const initialFilters: InvestmentProductParams = {
  page: 1,
  page_size: 20,
  status: 'active',
};

export const useInvestmentStore = create<InvestmentState>((set, get) => ({
  // Initial state
  products: [],
  selectedProduct: null,
  productsLoading: false,
  productsError: null,
  
  categories: [],
  categoriesLoading: false,
  
  projection: null,
  projectionLoading: false,
  
  portfolio: [],
  portfolioLoading: false,
  portfolioError: null,
  
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  
  filters: initialFilters,
  
  // Fetch products with optional filters
  fetchProducts: async (params?: InvestmentProductParams) => {
    set({ productsLoading: true, productsError: null });
    
    try {
      const mergedParams = { ...get().filters, ...params };
      const response = await investmentService.getProducts(mergedParams);
      
      set({
        products: response.products,
        currentPage: response.page,
        totalPages: response.total_pages,
        totalProducts: response.total,
        productsLoading: false,
        filters: mergedParams,
      });
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      set({
        productsError: error.response?.data?.message || 'Failed to load investment products',
        productsLoading: false,
      });
    }
  },
  
  // Fetch categories
  fetchCategories: async () => {
    set({ categoriesLoading: true });
    
    try {
      const categories = await investmentService.getCategories(true);
      set({ categories, categoriesLoading: false });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      set({ categoriesLoading: false });
    }
  },
  
  // Fetch product details
  fetchProductDetails: async (slug: string) => {
    set({ productsLoading: true, productsError: null });
    
    try {
      const product = await investmentService.getProductDetails(slug);
      set({
        selectedProduct: product,
        productsLoading: false,
      });
    } catch (error: any) {
      console.error('Failed to fetch product details:', error);
      set({
        productsError: error.response?.data?.message || 'Failed to load product details',
        productsLoading: false,
      });
    }
  },
  
  // Calculate investment projection
  calculateProjection: async (slug: string, amount: number) => {
    set({ projectionLoading: true });
    
    try {
      const projection = await investmentService.getProjection(slug, amount);
      set({ projection, projectionLoading: false });
    } catch (error) {
      console.error('Failed to calculate projection:', error);
      set({ projectionLoading: false });
    }
  },
  
  // Fetch user portfolio
  fetchPortfolio: async () => {
    set({ portfolioLoading: true, portfolioError: null });
    
    try {
      const portfolio = await investmentService.getUserPortfolio();
      set({ portfolio, portfolioLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch portfolio:', error);
      set({
        portfolioError: error.response?.data?.message || 'Failed to load portfolio',
        portfolioLoading: false,
      });
    }
  },
  
  // Set filters
  setFilters: (filters: InvestmentProductParams) => {
    set({ filters: { ...get().filters, ...filters } });
  },
  
  // Clear filters
  clearFilters: () => {
    set({ filters: initialFilters });
  },
  
  // Clear selected product
  clearSelectedProduct: () => {
    set({ selectedProduct: null });
  },
  
  // Clear projection
  clearProjection: () => {
    set({ projection: null });
  },
  
  // Reset entire state
  resetState: () => {
    set({
      products: [],
      selectedProduct: null,
      productsLoading: false,
      productsError: null,
      categories: [],
      categoriesLoading: false,
      projection: null,
      projectionLoading: false,
      portfolio: [],
      portfolioLoading: false,
      portfolioError: null,
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      filters: initialFilters,
    });
  },
}));
