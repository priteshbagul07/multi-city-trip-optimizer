import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export const solveNetwork = (cities, edges) =>
  API.post('/solve', { cities, edges });

export const saveNetwork = (name, cities, edges) =>
  API.post('/networks', { name, cities, edges });

export const getNetworks = () =>
  API.get('/networks');

export const deleteNetwork = (id) =>
  API.delete(`/networks/${id}`);

export const solveById = (id) =>
  API.post(`/solve/${id}`);
