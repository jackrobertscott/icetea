describe('const store = Store.create()', () => {
  it.skip('should create a instance of Store');
  it.skip('should validate the config object has the correct properties');
  describe('store.state', () => {
    it.skip('should clone state object rather than mutating the original');
  });
  describe('store.errors', () => {
    it.skip('should clone errors object rather than mutating the original');
  });
  describe('store.watch()', () => {
    it.skip('should trigger an update and call the watched function');
    it.skip('should not trigger an update');
    it.skip('should provide the updated store values to the watched function');
    it.skip('should not trigger an error when the validator succeeds');
    it.skip('should trigger an error when a regular validator function fails');
    it.skip('should trigger an error when a yup validator fails');
  });
});
