import { expect } from 'code';
import { fake } from 'sinon';
import Persistor from '../modules/Persistor';

describe('const persistor = Persistor.create()', () => {
  it('should create an instance without error', () => {
    const persistor = Persistor.create();
    expect(persistor).to.be.instanceOf(Persistor);
  });
  it('should add and execute an action', () => {
    const persistor = Persistor.create().action({
      name: 'query',
      handler: data => data,
    });
    const instance = persistor.on.query({ hello: true });
    const spy = fake();
    const unwatch = instance.watch({
      data: data => spy(data),
    });
    instance.execute();
    instance.execute();
    expect(spy.called).to.equal(true);
    expect(spy.callCount).to.equal(2);
    expect(spy.args).to.equal([[{ hello: true }], [{ hello: true }]]);
    unwatch();
  });
});
