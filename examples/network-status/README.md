# Enhanced Network Status Example

This example demonstrates advanced network status handling with sophisticated features for modern web applications that need to be resilient to network issues.

## Key Features

- **Real-time Network Status Detection**: Monitors online/offline state using browser APIs and custom network checks
- **Network Flapping Detection**: Identifies unstable connections that rapidly switch between online and offline states
- **Resilient Fetching**: Implements automatic retries with exponential backoff for failed network requests
- **Request Timeout Control**: Configurable timeout settings to prevent hanging requests
- **Fallback URLs**: Automatic redirection to alternative endpoints when primary endpoints fail
- **Custom Network Testing Tools**: Tools to simulate various network conditions for testing

Learn more about RADFish examples at the official [documentation](https://nmfs-radfish.github.io/radfish/developer-documentation/examples-and-templates#examples). Refer to the [RADFish GitHub repo](https://nmfs-radfish.github.io/radfish/) for more information and code samples.

## Preview

This example renders as shown in this screenshot:

![Enhanced Network Status](./src/assets/network-status.png)

## Implementation

### 1. Configuring Enhanced Network Features

Set up the Application with advanced network handling options:

```jsx
const app = new Application({
  network: {
    // Custom timeout in milliseconds (default is 30000)
    timeout: 5000,
    
    // Fallback URLs to use when primary endpoints fail
    fallbackUrls: {
      "https://nonexistent-endpoint.example.com": "https://jsonplaceholder.typicode.com/users"
    },
    
    // Threshold for detecting network flapping (default is 3)
    flappingThreshold: 2,
    
    // Optional custom network status handler
    setIsOnline: async (networkInfo, callback) => {
      // Custom logic to determine network status
      try {
        const response = await fetch("https://api.github.com/users", {
          method: "HEAD",
          signal: AbortSignal.timeout(3000)
        });
        callback(response.ok);
      } catch (error) {
        callback(false);
      }
    }
  }
});
```

### 2. Using Enhanced Network Status Features

Access the enhanced network status features through hooks:

```jsx
const HomePage = () => {
  const { isOffline, isFlapping, flappingDetails } = useOfflineStatus();
  const app = useApplication();
  
  // Network status tag with flapping detection
  const getNetworkStatusTag = () => {
    if (isFlapping) {
      return <Tag className="bg-warning">Unstable</Tag>;
    } else if (isOffline) {
      return <Tag className="bg-error">Offline</Tag>;
    } else {
      return <Tag className="bg-success">Online</Tag>;
    }
  };
  
  // Using fetch with retry and fallback capabilities
  const fetchWithRetry = async () => {
    try {
      const response = await app.fetchWithRetry(
        "https://nonexistent-endpoint.example.com",
        {},
        {
          retries: 2,
          retryDelay: 1000,
          exponentialBackoff: true,
        }
      );
      const data = await response.json();
      // Handle successful response
    } catch (error) {
      // Handle failure after all retries
    }
  };
  
  return (
    <div>
      <div>Current Status: {getNetworkStatusTag()}</div>
      
      {isFlapping && flappingDetails && (
        <Alert type="warning">
          Network is flapping! Changed {flappingDetails.flappingCount} times 
          in the last {Math.round(flappingDetails.timeSinceLastChange/1000)} seconds.
        </Alert>
      )}
      
      <Button onClick={fetchWithRetry}>Test Fetch with Retry</Button>
    </div>
  );
};
```

## Testing with Browser DevTools

To fully test the network resilience features, you can use browser DevTools:

### Viewing Console Logs

1. Open DevTools in your browser:
   - **Chrome/Edge**: Press F12 or right-click and select "Inspect"
   - **Firefox**: Press F12 or right-click and select "Inspect Element"
   - **Safari**: Enable "Developer Tools" in preferences, then press Option+Command+I

2. Go to the "Console" tab to view logs:
   - Network status changes appear as color-coded logs
   - Network flapping events are highlighted with yellow backgrounds
   - Retry attempts are logged with blue backgrounds

### Simulating Offline/Online States

1. In DevTools, go to the "Network" tab
2. Look for the "Online" dropdown (may appear as "No throttling" in some browsers)
3. Select "Offline" to simulate a disconnected state
4. Return to "Online" or "No throttling" to restore connectivity

### Testing Network Flapping

Instead of manually toggling network state, you can use the "Simulate Network Flapping" button in the example interface to trigger a rapid sequence of online/offline state changes.

### Testing Fetch with Retry and Fallbacks

1. Click the "Test Fetch with Retry" button while watching the Console
2. You'll see logs of retry attempts and eventual success or failure
3. If using a fallback URL, you'll see the fallback request after the primary URL fails
