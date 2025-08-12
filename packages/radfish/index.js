import { Store, Schema, LocalStorageConnector, IndexedDBConnector } from './storage';
import { StorageMethod, IndexedDBMethod, LocalStorageMethod } from "./on-device-storage/storage";

const registerServiceWorker = async (url) => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(url, {
        scope: "/",
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
      return registration;
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

export class Application {
  constructor(options = {}) {
    this.emitter = new EventTarget();
    this.serviceWorker = null;
    this.isOnline = navigator.onLine;
    this._options = options;
    this._networkHandler = options.network?.setIsOnline;
    
    // Network health check configuration
    this._networkHealth = {
      timeout: options.network?.health?.timeout || 30000, // Default 30s timeout
      endpointUrl: options.network?.health?.endpointUrl || null
    };
    
    // Fallback URLs configuration
    this._fallbackUrls = options.network?.fallbackUrls || {};
    this._initializationPromise = null;

    // Register event listeners
    this._registerEventListeners();
    
    // Check initial network status if handler provided
    if (this._networkHandler) {
      this._networkHandler(navigator.connection, (status) => {
        this._handleNetworkStatusChange(status);
      });
    }

    // Initialize everything
    this._initializationPromise = this._initialize();
  }

  /**
   * Initialize the application stores and collections
   * @private
   */
  async _initialize() {
    // Initialize stores
    this.stores = null;
    if (this._options.stores && typeof this._options.stores === 'object') {
      this.stores = {};
      
      // Initialize each store and its connector
      const storeInitPromises = [];
      
      for (let storeKey in this._options.stores) {
        const store = this._options.stores[storeKey]
        let name = store.name || storeKey;
        let connector = store.connector;
        
        if (!connector) {
          throw new Error(`Store ${name} is missing a connector`);
        }
        
        // Create the store
        this.stores[name] = new Store({name, connector});
        
        // Initialize the connector
        const initPromise = this.stores[name].connector.initialize()
          .then(async () => {
            // Add collections if they exist
            if (store.collections) {
              const collectionPromises = [];
              
              for (let collectionKey in store.collections) {
                let collection = store.collections[collectionKey];
                let schema = collection.schema;
                
                // Handle schema configuration object
                if (typeof schema === 'object' && !(schema instanceof Schema)) {
                  // If schema doesn't have a name, use the collectionKey as default
                  if (!schema.name) {
                    schema = { ...schema, name: collectionKey };
                  }
                  schema = new Schema(schema);
                }
                
                // Add collection (might be async for IndexedDBConnector)
                const addCollectionPromise = Promise.resolve(
                  this.stores[name].connector.addCollection(schema)
                );
                collectionPromises.push(addCollectionPromise);
              }
              
              // Wait for all collections to be added
              return Promise.all(collectionPromises);
            }
          });
        
        storeInitPromises.push(initPromise);
      }
      
      // Wait for all stores to be initialized
      await Promise.all(storeInitPromises);
    }

    // Dispatch the init event
    this._dispatch("init");
    
    return true;
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

    console.warn('Deprecation: Please update to use Connectors instead of StorageMethod: https://nmfs-radfish.github.io/radfish/design-system/storage');

    if (!(this._options.storage instanceof StorageMethod)) {
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

      this.serviceWorker = worker;

      // Only dispatch ready event if worker is successfully installed or if no service worker was configured
      this._dispatch("ready");
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
    
    try {
      const registration = await registerServiceWorker(url);
      
      console.debug("Service worker installed and started successfully");
      // return worker;
      return registration;
    } catch (error) {
      console.error("Failed to install service worker:", error);
      return null;
    }
  }

  /**
   * Make HTTP request with fallback and timeout support
   * @param {string|Request} resource - The URL or Request object
   * @param {Object} [options] - Request options
   * @returns {Promise<Response>} - Response from primary or fallback URL
   */
  async request(resource, options = {}) {
    const url = resource instanceof Request ? resource.url : resource;
    const fallbackUrl = this._fallbackUrls[url];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this._networkHealth.timeout);
    
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
        const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), this._networkHealth.timeout);
        
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
   * Make HTTP request with automatic retry capability
   * @param {string|Request} resource - The URL or Request object
   * @param {Object} [options] - Request options
   * @param {Object} [retryOptions] - Retry configuration
   * @param {number} [retryOptions.retries=3] - Maximum number of retries
   * @param {number} [retryOptions.retryDelay=1000] - Delay between retries in ms
   * @param {boolean} [retryOptions.exponentialBackoff=true] - Whether to use exponential backoff
   * @returns {Promise<Response>} - Response from successful request
   */
  async requestWithRetry(resource, options = {}, retryOptions = {}) {
    const { 
      retries = 3, 
      retryDelay = 1000, 
      exponentialBackoff = true 
    } = retryOptions;
    
    let lastError;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.request(resource, options);
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
   * Check network health by making a request to the configured health endpoint
   * @returns {Promise<boolean>} - True if the health check succeeds, false otherwise
   */
  async checkNetworkHealth() {
    const url = this._networkHealth.endpointUrl || 'https://api.github.com/users';
    
    try {
      const response = await this.request(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Handle network status changes
   * @param {boolean} isOnline - Current network status
   * @private
   */
  _handleNetworkStatusChange(isOnline) {
    this.isOnline = isOnline;
    
    // Dispatch appropriate event
    this._dispatch(isOnline ? "online" : "offline");
  }
}

export * from "./on-device-storage/storage";
