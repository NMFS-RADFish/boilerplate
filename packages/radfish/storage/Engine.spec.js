import Engine from './Engine';

describe('Engine', () => {
  it('should not allow direct instantiation', () => {
    expect(() => new Engine()).toThrow("Cannot instantiate abstract class Engine directly.");
  });

  it('should throw error for initialize method', async () => {
    class TestEngine extends Engine {}
    const testEngine = new TestEngine();
    await expect(testEngine.initialize()).rejects.toThrow("Method 'initialize()' must be implemented.");
  });

  it('should throw error for create method', async () => {
    class TestEngine extends Engine {}
    const testEngine = new TestEngine();
    await expect(testEngine.create('Test', {})).rejects.toThrow("Method 'create()' must be implemented.");
  });

  it('should throw error for find method', async () => {
    class TestEngine extends Engine {}
    const testEngine = new TestEngine();
    await expect(testEngine.find('Test', {})).rejects.toThrow("Method 'find()' must be implemented.");
  });

  it('should throw error for delete method', async () => {
    class TestEngine extends Engine {}
    const testEngine = new TestEngine();
    await expect(testEngine.delete('Test', [])).rejects.toThrow("Method 'delete()' must be implemented.");
  });

  it('should throw error for delete method with records to delete', async () => {
    class TestEngine extends Engine {}
    const testEngine = new TestEngine();
    const records = [{ id: '1', name: 'Test' }, { id: '2', name: 'Test2' }];
    await expect(testEngine.delete('Test', records)).rejects.toThrow("Method 'delete()' must be implemented.");
  });
});
