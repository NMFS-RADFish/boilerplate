import Collection from "./Collection";
import Schema from "./Schema";
class Connector extends EventTarget {
  constructor(engine) {
    super();
    this.collections = null;
    if (!engine) {
      throw new Error('Storage engine must be provided.');
    }
    this.engine = engine;
  }

  async initialize(callback) {
    let error = null;
    try {
      await this.engine.initialize();
      this.dispatchEvent(new CustomEvent('init', { detail: { status: 'initialized' }}));
      if (callback && typeof callback === 'function') {
        callback(null, this);
      }
    } catch (e) {
      this.dispatchEvent(new CustomEvent('error', { detail: e }));
      error = e;
      if (callback && typeof callback === 'function') {
        callback(error, this);
      }
    }
    return this;
  }

  addCollection(schema) {
    if (!this.collections) {
      this.collections = {};
    }
    this.collections[schema.name] = new Collection(schema, this);  
  }

  /**
   * Create a new record in the specified schema
   * @param {Object|Schema} schema - The schema object or Schema instance
   * @param {Object} data - The data to store
   * @returns {Promise<any>} - The result of the create operation
   */
  async create(schema, data) {
    const schemaName = schema.name || schema;
    return this.engine.create(schemaName, data);
  }

  /**
   * Find records matching criteria in the specified schema
   * @param {Object|Schema} schema - The schema object or Schema instance
   * @param {Object} criteria - The search criteria
   * @returns {Promise<Array>} - The matching records
   */
  async find(schema, criteria) {
    const schemaName = schema.name || schema;
    return this.engine.find(schemaName, criteria);
  }

  /**
   * Delete records from the specified schema
   * @param {Object|Schema} schema - The schema object or Schema instance
   * @param {Array} uuids - The UUIDs of records to delete
   * @returns {Promise<boolean>} - True if deletion was successful
   */
  async delete(schema, uuids) {
    const schemaName = schema.name || schema;
    return this.engine.delete(schemaName, uuids);
  }
}

export default Connector;
