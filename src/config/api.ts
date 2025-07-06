const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (refreshResponse.ok) {
            const { access } = await refreshResponse.json();
            localStorage.setItem('access_token', access);
            
            // Retry original request with new token
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${access}`,
            };
            const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);
            if (retryResponse.ok) {
              return retryResponse.json();
            }
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
      
      // If refresh fails, clear tokens and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};