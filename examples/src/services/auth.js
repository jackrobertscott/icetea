import localPersistor from '../persistors/localPersistor';

export const setAuthInstance = localPersistor.instance({
  name: 'store',
  map: ({ data }) => ({
    id: 'auth',
    data,
  }),
});

export const getAuthInstance = localPersistor.instance({
  name: 'retrieve',
  map: () => ({
    id: 'auth',
  }),
});
