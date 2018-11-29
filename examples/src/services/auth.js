import localPersistor from '../persistors/localPersistor';

export const setAuthInstance = localPersistor.instance.store(({ data }) => ({
  id: 'auth',
  data,
}));

export const getAuthInstance = localPersistor.instance.retrieve(() => ({
  id: 'auth',
}));
