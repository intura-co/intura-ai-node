// src/index.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface InturaSDKOptions {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export class InturaClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(options: InturaSDKOptions) {
    this.apiKey = options.apiKey;
    
    const config: AxiosRequestConfig = {
      baseURL: options.baseURL || 'https://intura-be-external-server-566556985624.asia-southeast2.run.app',
      timeout: options.timeout || 10000,
      headers: {
        'x-request-id': uuidv4(),
        'x-timestamp': String(Date.now()),
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
      }
      
    };
    
    this.client = axios.create(config);
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle API errors here
        const response = error.response;
        if (response && response.data) {
          const errorData = response.data;
          throw new Error(`API Error: ${response.status} - ${errorData.message || JSON.stringify(errorData)}`);
        }
        throw error;
      }
    );
  }

  async getDetailExperiment(experimentId: string, options?: RequestOptions): Promise<any> {
    const response = await this.client.get(`/v1/experiment/detail?experiment_id=${experimentId}`, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  }

  async buildChatModel(data: any, experiment_id: string, options?: RequestOptions): Promise<any> {
    const response = await this.client.post(`/v1/experiment/build/chat?experiment_id=${experiment_id}`, data, {
      headers: options?.headers,
    });
    return response.data.data;
  }

  async invoke(data: any, options?: RequestOptions): Promise<any> {
    const response = await this.client.post(`/v1/experiment/inference/chat`, data, {
      headers: options?.headers,
    });
    return response.data.data;
  }


  /**
   * Get a resource by ID
   */
  async getResource(id: string, options?: RequestOptions): Promise<any> {
    const response = await this.client.get(`/resources/${id}`, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  }

  /**
   * Create a new resource
   */
  async createResource(data: any, options?: RequestOptions): Promise<any> {
    const response = await this.client.post('/resources', data, {
      headers: options?.headers,
    });
    return response.data;
  }

  /**
   * Update an existing resource
   */
  async updateResource(id: string, data: any, options?: RequestOptions): Promise<any> {
    const response = await this.client.put(`/resources/${id}`, data, {
      headers: options?.headers,
    });
    return response.data;
  }

  /**
   * Delete a resource
   */
  async deleteResource(id: string, options?: RequestOptions): Promise<void> {
    await this.client.delete(`/resources/${id}`, {
      headers: options?.headers,
    });
  }

  /**
   * List resources with pagination
   */
  async listResources(options?: RequestOptions & { page?: number; limit?: number }): Promise<any> {
    const params = {
      page: options?.page || 1,
      limit: options?.limit || 20,
      ...options?.params,
    };
    
    const response = await this.client.get('/resources', {
      params,
      headers: options?.headers,
    });
    return response.data;
  }
}

// Export default and named exports
export default InturaClient;