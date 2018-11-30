import { Store } from 'lumbridge';
import { string, boolean } from 'yup';

export default Store.create({
  schema: {
    userId: {
      state: null,
      validate: string().nullable(),
    },
    token: {
      state: null,
      validate: string().nullable(),
    },
    loggedIn: {
      state: false,
      validate: boolean().required(),
    },
  },
  actions: {
    authenticate: ({ userId, token } = {}) => ({
      userId,
      token,
      loggedIn: Boolean(userId && token),
    }),
  },
});
