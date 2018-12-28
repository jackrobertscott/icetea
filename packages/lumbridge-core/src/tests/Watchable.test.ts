import { expect } from 'code';
import { fake } from 'sinon';
import Watchable from '../modules/Watchable';

describe('const watchable = new Watchable()', () => {
  it('should create an instance without error', () => {
    const watchable = new Watchable();
    expect(watchable).to.be.instanceOf(Watchable);
  });
  it('should not call a function without invoking batch', () => {
    const spy = fake();
    const watchable = new Watchable();
    const unwatch = watchable.watch({
      state: () => spy(),
    });
    expect(spy.called).to.equal(false);
    expect(spy.callCount).to.equal(0);
    unwatch();
  });
  it('should call watch function after invoking batch', () => {
    const spy = fake();
    const watchable = new Watchable();
    const unwatch = watchable.watch({
      state: () => spy(),
    });
    (watchable as any).batch({ state: null });
    expect(spy.called).to.equal(true);
    expect(spy.callCount).to.equal(1);
    unwatch();
  });
  it('should not call a function which is not passed a value', () => {
    const spy = fake();
    const watchable = new Watchable();
    const unwatch = watchable.watch({
      state: () => spy(),
    });
    (watchable as any).batch({ notState: null });
    expect(spy.called).to.equal(false);
    expect(spy.callCount).to.equal(0);
    unwatch();
  });
  it('should call a function multiple times', () => {
    const spy = fake();
    const watchable = new Watchable();
    const unwatch = watchable.watch({
      state: () => spy(),
    });
    (watchable as any).batch({ state: 1 });
    (watchable as any).batch({ state: 2 });
    expect(spy.called).to.equal(true);
    expect(spy.callCount).to.equal(2);
    unwatch();
  });
});
