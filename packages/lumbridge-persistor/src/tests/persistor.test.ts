import { expect } from 'code';
import Persistor from '../modules/Persistor';

describe('const persistor = Persistor.create()', () => {
  it('should create an instance without error', () => {
    const persistor = Persistor.create();
    expect(persistor).to.be.instanceOf(Persistor);
  });
});
