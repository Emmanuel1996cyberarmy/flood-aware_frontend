import httpClient from './httpClient';

export const getUser = async (id) => {
  const response = await httpClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await httpClient.post('/users/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
    const response = await httpClient.post('/users/login', credentials);
    
    return response.data; // Expecting { user, _id }
  };

export const updateUser = async (id, userData) => {
  const response = await httpClient.put(`/users/${id}`, userData);
  console.log(response, "@@update user")
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await httpClient.delete(`/users/${id}`);
  return response.data;
};
