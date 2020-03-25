import Vue from 'vue';
import defaultState from './default-state';

export const setStepFields = (state, stepFields) => Object.keys(stepFields).forEach((fieldName) => {
  const value = stepFields[fieldName];
  Vue.set(state, fieldName, value);
});

export const clearForm = (state) => Object.keys(defaultState).forEach((fieldName) => {
  const value = defaultState[fieldName];
  Vue.set(state, fieldName, value);
});
