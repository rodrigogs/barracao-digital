import axios from 'axios';
import { API_URL } from '@/config';
import doctorsAdapter from './doctors';

const request = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: '',
  },
});

// Dynamic importo to avoid circular dependency
const retrieveAuthToken = () => import('@/store').then(({ default: store }) => {
  const loggedUser = store.getters['auth/loggedUser'];
  if (!loggedUser) return '';
  return btoa(`${loggedUser.username}:${loggedUser.password}`);
});

// Intercept requests and update auth token
request.interceptors.request.use(async (config) => {
  const newConfig = { ...config };
  const authToken = await retrieveAuthToken();

  newConfig.headers.Authorization = `Basic ${authToken}`;

  return newConfig;
}, Promise.reject);

const healthCheckAdapter = async (shadowRequest) => (await shadowRequest.get('/')).data;

export const healthCheck = healthCheckAdapter(request);
export const doctors = doctorsAdapter(request);
