class EventEmitter extends EventTarget {}

export class Application {
  constructor() {
    this.emitter = new EventEmitter();
    this.serviceWorker = null;
    this.isOnline = navigator.onLine;

    this._registerEventListeners();

    this._dispatch("init");
  }

  on(event, callback) {
    return this.emitter.addEventListener(event, callback);
  }

  _dispatch(event, detail) {
    this.emitter.dispatchEvent(new CustomEvent(event, { bubbles: false, detail: detail }));
  }

  _registerEventListeners() {
    console.log(`%c[RAD] Registering event listeners`, "color:#3984C5;font-weight:bold;");
    this.on("init", async () => {
      console.debug("Application initialized");
      const worker = await this._installServiceWorker();
      this._dispatch("ready", { worker });
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

  async _installServiceWorker(path = "/service-worker.js") {
    const { worker } = await import("../../mocks/browser");
    const onUnhandledRequest = "bypass";

    this.serviceWorker = worker;

    const url = import.meta.env.MODE === "development" ? "/mockServiceWorker.js" : path;

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
