import httpClient from './httpClient';

export const getReports = async (page, limit, severity, status) => {
  // const { page, limit, severity, status } = filters;
   // Create the query string with the filters
   const queryString = new URLSearchParams({
    page:page,
    limit:limit,
    severity:severity,
    status:status
  }).toString();

  const response = await httpClient.get(`/reports?${queryString}`);
  return response.data;
};

export const createReport = async (reportData) => {
  const response = await httpClient.post('/reports', reportData);
  return response.data;
};

export const updateReport = async (id, reportData) => {
  const response = await httpClient.put(`/reports/${id}`, reportData);
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await httpClient.delete(`/reports/${id}`);
  return response.data;
};
