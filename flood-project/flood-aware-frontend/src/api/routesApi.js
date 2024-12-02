import httpClient from './httpClient';

export const getRoutes = async () => {
  const response = await httpClient.get('/routes');
  return response.data;
};

export const createRoute = async (routeData) => {
  const response = await httpClient.post('/routes', routeData);
  return response.data;
};

export const deleteRoute = async (id) => {
  const response = await httpClient.delete(`/routes/${id}`);
  return response.data;
};
