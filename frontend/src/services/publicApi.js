import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URLL || 'http://localhost:5000';

// Create axios instance for public API calls
const publicApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Public API endpoints
export const publicApiService = {
  // Get all investment plans and categories (no auth required)
  getInvestmentPlans: async () => {
    try {
      const response = await publicApi.get('/api/plans/public');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch investment plans');
    }
  },

  // Submit contact form
  submitContactForm: async (formData) => {
    try {
      // This would typically send to a contact endpoint
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Message sent successfully' };
    } catch (error) {
      throw new Error('Failed to send message');
    }
  },

  // Get company statistics (for landing page)
  getCompanyStats: async () => {
    try {
      // This would typically fetch real stats from backend
      // For now, we'll return mock data
      return {
        totalUsers: 5247,
        totalInvestments: 52470000,
        successRate: 98.5,
        plansAvailable: 12
      };
    } catch (error) {
      throw new Error('Failed to fetch company statistics');
    }
  }
};

export default publicApiService;