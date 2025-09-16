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
    this._initializationPromise = null;

    // Register event listeners
    this._registerEventListeners();

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

    const handleOnline = (event) => {
      this.isOnline = true;
      this._dispatch("online", { event });
    };
    window.addEventListener("online", handleOnline, true);

    const handleOffline = (event) => {
      this.isOnline = false;
      this._dispatch("offline", { event });
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
}

export * from "./on-device-storage/storage";
