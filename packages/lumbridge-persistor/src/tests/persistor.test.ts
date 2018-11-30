import { expect } from 'chai';
import { string, object } from 'yup';
import { Persistor } from '..';

const createFakePersistor = (override?: any) =>
  Persistor.create({
    methods: {
      store: {
        payload: {
          id: string().required(),
          data: object().required(),
        },
        handler: ({ id, data }) => {
          return new Promise((resolve, reject) => {
            try {
              const save = JSON.stringify(data);
              localStorage.setItem(id, save);
              resolve({ id, data });
            } catch (error) {
              reject(error);
            }
          });
        },
      },
    },
  });

describe('const persistor = Persistor.create()', () => {
  it('should create a instance of Persistor', () => {
    const persistor = Persistor.create({ methods: {} });
    expect(persistor).to.be.instanceOf(Persistor);
  });
  describe('const instance = persistor.instance()', () => {
    it.skip('should create an instance of the Instance class');
  });
  describe('instance.watch()', () => {
    it.skip('should trigger data when execute succeeds');
    it.skip('should not trigger data when execute fails');
  });
  describe('instance.execute()', () => {
    it.skip('should call the persistor handler');
  });
});
