// tests/sdk.test.ts
import axios from 'axios';
import { InturaClient } from '../src';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MySDK', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocked axios implementation
    mockedAxios.create.mockReturnValue(mockedAxios as any);
  });

  test('should initialize with default options', () => {
    const sdk = new InturaClient({ apiKey: 'test-api-key' });
    
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.myservice.com/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
      },
    });
  });

  test('should get a resource by ID', async () => {
    const mockResponse = {
      data: { id: '123', name: 'Test Resource' },
    };
    
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    
    const sdk = new InturaClient({ apiKey: 'test-api-key' });
    const result = await sdk.getResource('123');
    
    expect(mockedAxios.get).toHaveBeenCalledWith('/resources/123', { params: undefined, headers: undefined });
    expect(result).toEqual(mockResponse.data);
  });

  test('should create a resource', async () => {
    const mockResponse = {
      data: { id: '123', name: 'New Resource' },
    };
    
    mockedAxios.post.mockResolvedValueOnce(mockResponse);
    
    const sdk = new InturaClient({ apiKey: 'test-api-key' });
    const resourceData = { name: 'New Resource' };
    const result = await sdk.createResource(resourceData);
    
    expect(mockedAxios.post).toHaveBeenCalledWith('/resources', resourceData, { headers: undefined });
    expect(result).toEqual(mockResponse.data);
  });

  test('should handle API errors correctly', async () => {
    const errorResponse = {
      response: {
        status: 400,
        data: {
          message: 'Bad Request',
        },
      },
    };
    
    mockedAxios.get.mockRejectedValueOnce(errorResponse);
    
    const sdk = new InturaClient({ apiKey: 'test-api-key' });
    
    await expect(sdk.getResource('123')).rejects.toThrow('API Error: 400 - Bad Request');
  });
});