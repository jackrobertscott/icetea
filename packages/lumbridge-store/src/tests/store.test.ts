import { expect } from 'code';
import { fake } from 'sinon';
import Store from '../modules/Store';

describe('const store = Store.create()', () => {
  it('should create an instance without error', () => {
    const store = Store.create();
    expect(store).to.be.instanceOf(Store);
  });
  it('should store and listen to data', () => {
    const store = Store.create()
      .assign({
        name: 'token',
        default: null,
      })
      .assign({
        name: 'count',
        default: 0,
      });
    const spy = fake();
    const unwatch = store.watch({
      state: state => spy(state),
    });
    expect(store.state).to.equal({
      token: null,
      count: 0,
    });
    store.update({ count: 1 });
    store.update({ token: 'im-a-token' });
    expect(spy.called).to.equal(true);
    expect(spy.callCount).to.equal(2);
    expect(spy.args).to.equal([
      [{ count: 1, token: null }],
      [{ count: 1, token: 'im-a-token' }],
    ]);
    unwatch();
  });
  it('should use actions to patch data', () => {
    const store = Store.create()
      .assign({
        name: 'count',
        default: 0,
      })
      .action({
        name: 'increment',
        execute: ({ state, data }) => ({
          count: state.count + data.amount,
        }),
      });
    const spy = fake();
    const unwatch = store.watch({
      state: state => spy(state),
    });
    expect(store.state).to.equal({ count: 0 });
    store.dispatch.increment({ amount: 2 });
    expect(store.state).to.equal({ count: 2 });
    expect(spy.called).to.equal(true);
    expect(spy.callCount).to.equal(1);
    expect(spy.args).to.equal([[{ count: 2 }]]);
    unwatch();
  });
});
