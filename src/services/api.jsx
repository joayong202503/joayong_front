const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.yourdomain.com';

// Default request options
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper to get the auth token
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token || '';
};

// Add auth header to requests
const authHeader = () => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    // Try to get error message from response
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || '요청 처리 중 오류가 발생했습니다';
    } catch (e) {
      errorMessage = '서버 오류가 발생했습니다';
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json();
};

// API methods
const apiService = {
  // Auth endpoints
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    },
    
    signup: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        ...defaultOptions,
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
    
    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          ...defaultOptions.headers,
          ...authHeader(),
        },
      });
      return handleResponse(response);
    },
  },
  
  // Other API endpoints can be added here
  user: {
    getProfile: async () => {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          ...defaultOptions.headers,
          ...authHeader(),
        },
      });
      return handleResponse(response);
    },
    
    updateProfile: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          ...defaultOptions.headers,
          ...authHeader(),
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
  },
};

export default apiService;