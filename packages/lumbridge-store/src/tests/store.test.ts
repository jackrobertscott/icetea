import { expect } from 'chai';
import { Store } from '..';

describe('Store', () => {
  it('should create a instance of Store', () => {
    const store = Store.create({
      schema: {},
    });
    expect(store).to.be.instanceOf(Store);
  });
  describe('watch', () => {
    let fakeStore: Store;
    before(() => {
      fakeStore = Store.create({
        schema: {
          memes: {
            state: '',
            validate: (value: any) => typeof value === 'string',
          },
        },
      });
    });
    it('should watch for changes in state', () => {
      const unwatch = fakeStore.watch({
        state: ({ memes }) => expect(memes).to.equal('hello'),
      });
      fakeStore.update({ memes: 'hello' });
      unwatch();
    });
    it('should watch for changes in state', done => {
      const unwatch = fakeStore.watch({
        errors: ({ memes }) => {
          expect(memes).to.equal('The memes is not valid.');
          unwatch();
          done();
        },
      });
      fakeStore.update({ memes: 42 as any });
    });
  });
});
