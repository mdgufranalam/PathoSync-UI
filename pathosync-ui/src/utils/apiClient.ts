// API Client utility for making authenticated requests

interface ApiClientConfig {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || '/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders
    };
  }

  // Get stored tokens
  private getTokens() {
    try {
      const storedTokens = localStorage.getItem('healthcareSaas_tokens');
      return storedTokens ? JSON.parse(storedTokens) : null;
    } catch (error) {
      console.error('Error parsing stored tokens:', error);
      return null;
    }
  }

  // Get authorization headers
  private getAuthHeaders(): Record<string, string> {
    const tokens = this.getTokens();
    const headers: Record<string, string> = {};

    if (tokens?.accessToken) {
      headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }

    if (tokens?.sessionId) {
      headers['X-Session-ID'] = tokens.sessionId;
    }

    return headers;
  }

  // Make authenticated request
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized - token expired
      if (response.status === 401) {
        // Attempt to refresh token
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request with new token
          const retryConfig: RequestInit = {
            ...options,
            headers: {
              ...this.defaultHeaders,
              ...this.getAuthHeaders(),
              ...options.headers
            }
          };
          const retryResponse = await fetch(url, retryConfig);
          const retryData = await retryResponse.json();
          return retryData;
        } else {
          // Refresh failed, redirect to login
          this.handleAuthFailure();
          return { success: false, error: 'Authentication failed' };
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Refresh access token
  private async refreshAccessToken(): Promise<boolean> {
    const tokens = this.getTokens();
    if (!tokens?.refreshToken) {
      return false;
    }

    try {
      // Mock refresh token API call
      const response = await this.mockRefreshToken(tokens.refreshToken);
      
      if (response.success && response.tokens) {
        // Update stored tokens
        localStorage.setItem('healthcareSaas_tokens', JSON.stringify(response.tokens));
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    return false;
  }

  // Mock refresh token function
  private async mockRefreshToken(refreshToken: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 80% success rate for refresh
        if (Math.random() > 0.2) {
          const newTokens = {
            accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
              exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
              iat: Math.floor(Date.now() / 1000)
            }))}`,
            sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            refreshToken: refreshToken // Keep same refresh token
          };

          resolve({
            success: true,
            tokens: newTokens
          });
        } else {
          resolve({
            success: false,
            error: 'Refresh token expired'
          });
        }
      }, 500);
    });
  }

  // Handle authentication failure
  private handleAuthFailure() {
    // Clear tokens
    localStorage.removeItem('healthcareSaas_tokens');
    
    // Redirect to login page
    window.location.href = '/login';
  }

  // Public API methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint;
    return this.makeRequest<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // Upload file with authentication
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers = this.getAuthHeaders();
    // Remove Content-Type to let browser set it for FormData
    delete headers['Content-Type'];

    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers
    });
  }
}

// Create and export a default instance
export const apiClient = new ApiClient({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api'
});

// Export the class for custom instances
export { ApiClient };

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
    const tokens = localStorage.getItem('healthcareSaas_tokens');
    if (!tokens) return false;

    const parsed = JSON.parse(tokens);
    return !!(parsed.accessToken && parsed.sessionId);
  } catch {
    return false;
  }
};

// Utility function to get current user info from token
export const getCurrentUserFromToken = () => {
  try {
    const tokens = localStorage.getItem('healthcareSaas_tokens');
    if (!tokens) return null;

    const parsed = JSON.parse(tokens);
    if (!parsed.accessToken) return null;

    // Decode JWT payload (mock implementation)
    const payload = parsed.accessToken.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    
    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      exp: decoded.exp,
      iat: decoded.iat
    };
  } catch {
    return null;
  }
};

// Export types
export type { ApiResponse };