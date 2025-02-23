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

    this._registerEventListeners();

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
          this.isOnline = status;
          this._dispatch("online", { event });
        });
      } else {
        this.isOnline = true;
        this._dispatch("online", { event });
      }
    };
    window.addEventListener("online", handleOnline, true);

    const handleOffline = async (event) => {
      if (this._networkHandler) {
        await this._networkHandler(navigator.connection, (status) => {
          this.isOnline = status;
          this._dispatch("offline", { event });
        });
      } else {
        this.isOnline = false;
        this._dispatch("offline", { event });
      }
    };
    window.addEventListener("offline", handleOffline, true);
  }

  async _installServiceWorker(handlers, url) {
    if (!url) return null;
    console.info("Installing service worker");
    console.log("something");
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
}

export * from "./on-device-storage/storage";
