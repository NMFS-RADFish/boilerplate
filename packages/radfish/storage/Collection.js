import Schema from "./Schema";

class Collection extends EventTarget {
  constructor(schema, connector) {
    super();
    this.name = null;
    this.schema = null;
    this.connector = connector;

    if (schema && schema instanceof Schema) {
      this.name = schema.name;
      this.schema = schema;
    } else if (typeof schema === 'object') {
      this.name = schema.name;
      this.schema = new Schema(schema);
    }
  }

  /**
   * Create a new record in the collection
   * @param {Object} data - The data to store
   * @returns {Promise<Object>} - The created data with any generated fields
   */
  async create(data) {
    if (!this.connector) {
      throw new Error('Collection is not connected to a connector');
    }
    
    // Get primary key field name
    const primaryKeyField = this.schema._schema.primaryKey;
    
    // Create a copy of the data to avoid modifying the original
    const newData = { ...data };
    
    // Only generate a UUID if there's a primary key field defined in the schema
    if (primaryKeyField && 
        this.schema._schema.properties[primaryKeyField] && 
        !newData[primaryKeyField] && 
        !this.schema._schema.properties[primaryKeyField]?.autoIncrement) {
      newData[primaryKeyField] = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
    }
    
    // Validate data against schema
    this.schema.validate(newData, true);

    // Check for unique field conflicts
    const uniqueFields = this.schema._schema.unique || [];
    if (uniqueFields.length > 0) {
      const uniqueFieldsWithValues = uniqueFields.filter(field => 
        newData[field] !== undefined
      );
      
      // If setting any unique fields, check for conflicts
      if (uniqueFieldsWithValues.length > 0) {
        for (const field of uniqueFieldsWithValues) {
          // Find any records with the same unique field value
          const existingRecords = await this.find({ [field]: newData[field] });
          
          if (existingRecords.length > 0) {
            throw new Error(`Unique field conflict: '${field}' value '${newData[field]}' is already in use`);
          }
        }
      }
    }

    // Emit a beforeCreate event on the collection
    this.dispatchEvent(new CustomEvent('beforeCreate', { 
      detail: { schema: this.schema, data: newData }
    }));
    
    // Create the record using the storage engine
    const result = await this.connector.engine.create(this.schema.name, newData);

    // Emit create events
    this.dispatchEvent(new CustomEvent('create', { 
      detail: { schema: this.schema, data: result }
    }));
    
    // Also emit on the connector for backward compatibility
    this.connector.dispatchEvent(new CustomEvent('create', { 
      detail: { schema: this.schema, data: result }
    }));
    
    return result;
  }

  /**
   * Find records in the collection matching criteria
   * @param {Object} criteria - The search criteria (empty for all records)
   * @returns {Promise<Array>} - The matching records
   */
  async find(criteria = {}) {
    if (!this.connector) {
      throw new Error('Collection is not connected to a connector');
    }
    
    // Dispatch event through the connector
    this.connector.dispatchEvent(new CustomEvent('find', { 
      detail: { schema: this.schema, criteria }
    }));
    
    // Find records using the storage engine
    return this.connector.engine.find(this.schema.name, criteria);
  }
  /**
   * Update a record in the collection
   * @param {Object} data - The data to update (must include primary key)
   * @returns {Promise<Object>} - The updated record
   */
  async update(data) {
    if (!this.connector) {
      throw new Error('Collection is not connected to a connector');
    }
    
    // Get the primary key field name from the schema
    const primaryKeyField = this.schema._schema.primaryKey;
    
    // If no primary key is defined in the schema, we can't perform an update
    if (!primaryKeyField) {
      throw new Error('Cannot update record: no primary key defined in schema');
    }
    
    // Ensure primary key is present
    if (!data[primaryKeyField]) {
      throw new Error(`Update requires ${primaryKeyField} (primary key) to be specified`);
    }
    
    // Prevent updating the primary key itself by making a copy without the primary key
    const updateData = { ...data };
    
    // Get the current record to perform a partial update
    const [currentRecord] = await this.find({ [primaryKeyField]: data[primaryKeyField] });
    if (!currentRecord) {
      throw new Error(`Record with ${primaryKeyField}='${data[primaryKeyField]}' not found`);
    }
    
    // Create merged data for validation (current data + updates)
    const mergedData = { ...currentRecord, ...updateData };
    
    // Validate the merged data against schema
    this.schema.validate(mergedData);
    
    // Check for unique field conflicts
    const uniqueFields = this.schema._schema.unique || [];
    if (uniqueFields.length > 0) {
      const uniqueFieldsBeingUpdated = uniqueFields.filter(field => 
        updateData[field] !== undefined && 
        updateData[field] !== currentRecord[field]
      );
      
      // If updating any unique fields, check for conflicts
      if (uniqueFieldsBeingUpdated.length > 0) {
        for (const field of uniqueFieldsBeingUpdated) {
          // Find any records with the same unique field value
          const existingRecords = await this.find({ [field]: updateData[field] });
          
          // Filter out the current record (it's ok for a record to keep its own unique value)
          const conflictingRecords = existingRecords.filter(record => 
            record[primaryKeyField] !== data[primaryKeyField]
          );
          
          if (conflictingRecords.length > 0) {
            throw new Error(`Unique field conflict: '${field}' value '${updateData[field]}' is already in use`);
          }
        }
      }
    }
    
    // Emit a beforeUpdate event on the collection
    this.dispatchEvent(new CustomEvent('beforeUpdate', { 
      detail: { 
        schema: this.schema, 
        primaryKey: { field: primaryKeyField, value: data[primaryKeyField] },
        currentData: currentRecord,
        updateData: updateData 
      }
    }));
    
    // Update the record using the storage engine
    // Pass the primary key value and update data separately
    const updated = await this.connector.engine.update(
      this.schema.name, 
      { 
        [primaryKeyField]: data[primaryKeyField],
        ...updateData 
      }
    );
    
    // Emit update events
    this.dispatchEvent(new CustomEvent('update', { 
      detail: { schema: this.schema, data: updated }
    }));
    
    // Also emit on the connector for backward compatibility
    this.connector.dispatchEvent(new CustomEvent('update', { 
      detail: { schema: this.schema, data: updated }
    }));
    
    return updated;
  }

  /**
   * Delete records from the collection that match the criteria
   * @param {Object} criteria - The criteria to match records for deletion
   * @returns {Promise<boolean>} - True if deletion was successful
   */
  async delete(criteria = {}) {
    if (!this.connector) {
      throw new Error('Collection is not connected to a connector');
    }
    
    // Find all records matching the criteria
    const recordsToDelete = await this.find(criteria);
    
    if (recordsToDelete.length === 0) {
      // No matching records found
      return true;
    }
    
    // Dispatch event with the affected records
    this.dispatchEvent(new CustomEvent('beforeDelete', { 
      detail: { schema: this.schema, criteria, records: recordsToDelete }
    }));
    
    // Delete the records using the storage engine by passing the entire records
    // The engine will handle extracting IDs or otherwise identifying the records
    const result = await this.connector.engine.delete(this.schema.name, recordsToDelete);
    
    // Dispatch delete events
    this.dispatchEvent(new CustomEvent('delete', { 
      detail: { schema: this.schema, criteria, records: recordsToDelete }
    }));
    
    // Also emit on the connector for backward compatibility
    this.connector.dispatchEvent(new CustomEvent('delete', { 
      detail: { schema: this.schema, criteria, records: recordsToDelete }
    }));
    
    return result;
  }
}

export default Collection;