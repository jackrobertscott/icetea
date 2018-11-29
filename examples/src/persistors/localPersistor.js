import { Persistor } from 'lumbridge';
import { string, object } from 'yup';

export default Persistor.create({
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
    retrieve: {
      payload: {
        id: string().required(),
      },
      handler: ({ id }) => {
        return new Promise((resolve, reject) => {
          try {
            const encode = localStorage.getItem(id);
            const data = JSON.parse(encode);
            resolve({ id, data });
          } catch (error) {
            reject(error);
          }
        });
      },
    },
  },
});
