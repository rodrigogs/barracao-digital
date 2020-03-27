import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    requiresAuth: false,
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: {
      title: 'Barracão Online COVID-19',
      requiresAuth: false,
    },
  },
  {
    path: '/login',
    name: 'DoctorLogin',
    component: () => import(/* webpackChunkName: "doctor-login" */ '../views/DoctorLogin.vue'),
    meta: {
      title: 'Login do Médico',
      requiresAuth: false,
    },
  },
  {
    path: '/medicos/fila',
    name: 'DoctorWorklist',
    component: () => import(/* webpackChunkName: "doctor-worklist" */ '../views/DoctorWorklist.vue'),
    meta: {
      title: 'Lista de Trabalho do Médico',
      requiresAuth: true,
    },
  },
  {
    path: '/pacientes/registrar',
    name: 'PatientSignUp',
    component: () => import(/* webpackChunkName: "patient-signup" */ '../views/PatientSignUp.vue'),
    meta: {
      title: 'Entrar na Fila',
      requiresAuth: false,
    },
  },
  {
    path: '/pacientes/login',
    name: 'PatientLogin',
    component: () => import(/* webpackChunkName: "patient-login" */ '../views/PatientLogin.vue'),
    meta: {
      title: 'Verificar posição na fila',
      requiresAuth: false,
    },
  },
  {
    path: '/pacientes/senha/:ticket',
    name: 'PatientEnqueued',
    component: () => import(/* webpackChunkName: "patient-enqueued" */ '../views/PatientEnqueued.vue'),
    meta: {
      title: 'Fila de Espera',
      requiresAuth: false,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : 'Untitled page';

  if (to.meta.requiresAuth && !store.getters['auth/isLoggedIn']) {
    next({ name: 'DoctorLogin' });
  } else {
    next();
  }
});

export default router;
