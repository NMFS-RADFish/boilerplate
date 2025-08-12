import { Application, IndexedDBMethod, LocalStorageMethod } from './index';

// Mock fetch for tests
global.fetch = vi.fn();
global.AbortController = vi.fn(() => ({
  abort: vi.fn(),
  signal: {}
}));

describe ('Application',  () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    global.fetch.mockClear();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
describe('Application',  () => {
  describe('storage',  () => {
    it('should return the storage method',  () => {
      // IndexedDB Storage application
      const indexedDBMethod = new IndexedDBMethod(
        "test",
        1,
        {
          formData: "uuid, fullName, email, phoneNumber, numberOfFish, species, computedPrice, isDraft",
          species: "name, price",
          homebaseData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
        },
      );
      const indexedDBApplication = new Application({
        storage: indexedDBMethod,
      });
      expect (indexedDBApplication.storage).toEqual(indexedDBMethod);

      // Local Storage application
      const localStorageMethod = new LocalStorageMethod(
        "test",
        {
          formData: "uuid, fullName, email, phoneNumber, numberOfFish, species, computedPrice, isDraft",
          species: "name, price",
          homebaseData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
        },
      );
      const localStorageApplication = new Application({
        storage: localStorageMethod,
      });
      expect(localStorageApplication.storage).toEqual(localStorageMethod);
    });

    it('should return the storage method using a configuration object', function () {
      const indexedDBApplication = new Application(
        {
          storage: {
            type: "indexedDB",
            name: "test",
            version: 1,
            stores: {
              formData: "uuid, fullName, email, phoneNumber, numberOfFish, species, computedPrice, isDraft",
              species: "name, price",
              homebaseData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
            }
          }
        }
      )
      expect(indexedDBApplication.storage).toBeInstanceOf(IndexedDBMethod);

      const localStorageApplication = new Application(
        {
          storage: {
            type: "localStorage",
            name: "test",
            stores: {
              formData: "uuid, fullName, email, phoneNumber, numberOfFish, species, computedPrice, isDraft",
              species: "name, price",
              homebaseData: "KEY, REPORT_TYPE, SORT_KEY, TRIP_TYPE, VALUE",
            }
          }
        }
      )
      expect(localStorageApplication.storage).toBeInstanceOf(LocalStorageMethod);
    });
  });
  
  describe('network', () => {
    it('should initialize with default network health settings', () => {
      const app = new Application();
      expect(app._networkHealth.timeout).toBe(30000);
      expect(app._networkHealth.endpointUrl).toBeNull();
      expect(app._fallbackUrls).toEqual({});
    });
    
    it('should initialize with custom network health settings', () => {
      const app = new Application({
        network: {
          health: {
            timeout: 5000,
            endpointUrl: "https://api.example.com/health"
          },
          fallbackUrls: {
            "https://primary.com": "https://fallback.com"
          }
        }
      });
      
      expect(app._networkHealth.timeout).toBe(5000);
      expect(app._networkHealth.endpointUrl).toBe("https://api.example.com/health");
      expect(app._fallbackUrls).toEqual({
        "https://primary.com": "https://fallback.com"
      });
    });
    
    it('should handle network status changes', () => {
      const app = new Application();
      
      const dispatchSpy = vi.spyOn(app, '_dispatch');
      
      // First status change
      app._handleNetworkStatusChange(false);
      expect(app.isOnline).toBe(false);
      expect(dispatchSpy).toHaveBeenCalledWith("offline");
      
      // Change to online
      app._handleNetworkStatusChange(true);
      expect(app.isOnline).toBe(true);
      expect(dispatchSpy).toHaveBeenCalledWith("online");
    });
    
    it('should handle HTTP request with timeout', async () => {
      const app = new Application({
        network: {
          health: {
            timeout: 5000
          }
        }
      });
      
      // Mock successful fetch
      global.fetch.mockResolvedValueOnce("response");
      
      const result = await app.request("https://example.com");
      expect(result).toBe("response");
      expect(global.fetch).toHaveBeenCalledWith("https://example.com", expect.objectContaining({
        signal: expect.any(Object)
      }));
      
      // Should set timeout
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
    });
    
    it('should use fallback URL when primary fails', async () => {
      const app = new Application({
        network: {
          fallbackUrls: {
            "https://primary.com": "https://backup.com"
          }
        }
      });
      
      // Mock primary failure and fallback success
      global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Failed")))
                  .mockResolvedValueOnce("fallback response");
      
      const result = await app.request("https://primary.com");
      
      expect(result).toBe("fallback response");
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenNthCalledWith(1, "https://primary.com", expect.any(Object));
      expect(global.fetch).toHaveBeenNthCalledWith(2, "https://backup.com", expect.any(Object));
    });
    
    it('should handle HTTP request with retry logic', async () => {
      const app = new Application();
      
      const requestSpy = vi.spyOn(app, 'request');
      const dispatchSpy = vi.spyOn(app, '_dispatch');
      
      // Mock failure on first attempt, success on second
      requestSpy.mockRejectedValueOnce(new Error("Failed"))
                .mockResolvedValueOnce("success");
      
      const result = await app.requestWithRetry("https://example.com", {}, {
        retries: 2,
        retryDelay: 1000
      });
      
      expect(result).toBe("success");
      expect(requestSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith("networkRetry", expect.objectContaining({
        attempt: 1,
        maxRetries: 2
      }));
      
      // Should wait between retries
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    });
    
    it('should use exponential backoff for retries', async () => {
      const app = new Application();
      
      const requestSpy = vi.spyOn(app, 'request');
      
      // Mock failures
      requestSpy.mockRejectedValueOnce(new Error("Failed"))
                .mockRejectedValueOnce(new Error("Failed again"))
                .mockResolvedValueOnce("success");
      
      // Use fake timers to advance through delays
      const result = await app.requestWithRetry("https://example.com", {}, {
        retries: 3,
        retryDelay: 1000,
        exponentialBackoff: true
      });
      
      expect(result).toBe("success");
      expect(requestSpy).toHaveBeenCalledTimes(3);
      
      // First retry should use 1000ms delay
      expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 1000);
      
      // Second retry should use 2000ms delay (2^1 * 1000)
      expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 2000);
    });
    
    it('should check network health', async () => {
      const app = new Application({
        network: {
          health: {
            endpointUrl: "https://api.example.com/health"
          }
        }
      });
      
      const requestSpy = vi.spyOn(app, 'request');
      
      // Mock successful health check
      requestSpy.mockResolvedValueOnce({ ok: true });
      
      const result = await app.checkNetworkHealth();
      
      expect(result).toBe(true);
      expect(requestSpy).toHaveBeenCalledWith(
        "https://api.example.com/health", 
        { method: "HEAD" }
      );
      
      // Test failed health check
      requestSpy.mockRejectedValueOnce(new Error("Network error"));
      
      const failedResult = await app.checkNetworkHealth();
      
      expect(failedResult).toBe(false);
    });
  });
});