import { setupWorker } from "msw/browser";
import { StorageMethod, IndexedDBMethod, LocalStorageMethod } from "./on-device-storage/storage";

class EventEmitter extends EventTarget {}

export class Application {
  constructor(options = {}) {
    this.emitter = new EventEmitter();
    this.serviceWorker = null;
    this.isOnline = navigator.onLine;
    this._options = options;
    this._networkHandler = options.network?.setIsOnline;
    this._networkTimeout = options.network?.timeout || 30000; // Default 30s timeout
    this._fallbackUrls = options.network?.fallbackUrls || {};
    this._networkFlappingThreshold = options.network?.flappingThreshold || 3; // Default count for flapping detection
    this._flappingCounter = 0;
    this._lastStatusChange = Date.now();

    this._registerEventListeners();
    
    // Check initial network status if handler provided
    if (this._networkHandler) {
      this._networkHandler(navigator.connection, (status) => {
        this._handleNetworkStatusChange(status);
      });
    }

    this._dispatch("init");
  }

  addEventListener(event, callback) {
    return this.emitter.addEventListener(event, callback);
  }

  removeEventListener(event, callback) {
    return this.emitter.removeEventListener(event, callback);
  }

  get storage() {
    if (!this._options.storage) {
      return null;
    }

    if (!(this._options.storage instanceof StorageMethod)) {
      console.warn('Please update the storage method to be an instance of StorageMethod');
      
      switch (this._options.storage?.type) {
        case "indexedDB": {
          return new IndexedDBMethod(
            this._options.storage.name,
            this._options.storage.version,
            this._options.storage.stores
          );
        }
        case "localStorage": {
          return new LocalStorageMethod(this._options.storage.name);
        }
        default: {
          throw new Error(`Invalid storage method type: ${this._options.storage.type}`);
        }
      }
    }

    return this._options.storage;
  }

  on(event, callback) {
    return this.emitter.addEventListener(event, callback);
  }

  _dispatch(event, detail) {
    this.emitter.dispatchEvent(
      new CustomEvent(event, { bubbles: false, detail: detail })
    );
  }

  _registerEventListeners() {
    console.log(
      `%c[RAD] Registering event listeners`,
      "color:#3984C5;font-weight:bold;"
    );
    this.on("init", async () => {
      console.debug("Application initialized");
      const worker = await this._installServiceWorker(
        this._options?.mocks?.handlers,
        this._options?.serviceWorker?.url
      );
      this._dispatch("ready", { worker });
    });

    const handleOnline = async (event) => {
      if (this._networkHandler) {
        await this._networkHandler(navigator.connection, (status) => {
          this._handleNetworkStatusChange(status);
        });
      } else {
        this._handleNetworkStatusChange(true);
      }
    };
    window.addEventListener("online", handleOnline, true);

    const handleOffline = async (event) => {
      if (this._networkHandler) {
        await this._networkHandler(navigator.connection, (status) => {
          this._handleNetworkStatusChange(status);
        });
      } else {
        this._handleNetworkStatusChange(false);
      }
    };
    window.addEventListener("offline", handleOffline, true);
  }

  async _installServiceWorker(handlers, url) {
    if (!url) return null;
    console.info("Installing service worker");
    const worker = setupWorker(...((await handlers)?.default || []));
    const onUnhandledRequest = "bypass";

    this.serviceWorker = worker;

    worker
      .start({
        onUnhandledRequest,
        serviceWorker: {
          url: url,
        },
      })
      .then(() => {
        console.debug("Service worker installed");
      });
  }

  /**
   * Fetch with fallback and timeout support
   * @param {string|Request} resource - The URL or Request object
   * @param {Object} [options] - Fetch options
   * @returns {Promise<Response>} - Response from primary or fallback URL
   */
  async fetch(resource, options = {}) {
    const url = resource instanceof Request ? resource.url : resource;
    const fallbackUrl = this._fallbackUrls[url];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this._networkTimeout);
    
    // Clone options and add abort signal
    const fetchOptions = {
      ...options,
      signal: controller.signal
    };
    
    try {
      // Try primary URL
      const response = await fetch(resource, fetchOptions);
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (!fallbackUrl) {
        // No fallback available, update network status and throw error
        this._handleNetworkStatusChange(false);
        throw error;
      }
      
      // Try fallback URL
      try {
        // Create a new controller for the fallback request
        const fallbackController = new AbortController();
        const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), this._networkTimeout);
        
        const fallbackOptions = {
          ...options,
          signal: fallbackController.signal
        };
        
        // Build fallback resource
        const fallbackResource = resource instanceof Request 
          ? new Request(fallbackUrl, resource) 
          : fallbackUrl;
        
        const response = await fetch(fallbackResource, fallbackOptions);
        clearTimeout(fallbackTimeoutId);
        return response;
      } catch (fallbackError) {
        // Both primary and fallback failed, update network status
        this._handleNetworkStatusChange(false);
        throw fallbackError;
      }
    }
  }
  
  /**
   * Fetch with automatic retry capability
   * @param {string|Request} resource - The URL or Request object
   * @param {Object} [options] - Fetch options
   * @param {Object} [retryOptions] - Retry configuration
   * @param {number} [retryOptions.retries=3] - Maximum number of retries
   * @param {number} [retryOptions.retryDelay=1000] - Delay between retries in ms
   * @param {boolean} [retryOptions.exponentialBackoff=true] - Whether to use exponential backoff
   * @returns {Promise<Response>} - Response from successful request
   */
  async fetchWithRetry(resource, options = {}, retryOptions = {}) {
    const { 
      retries = 3, 
      retryDelay = 1000, 
      exponentialBackoff = true 
    } = retryOptions;
    
    let lastError;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.fetch(resource, options);
      } catch (error) {
        lastError = error;
        
        if (attempt < retries) {
          // Calculate delay - use exponential backoff if enabled
          const delay = exponentialBackoff 
            ? retryDelay * Math.pow(2, attempt)
            : retryDelay;
            
          // Emit event about retry
          this._dispatch("networkRetry", {
            resource: resource instanceof Request ? resource.url : resource,
            attempt: attempt + 1,
            maxRetries: retries,
            delay
          });
          
          // Wait before next attempt
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // All retries failed
    throw lastError;
  }
  
  /**
   * Handle network status changes with flapping detection
   * @param {boolean} isOnline - Current network status
   * @private
   */
  _handleNetworkStatusChange(isOnline) {
    const now = Date.now();
    const timeSinceLastChange = now - this._lastStatusChange;
    
    // If status changed rapidly, increment flapping counter
    if (timeSinceLastChange < 5000 && this.isOnline !== isOnline) {
      this._flappingCounter++;
    } else {
      this._flappingCounter = 0;
    }
    
    // Only update status if not flapping or if forced by threshold
    if (this._flappingCounter < this._networkFlappingThreshold) {
      this._lastStatusChange = now;
      this.isOnline = isOnline;
      
      // Dispatch appropriate event
      this._dispatch(isOnline ? "online" : "offline", { isFlapping: false });
    } else if (this._flappingCounter === this._networkFlappingThreshold) {
      // Dispatch flapping event when threshold is reached
      this._dispatch("networkFlapping", { 
        flappingCount: this._flappingCounter,
        timeSinceLastChange
      });
    }
  }
}

export * from "./on-device-storage/storage";
