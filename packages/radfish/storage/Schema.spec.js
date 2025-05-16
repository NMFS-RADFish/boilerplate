import Schema from './Schema';

describe('Schema', () => {
  let userSchema;

  beforeEach(() => {
    userSchema = new Schema({
      name: 'User',
      fields: {
        id: { type: 'number', required: true, primaryKey: true },
        name: { type: 'string', required: true },
        email: { type: 'string', required: false },
        // Example of adding a field with constraints
        address: { type: 'string', required: false, minLength: 5, pattern: /^[A-Za-z\s]+$/ },
        createdAt: { type: 'timestamp', required: true },
        birthDate: { type: 'date', required: false },
        appointmentTime: { type: 'time', required: false },
        lastLogin: { type: 'datetime-local', required: false },
        age: { type: 'number', required: false, minimum: 0, maximum: 120 },
        score: { type: 'number', required: false, exclusiveMinimum: 0 }
      }
    });
  });

  it('should create a schema with valid name and rules', () => {
    expect(userSchema.name).toBe('User');
    expect(userSchema._schema).toHaveProperty('title', 'User');
    expect(userSchema._schema).toHaveProperty('type', 'object');
    expect(userSchema._schema.properties).toHaveProperty('id');
    expect(userSchema._schema.properties).toHaveProperty('name');
    expect(userSchema._schema.properties).toHaveProperty('email');
    expect(userSchema._schema.properties).toHaveProperty('address');
    expect(userSchema._schema.properties).toHaveProperty('createdAt');
    expect(userSchema._schema.required).toContain('id');
    expect(userSchema._schema.required).toContain('name');
    expect(userSchema._schema.required).not.toContain('email');
    expect(userSchema._schema.required).not.toContain('address');
  });

  it('should throw an error if name is not provided', () => {
    expect(() => new Schema({ name: '', fields: {} })).toThrow('Schema name must be a non-empty string.');
  });

  it('should throw an error if rules is not an object', () => {
    expect(() => new Schema({ name: 'User', fields: null })).toThrow('Schema rules must be an object.');
  });

  it('should throw an error if a rule is missing a type', () => {
    expect(() => new Schema({ name: 'User', fields: { id: { required: true } } })).toThrow('Field "id" must have a type.');
  });

  describe('validate', () => {
    it('should return true for valid data', () => {
      const validData = { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date() };
      expect(userSchema.validate(validData).isValid).toBe(true);
    });

    it('should return false if required fields are missing', () => {
      const invalidData = { name: 'John Doe' };
      expect(userSchema.validate(invalidData).isValid).toBe(false);
    });

    it('should return false if field types do not match', () => {
      const invalidData = { id: 'one', name: 'John Doe', email: 'john@example.com' };
      expect(userSchema.validate(invalidData).isValid).toBe(false);
    });

    it('should return true if optional fields are missing', () => {
      const validData = { id: 1, name: 'John Doe', createdAt: new Date() };
      expect(userSchema.validate(validData).isValid).toBe(true);
    });

    it('should return false if data is not an object', () => {
      expect(userSchema.validate(null).isValid).toBe(false);
      expect(userSchema.validate('string').isValid).toBe(false);
      expect(userSchema.validate(123).isValid).toBe(false);
    });

   describe('_schema', () => {
     it('should correctly define the JSON schema properties', () => {
       expect(userSchema._schema.properties.id).toEqual({ type: 'number' });
       expect(userSchema._schema.properties.name).toEqual({ type: 'string' });
       expect(userSchema._schema.properties.email).toEqual({ type: 'string' });
       expect(userSchema._schema.properties.address).toEqual({
         type: 'string',
         minLength: 5,
         pattern: '^[A-Za-z\\s]+$'
       });
       expect(userSchema._schema.properties.createdAt).toEqual({
         type: 'timestamp',
       });
       expect(userSchema._schema.properties.birthDate).toEqual({
         type: 'date',
       });
       expect(userSchema._schema.properties.appointmentTime).toEqual({
         type: 'time',
       });
       expect(userSchema._schema.properties.lastLogin).toEqual({
         type: 'datetime-local',
       });
       expect(userSchema._schema.properties.age).toEqual({
         type: 'number',
         minimum: 0,
         maximum: 120
       });
       expect(userSchema._schema.properties.score).toEqual({
         type: 'number',
         exclusiveMinimum: 0
       });
     });

     it('should include required fields in the JSON schema', () => {
       expect(userSchema._schema.required).toEqual(['id', 'name', 'createdAt']);
     });
   });

   describe('numerical constraints', () => {
     it('should validate minimum and maximum for age', () => {
       const validData = { id: 5, name: 'Charlie', createdAt: new Date(), age: 30 };
       expect(userSchema.validate(validData).isValid).toBe(true);

       const belowMinimum = { id: 5, name: 'Charlie', createdAt: new Date(), age: -1 };
       expect(userSchema.validate(belowMinimum).isValid).toBe(false);

       const aboveMaximum = { id: 5, name: 'Charlie', createdAt: new Date(), age: 150 };
       expect(userSchema.validate(aboveMaximum).isValid).toBe(false);
     });

     it('should validate exclusiveMinimum for score', () => {
       const validData = { id: 6, name: 'Dave', createdAt: new Date(), score: 10 };
       expect(userSchema.validate(validData).isValid).toBe(true);

       const atExclusiveMinimum = { id: 6, name: 'Dave', createdAt: new Date(), score: 0 };
       expect(userSchema.validate(atExclusiveMinimum).isValid).toBe(false);

       const belowExclusiveMinimum = { id: 6, name: 'Dave', createdAt: new Date(), score: -5 };
       expect(userSchema.validate(belowExclusiveMinimum).isValid).toBe(false);
     });
   });

   it('should validate that createdAt is a Date instance or valid string', () => {
     const validData = { id: 1, name: 'John Doe', createdAt: new Date() };
     expect(userSchema.validate(validData).isValid).toBe(true);

     const validDataString = { id: 8, name: 'Frank', createdAt: '2025-02-14T14:23:00Z' };
     expect(userSchema.validate(validDataString).isValid).toBe(true);

     const invalidData = { id: 1, name: 'John Doe', createdAt: 'invalid-date-string' };
     expect(userSchema.validate(invalidData).isValid).toBe(false);
   });

   it('should validate that birthDate is a Date instance or valid string if provided', () => {
     const validData = { id: 2, name: 'Jane Doe', createdAt: new Date(), birthDate: new Date('1992-02-02') };
     expect(userSchema.validate(validData).isValid).toBe(true);

     const validDataString = { id: 9, name: 'Grace', createdAt: new Date(), birthDate: '1992-02-02' };
     expect(userSchema.validate(validDataString).isValid).toBe(true);

     // Only testing invalid format, should be YYYY-MM-DD. 
     // This can also be incorrect because February doesn't have 30 days.
     const invalidData = { id: 2, name: 'Jane Doe', createdAt: new Date(), birthDate: '1992/02/30' };
     expect(userSchema.validate(invalidData).isValid).toBe(false);
   });

   it('should validate that appointmentTime is a string in HH:MM:SS format if provided', () => {
     const validData = { id: 3, name: 'Alice', createdAt: new Date(), appointmentTime: '09:15:30' };
     expect(userSchema.validate(validData).isValid).toBe(true);

     const invalidData = { id: 3, name: 'Alice', createdAt: new Date(), appointmentTime: '9:15' };
     expect(userSchema.validate(invalidData).isValid).toBe(false);
   });

   it('should validate that lastLogin is a Date instance or valid string if provided', () => {
     const validData = { id: 4, name: 'Bob', createdAt: new Date(), lastLogin: new Date() };
     expect(userSchema.validate(validData).isValid).toBe(true);

     const validDataString = { id: 10, name: 'Hannah', createdAt: new Date(), lastLogin: '2023-10-10T10:00:00Z' };
     expect(userSchema.validate(validDataString).isValid).toBe(true);

     const invalidData = { id: 4, name: 'Bob', createdAt: new Date(), lastLogin: 'invalid-date-time-string' };
     expect(userSchema.validate(invalidData).isValid).toBe(false);
   });
  });
});
