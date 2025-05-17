import Schema from './Schema';
import Connector from './Connector';
import Collection from './Collection';

describe('Connector', () => {
  let mockEngine;
  let connector;

  beforeEach(() => {
    mockEngine = new EventTarget();
    mockEngine.initialize = jest.fn().mockResolvedValue();
    mockEngine.create = jest.fn().mockResolvedValue(1);
    mockEngine.find = jest.fn().mockResolvedValue([{ id: 1, name: 'Alice' }]);
    mockEngine.delete = jest.fn().mockResolvedValue(true);

    connector = new Connector(mockEngine);
  });

  it('should initialize and emit init event', async () => {
    const initCallback = jest.fn();
    connector.addEventListener('init', (event) => initCallback(event.detail));

    await connector.initialize(initCallback);

    expect(mockEngine.initialize).toHaveBeenCalled();
    expect(initCallback).toHaveBeenCalledWith(null, connector);
  });

  it('should emit error event if initialization fails', async () => {
    const errorCallback = jest.fn();
    const initCallback = jest.fn();
    connector.addEventListener('error', (event) => errorCallback(event.detail));

    mockEngine.initialize.mockRejectedValue(new Error('Initialization failed'));

    await connector.initialize(initCallback);

    expect(errorCallback).toHaveBeenCalledWith(new Error('Initialization failed'));
    expect(initCallback).toHaveBeenCalledWith(new Error('Initialization failed'), connector);
  });

  it('should add a collection to the connector', () => {
    const schema = new Schema({
      name: 'User',
      fields: {
        id: { type: 'number', required: true, primaryKey: true },
        name: { type: 'string', required: true },
      }
    });
    
    connector.addCollection(schema);
    
    expect(connector.collections).toHaveProperty('User');
    expect(connector.collections.User).toBeInstanceOf(Collection);
    expect(connector.collections.User.schema).toBe(schema);
  });
});
