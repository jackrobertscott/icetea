import { expect } from 'chai';
import { Persistor } from '..';

describe('Persistor', () => {
  it('should create a instance of Persistor', () => {
    const persistor = Persistor.create({
      methods: {},
    });
    expect(persistor).to.be.instanceOf(Persistor);
  });
});
