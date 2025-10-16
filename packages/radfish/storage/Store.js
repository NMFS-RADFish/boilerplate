import Connector from "./Connector.js";

class Store {
  constructor ({ name, connector }) {
    this.name = name;

    // Instantiate store connector
    this.connector = null;

    if (connector && connector instanceof Connector) {
      this.connector = connector;
    }
  }

  async open() {
    // TODO: Use engine
    console.warn('Store.open() is not implemented');
  }

  async close() {
    // TODO: Use engine
    console.warn('Store.close() is not implemented');
  }

  getCollection(name) {
    return this.connector.collections[name];
  }
}

export default Store;