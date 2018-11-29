import { expect } from 'chai';
import { Persistor } from '..';

describe('const persistor = Persistor.create()', () => {
  it('should create a instance of Persistor', () => {
    const persistor = Persistor.create({ methods: {} });
    expect(persistor).to.be.instanceOf(Persistor);
  });
  describe('persistor.instance', () => {
    it.skip('should be filled properties which match the config method names');
  });
  describe('const instance = persistor.instance[methodName]()', () => {
    it.skip('should create an instance of the Instance class');
  });
  describe('instance.watch()', () => {
    it.skip('should');
  });
  describe('instance.execute()', () => {
    it.skip('should');
  });
});
