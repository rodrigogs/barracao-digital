import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/paciente/registrar',
    name: 'PatientSignUp',
    component: () => import('../views/PatientSignUp.vue'),
  },
  {
    path: '/paciente/senha/:ticket',
    name: 'PatientEnqueued',
    component: () => import('../views/PatientEnqueued.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
