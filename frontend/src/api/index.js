import axios from 'axios';
import nuxtStorage from 'nuxt-storage';

const http = axios.create({
  baseURL: process.env.BASE_URL ? `${process.env.BASE_URL}/api` : '/api',
});

http.interceptors.request.use(
  (config) => {
    const loggedUser = getLoggedUser();
    const token = loggedUser ? loggedUser.token : '';
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use((response) => response, (error) => Promise.reject(error.response));

http.defaults.headers.common['If-Modified-Since'] = '0';
http.defaults.timeout = 180000;

export default {
  doLogin(user) {
    return http.post('/login', user)
      .then((response) => response.data);
  },
  subcribeNewsletter(subscriber) {
    return http.post('/newsletter', subscriber)
      .then((response) => response.data);
  },
  listCelebrities({ pagination = {}, filters = {}, sort = {} }) {
    return http.get('/celebrities', { params: { ...pagination, ...filters, ...sort } })
      .then((response) => response.data);
  },
  findCelebrity(celebrityId) {
    return http.get(`/celebrities/${celebrityId}`)
      .then((response) => response.data);
  },
  createCelebrity(newCelebrity) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return http.post('/celebrities', newCelebrity, config)
      .then((response) => response.data);
  },
  updateCelebrity(celebrityId, celebrity) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return http.put(`/celebrities/${celebrityId}`, celebrity, config)
      .then((response) => response.data);
  },
  deleteCelebrity(celebrityId) {
    return http.delete(`/celebrities/${celebrityId}`)
      .then((response) => response.data);
  },
  listVideoRequests({ pagination = {}, filters = {}, sort = {} }) {
    return http.get('/video-requests', { params: { ...pagination, ...filters, ...sort } })
      .then((response) => response.data);
  },
  findVideoRequest(videoRequestId) {
    return http.get(`/video-requests/${videoRequestId}`)
      .then((response) => response.data);
  },
  createCheckout(videoRequest) {
    return http.post('/video-requests', videoRequest)
      .then((response) => response.data);
  },
  loadPaymentInformation(transactionCode) {
    return http.get(`/video-requests/transaction/${transactionCode}`)
      .then((response) => response.data);
  },
  listFitys({ pagination = {}, filters = {}, sort = {} }) {
    return http.get('/fitys', { params: { ...pagination, ...filters, ...sort } })
      .then((response) => response.data);
  },
  updateFity(fityId, fity) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return http.put(`/fitys/${fityId}`, fity, config)
      .then((response) => response.data);
  },
  authCheck() {
    return http.get('/login/check')
      .then((response) => response.data);
  },
};

function getLoggedUser() {
  return nuxtStorage.localStorage.getData('mandafity-user');
}
