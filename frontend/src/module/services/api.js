import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for AI requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw error;
  }
);

// AI Content Generation Services
export const aiService = {
  // Generate content using chat-based prompting
  async generateChatContent(prompt, options = {}) {
    try {
      const payload = {
        prompt,
        contentType: options.contentType || 'general',
        tone: options.tone || 'professional',
        audience: options.audience || 'general',
        ...options
      };

      console.log('Generating content with payload:', payload);
      
      const response = await api.post('/ai/generate/chat', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to generate chat content:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate content');
    }
  },

  // Generate content with conversation context
  async generateContextualContent(prompt, previousMessages = [], options = {}) {
    try {
      const payload = {
        prompt,
        previousMessages,
        contentType: options.contentType || 'general',
        maxLength: options.maxLength,
        includeExamples: options.includeExamples || false,
        ...options
      };

      const response = await api.post('/ai/generate/context', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to generate contextual content:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate contextual content');
    }
  },

  // Check AI service health
  async checkHealth() {
    try {
      const response = await api.get('/ai/health');
      return response.data;
    } catch (error) {
      console.error('AI service health check failed:', error);
      return { success: false, error: error.message };
    }
  }
};

// Legacy content service
export const contentService = {
  async getContent() {
    const response = await api.get('/content');
    return response.data;
  },

  async saveContent(content) {
    const response = await api.post('/content', content);
    return response.data;
  }
};

export default api;
