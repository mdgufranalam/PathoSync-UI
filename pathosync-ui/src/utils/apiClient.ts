/* eslint-disable @typescript-eslint/no-explicit-any */

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

class ApiClient {
    private baseURL: string;
    private defaultHeaders: Record<string, string>;

    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    private getAuthHeaders(): Record<string, string> {
        const token = localStorage.getItem('authToken');
        const tenantId = localStorage.getItem('tenantId');
        const headers: Record<string, string> = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (tenantId) {
            headers['X-Tenant-ID'] = tenantId;
        }

        return headers;
    }

    private async request<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            ...this.defaultHeaders,
            ...this.getAuthHeaders(),
            ...options.headers,
        };

        try {
            const response = await fetch(url, { ...options, headers });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
                return {
                    success: false,
                    error: errorData.error || `Request failed with status ${response.status}`,
                };
            }

            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return { success: true, data: undefined };
            }

            const data = await response.json();
            return { success: true, data };

        } catch (err: unknown) {
            console.error('API Client Error:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            return { success: false, error: errorMessage };
        }
    }

    public get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
        const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint;
        return this.request<T>(url, { method: 'GET' });
    }

    public post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) });
    }

    public put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) });
    }

    public delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const apiClient = new ApiClient('http://localhost:3001/api');
