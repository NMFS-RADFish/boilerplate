import { renderHook, act } from "@testing-library/react";
import { useOfflineStatus } from "./useOfflineStatus";
import { useApplication } from "../../Application";

// Mock the useApplication hook
vi.mock("../../Application", () => ({
  useApplication: vi.fn()
}));

describe("useOfflineStatus", () => {
  // Setup mock application
  const mockApplication = {
    isOnline: true,
    _networkTimeout: 5000,
    fetch: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  };
  
  beforeEach(() => {
    vi.resetAllMocks();
    mockApplication.isOnline = true;
    mockApplication.fetch.mockReset();
    useApplication.mockReturnValue(mockApplication);
  });
  
  it("should trigger when navigator online switches", async () => {
    const onLineSpy = vi.spyOn(window.navigator, "onLine", "get");
    const { result, rerender } = renderHook(() => useOfflineStatus());

    onLineSpy.mockReturnValue(true);
    window.dispatchEvent(new window.Event("online"));
    rerender();

    expect(result.current.isOffline).toBe(false);

    onLineSpy.mockReturnValue(false);
    window.dispatchEvent(new window.Event("offline"));
    rerender();

    expect(result.current.isOffline).toBe(true);
  });
  
  it("should add event listeners for network events", () => {
    renderHook(() => useOfflineStatus());
    
    expect(mockApplication.addEventListener).toHaveBeenCalledWith(
      "online", 
      expect.any(Function)
    );
    expect(mockApplication.addEventListener).toHaveBeenCalledWith(
      "offline", 
      expect.any(Function)
    );
  });
  
  it("should cleanup event listeners on unmount", () => {
    const { unmount } = renderHook(() => useOfflineStatus());
    unmount();
    
    expect(mockApplication.removeEventListener).toHaveBeenCalledWith(
      "online", 
      expect.any(Function)
    );
    expect(mockApplication.removeEventListener).toHaveBeenCalledWith(
      "offline", 
      expect.any(Function)
    );
  });
  
  it("should correctly check endpoint connectivity", async () => {
    const { result } = renderHook(() => useOfflineStatus());
    
    // Test successful fetch
    mockApplication.fetch.mockResolvedValueOnce({});
    
    let isReachable = await result.current.checkEndpoint("https://example.com");
    expect(isReachable).toBe(true);
    expect(mockApplication.fetch).toHaveBeenCalledWith(
      "https://example.com", 
      { method: "HEAD" }
    );
    
    // Test failed fetch
    mockApplication.fetch.mockRejectedValueOnce(new Error("Network error"));
    
    isReachable = await result.current.checkEndpoint("https://example.com");
    expect(isReachable).toBe(false);
  });
  
  it("should check multiple endpoints correctly", async () => {
    const { result } = renderHook(() => useOfflineStatus());
    
    // Setup different responses for different endpoints
    mockApplication.fetch
      .mockImplementationOnce((url) => {
        if (url === "https://working.example.com") {
          return Promise.resolve({});
        }
        return Promise.reject(new Error("Failed"));
      })
      .mockImplementationOnce((url) => {
        if (url === "https://api.example.com") {
          return Promise.resolve({});
        }
        return Promise.reject(new Error("Failed"));
      });
    
    const endpoints = [
      "https://working.example.com",
      "https://down.example.com"
    ];
    
    const results = await result.current.checkMultipleEndpoints(endpoints);
    
    expect(results).toEqual({
      "https://working.example.com": true,
      "https://down.example.com": false
    });
  });
});
