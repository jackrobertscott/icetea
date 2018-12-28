import { expect } from 'code';
import Store from '../modules/Store';

describe('const store = Store.create()', () => {
  it('should create an instance without error', () => {
    const store = Store.create();
    expect(store).to.be.instanceOf(Store);
  });
});
