import { expect } from 'chai';
import { fake } from 'sinon';
import { number } from 'yup';
import { Store } from '..';

describe('const store = Store.create()', () => {
  it('should create a instance of Store', () => {
    const store = Store.create({
      schema: {},
    });
    expect(store).to.be.instanceOf(Store);
  });
  describe('store.watch()', () => {
    let fakeStore: Store;
    beforeEach(() => {
      fakeStore = Store.create({
        schema: {
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
    });
    it('should trigger an update and call the watched function', () => {
      const spy = fake();
      const unwatch = fakeStore.watch({ state: () => spy() });
      fakeStore.update({});
      expect(spy.calledOnce).to.equal(true);
      unwatch();
    });
    it('should not trigger an update', () => {
      const spy = fake();
      const unwatch = fakeStore.watch({ state: () => spy() });
      expect(spy.calledOnce).to.equal(false);
      unwatch();
    });
    it('should provide the updated store values to the watched function', () => {
      const check = 'Hello world!';
      const unwatch = fakeStore.watch({
        state: ({ memes }) => expect(memes).to.equal(check),
      });
      fakeStore.update({ memes: check });
      unwatch();
    });
    it('should not trigger an error when the validator succeeds', done => {
      const spy = fake();
      const unwatch = fakeStore.watch({
        errors: args => (console.log(args) as any) || spy(),
      });
      fakeStore.update({ memes: 'Valid string.' });
      setTimeout(() => {
        expect(spy.calledOnce).to.equal(false);
        unwatch();
        done();
      });
    });
    it('should trigger an error when a regular validator function fails', done => {
      let collection: any = {};
      const unwatch = fakeStore.watch({
        errors: errors => {
          collection = errors;
        },
      });
      fakeStore.update({ memes: 42 as any });
      setTimeout(() => {
        expect(collection.memes).to.equal('The memes is not valid.');
        unwatch();
        done();
      });
    });
    it('should trigger an error when a yup validator fails', done => {
      let collection: any = {};
      const unwatch = fakeStore.watch({
        errors: errors => {
          collection = errors;
        },
      });
      fakeStore.update({ dreams: 'balony' });
      setTimeout(() => {
        expect(collection.memes).to.equal('The memes is not valid.');
        unwatch();
        done();
      });
    });
  });
});
