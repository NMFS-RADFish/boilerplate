const ISO_8601_DATE_TIME_REGEX = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{1,3})?Z?)$/;
const ISO_8601_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

class ValidationError extends Error {
  constructor(errors) {
    super("Validation failed");
    this.name = "ValidationError";
    this.errors = errors; // Store detailed validation errors
  }
}

class Schema {
  constructor(options) {
    const { name, fields } = options;
    if (!name || typeof name !== 'string') {
      throw new Error('Schema name must be a non-empty string.');
    }
    if (!fields || typeof fields !== 'object') {
      throw new Error('Schema rules must be an object.');
    }
    this.name = name;
    // Follow json-schema specification
    this._schema = {
      title: this.name,
      type: 'object',
      properties: {},
      required: [],
      unique: [],
    };
    for (const [key, definition] of Object.entries(fields)) {
      if (!definition.type || typeof definition.type !== 'string') {
        throw new Error(`"Field "${key}" must have a type.`);
      }
      switch (definition.type) {
        case 'timestamp':
          this._schema.properties[key] = { type: 'timestamp' };
          break;
        case 'date':
          this._schema.properties[key] = { type: 'date' };
          break;
        case 'time':
          this._schema.properties[key] = { type: 'time' };
          break;
        case 'datetime-local':
          this._schema.properties[key] = { type: 'datetime-local' };
          break;
        default:
          this._schema.properties[key] = { type: definition.type };
      }
      if (definition.required) {
        this._schema.required.push(key);
      }
      if (definition.unique) {
        this._schema.unique.push(key);
      }
      if (definition.minLength) {
        this._schema.properties[key].minLength = definition.minLength;
      }
      if (definition.pattern) {
        this._schema.properties[key].pattern = definition.pattern.source;
      }
      // Handle numerical constraints
      if (definition.type === 'number') {
        if (definition.minimum !== undefined) {
          this._schema.properties[key].minimum = definition.minimum;
        }
        if (definition.maximum !== undefined) {
          this._schema.properties[key].maximum = definition.maximum;
        }
        if (definition.exclusiveMinimum !== undefined) {
          this._schema.properties[key].exclusiveMinimum = definition.exclusiveMinimum;
        }
        if (definition.exclusiveMaximum !== undefined) {
          this._schema.properties[key].exclusiveMaximum = definition.exclusiveMaximum;
        }
      }
      if (definition.primaryKey) {
        this._schema.primaryKey = key;
      }
    }
  }

  /**
   * Validates input data against the schema.
   * @param {Object} data - The data to validate.
   * @param {boolean} [strictMode=false] - Whether to throw on validation errors.
   * @returns {Object} Validation result { isValid: boolean, errors: Array }
   */
  validate(data, strictMode = false) {
    const errors = [];

    if (!data || typeof data !== 'object') {
      errors.push({ field: null, error: 'Invalid data type' });
    } else {
      for (const [key, definition] of Object.entries(this._schema.properties)) {
        const value = data[key];

        // Required field check
        const isRequired = this._schema.required.includes(key);
        if (isRequired && (value === undefined || value === null)) {
          errors.push({ field: key, error: 'Field is required' });
          continue; // Skip further checks for this field
        }

        // Type validation
        if (value !== undefined) {
          switch (definition.type) {
            case 'timestamp': // e.g. 2025-02-14T14:23:00.000Z
            case 'datetime-local': // e.g. 2025-02-14T14:23
              if (!(value instanceof Date) && !(typeof value === 'string' && ISO_8601_DATE_TIME_REGEX.test(value))) {
                errors.push({ field: key, error: 'Expected type Date or valid date-time string' });
              }
              break;
            case 'date': // e.g. 2025-02-14
              if (!(value instanceof Date) && !(typeof value === 'string' && ISO_8601_DATE_REGEX.test(value))) {
                errors.push({ field: key, error: 'Expected type Date or valid date string' });
              }
              break;
            case 'time': // e.g 14:21
              if (typeof value !== 'string' || !TIME_REGEX.test(value)) {
                errors.push({ field: key, error: 'Expected type string in format HH:MM:SS' });
              }
              break;
            case 'number':
              if (typeof value !== 'number') {
                errors.push({ field: key, error: `Expected type number, got ${typeof value}` });
              } else {
                if (definition.minimum !== undefined && value < definition.minimum) {
                  errors.push({ field: key, error: `Must be >= ${definition.minimum}` });
                }
                if (definition.maximum !== undefined && value > definition.maximum) {
                  errors.push({ field: key, error: `Must be <= ${definition.maximum}` });
                }
                if (definition.exclusiveMinimum !== undefined && value <= definition.exclusiveMinimum) {
                  errors.push({ field: key, error: `Must be > ${definition.exclusiveMinimum}` });
                }
                if (definition.exclusiveMaximum !== undefined && value >= definition.exclusiveMaximum) {
                  errors.push({ field: key, error: `Must be < ${definition.exclusiveMaximum}` });
                }
              }
              break;
            default:
              if (typeof value !== definition.type) {
                errors.push({ field: key, error: `Expected type ${definition.type}, got ${typeof value}` });
              }
          }
        }

        // Additional constraints for string types
        if (definition.minLength && typeof value === 'string' && value.length < definition.minLength) {
          errors.push({ field: key, error: `Must be at least ${definition.minLength} characters` });
        }

        if (definition.regex && typeof value === 'string' && !definition.regex.test(value)) {
          errors.push({ field: key, error: 'Invalid format' });
        }
      }
    }

    if (strictMode && errors.length > 0) {
      throw new ValidationError(errors);
    }

    return { isValid: errors.length === 0, errors };
  }
}

export default Schema;
