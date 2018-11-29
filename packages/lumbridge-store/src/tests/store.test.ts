import { expect } from 'chai';
import { fake } from 'sinon';
import { number } from 'yup';
import { Store } from '..';
import { ISchema, IErrors } from '../modules/Store';

const createFakeStore = (override?: ISchema) =>
  Store.create({
    schema: override || {
      memes: {
        state: '',
        validate: (value: any) => typeof value === 'string',
      },
      dreams: {
        state: 42,
        validate: number().required(),
      },
    },
  });

describe('const store = Store.create()', () => {
  it('should create a instance of Store', () => {
    const store = Store.create({ schema: {} });
    expect(store).to.be.instanceOf(Store);
  });
  it.skip('should validate the config object has the correct properties');
  describe('store.state', () => {
    it('should clone state object rather than mutating the original', () => {
      const fakeStore = createFakeStore();
      const original = fakeStore.state;
      fakeStore.update({});
      const updated = fakeStore.state;
      expect(original === updated).to.equal(false);
    });
  });
  describe('store.errors', () => {
    it('should clone errors object rather than mutating the original', () => {
      const fakeStore = createFakeStore();
      fakeStore.update({ dreams: 'Wrong type.' });
      const original = fakeStore.errors;
      fakeStore.update({ dreams: 'Wrong type.' });
      const updated = fakeStore.errors;
      expect(original === updated).to.equal(false);
    });
  });
  describe('store.watch()', () => {
    it('should trigger an update and call the watched function', () => {
      const spy = fake();
      const fakeStore = createFakeStore();
      const unwatch = fakeStore.watch({ state: () => spy() });
      fakeStore.update({});
      expect(spy.calledOnce).to.equal(true);
      unwatch();
    });
    it('should not trigger an update', () => {
      const spy = fake();
      const fakeStore = createFakeStore();
      const unwatch = fakeStore.watch({ state: () => spy() });
      expect(spy.calledOnce).to.equal(false);
      unwatch();
    });
    it('should provide the updated store values to the watched function', () => {
      const check = 'Hello world!';
      const fakeStore = createFakeStore();
      const unwatch = fakeStore.watch({
        state: ({ memes }) => expect(memes).to.equal(check),
      });
      fakeStore.update({ memes: check });
      unwatch();
    });
    it('should not trigger an error when the validator succeeds', done => {
      let theErrors: IErrors = {};
      const spy = fake();
      const fakeStore = createFakeStore();
      const unwatch = fakeStore.watch({
        errors: errors => {
          theErrors = errors;
          spy();
        },
      });
      fakeStore.update({ memes: 'Valid string.' });
      setTimeout(() => {
        expect(Object.keys(theErrors).length).to.equal(0);
        expect(spy.calledOnce).to.equal(true);
        unwatch();
        done();
      });
    });
    it('should trigger an error when a regular validator function fails', done => {
      let theErrors: IErrors = {};
      const fakeStore = createFakeStore();
      const unwatch = fakeStore.watch({
        errors: errors => {
          theErrors = errors;
        },
      });
      fakeStore.update({ memes: 42 as any });
      setTimeout(() => {
        expect(theErrors.memes).to.be.instanceOf(Error);
        expect(theErrors.memes.message).to.equal('The memes is not valid.');
        unwatch();
        done();
      });
    });
    it('should trigger an error when a yup validator fails', done => {
      let theErrors: IErrors = {};
      const fakeStore = createFakeStore();
      const unwatch = fakeStore.watch({
        errors: errors => {
          theErrors = errors;
        },
      });
      fakeStore.update({ dreams: 'balony' });
      setTimeout(() => {
        expect(theErrors.dreams).to.be.instanceOf(Error);
        expect(theErrors.dreams.message).to.equal(
          'this must be a `number` type, but the final value was: `NaN` (cast from the value `"balony"`).'
        );
        unwatch();
        done();
      });
    });
    it.skip('should stop listening to watch functions after unwatch()');
  });
});
