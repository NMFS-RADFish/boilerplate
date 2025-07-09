import { vi } from 'vitest';
import Store from './Store';
import Schema from './Schema';
import Collection from './Collection';
import Connector from './Connector';

describe('Store', () => {
  let store;
  let mockConnector;
  
  beforeEach(() => {
    // Create a mock connector
    mockConnector = new Connector({
      initialize: vi.fn().mockResolvedValue(undefined)
    });
    
    // Mock collections property
    mockConnector.collections = {
      User: { name: 'User' }
    };
    
    // Create a store with the mock connector
    store = new Store({
      name: 'TestStore',
      connector: mockConnector
    });
  });
  
  it('should create a store with a connector', () => {
    expect(store.name).toBe('TestStore');
    expect(store.connector).toBe(mockConnector);
  });
  
  describe('getCollection', () => {
    it('should return a collection by name', () => {
      const collection = store.getCollection('User');
      expect(collection).toEqual({ name: 'User' });
    });
  });
  
  describe('open', () => {
    it('should log a warning', async () => {
      console.warn = vi.fn();
      
      await store.open();
      
      expect(console.warn).toHaveBeenCalledWith('Store.open() is not implemented');
    });
  });
  
  describe('close', () => {
    it('should log a warning', async () => {
      console.warn = vi.fn();
      
      await store.close();
      
      expect(console.warn).toHaveBeenCalledWith('Store.close() is not implemented');
    });
  });
});