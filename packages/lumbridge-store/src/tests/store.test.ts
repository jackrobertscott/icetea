import { expect } from 'chai';
import { Store } from '..';

describe('Store', () => {
  it('should create a instance of Store', () => {
    const store = Store.create({});
    expect(store).to.be.instanceOf(Store);
  });
});
