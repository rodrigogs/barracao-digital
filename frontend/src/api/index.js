import axios from 'axios';
import { API_URL } from '@/config';
import authAdapter from './auth';
import patientsAdapter from './patients';
import doctorsAdapter from './doctors';
import volunteersAdapter from './volunteers';
import facilitiesAdapter from './facilities';

const request = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: '',
  },
});

let STORE;
const getStore = async () => {
  if (!STORE) {
    STORE = await import('@/store').then((store) => store.default);
  }
  return STORE;
};

// Dynamic importo to avoid circular dependency
const retrieveAuthToken = () => getStore().then((store) => {
  const loggedUser = store.getters['auth/loggedUser'];
  if (!loggedUser) return '';
  return btoa(`${loggedUser.username}:${loggedUser.password}`);
});

const logoutUser = () => getStore().then((store) => store.dispatch['auth/logout']);

// Intercept requests and update auth token
request.interceptors.request.use(async (config) => {
  const newConfig = { ...config };
  const authToken = await retrieveAuthToken();

  newConfig.headers.Authorization = `Basic ${authToken}`;

  return newConfig;
}, Promise.reject);

request.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error && error.response && error.response.status === 401) {
      await logoutUser();
    }
    return Promise.reject(error);
  },
);

const healthCheckAdapter = async (shadowRequest) => (await shadowRequest.get('/')).data;

export const healthCheck = healthCheckAdapter(request);
export const auth = authAdapter(request);
export const doctors = doctorsAdapter(request);
export const patients = patientsAdapter(request);
export const volunteers = volunteersAdapter(request);
export const facilities = facilitiesAdapter(request);
