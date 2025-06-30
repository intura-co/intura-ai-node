// src/index.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';

/**
 * @beta
 * @warning This SDK is currently in beta and under active development.
 * APIs may change without notice and additional features are still in development.
 * Use with caution in production environments.
 */

export interface InturaSDKOptions {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

/**
 * @beta
 * @warning This client is currently in beta and under active development.
 * APIs may change without notice and additional features are still in development.
 * Use with caution in production environments.
 */
export class InturaClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(options: InturaSDKOptions) {
    this.apiKey = options.apiKey;
    
    const config: AxiosRequestConfig = {
      baseURL: options.baseURL || 'https://api.intura.co',
      timeout: options.timeout || 10000,
      headers: {
        'x-request-id': uuidv4(),
        'x-timestamp': String(Date.now()),
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
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

  /**
   * Get experiment details by ID
   * @beta This method is in beta and may change in future releases
   */
  async getDetailExperiment(experimentId: string, options?: RequestOptions): Promise<any> {
    const response = await this.client.get(`/v1/experiment/detail?experiment_id=${experimentId}`, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  }

  /**
   * Build a chat model for an experiment
   * @beta This method is in beta and may change in future releases
   */
  async buildChatModel(data: any, experiment_id: string, options?: RequestOptions): Promise<any> {
    const response = await this.client.post(`/v1/experiment/build/chat?experiment_id=${experiment_id}`, data, {
      headers: options?.headers,
    });
    return response.data.data;
  }

  /**
   * Generate inferences from an experiment
   * @beta This method is in beta and may change in future releases
   */
  async invoke(data: any, options?: RequestOptions): Promise<any> {
    const response = await this.client.post(`/v1/experiment/inference/chat`, data, {
      headers: options?.headers,
    });
    return response.data.data.length === 1 ? response.data.data[0] : response.data.data;
  }


  /**
   * Get a resource by ID
   * @beta This method is in beta and may change in future releases
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
   * @beta This method is in beta and may change in future releases
   */
  async createResource(data: any, options?: RequestOptions): Promise<any> {
    const response = await this.client.post('/resources', data, {
      headers: options?.headers,
    });
    return response.data;
  }

  /**
   * Update an existing resource
   * @beta This method is in beta and may change in future releases
   */
  async updateResource(id: string, data: any, options?: RequestOptions): Promise<any> {
    const response = await this.client.put(`/resources/${id}`, data, {
      headers: options?.headers,
    });
    return response.data;
  }

  /**
   * Delete a resource
   * @beta This method is in beta and may change in future releases
   */
  async deleteResource(id: string, options?: RequestOptions): Promise<void> {
    await this.client.delete(`/resources/${id}`, {
      headers: options?.headers,
    });
  }

  /**
   * List resources with pagination
   * @beta This method is in beta and may change in future releases
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