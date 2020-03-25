/* eslint-disable import/prefer-default-export */
import * as api from '@/api';

export const savePatientSignUp = async ({ state }) => {
  try {
    const patient = { ...state };
    const campaignSaved = await api.patients.save(patient);
    return campaignSaved;
  } catch (error) {
    console.log('Error saving patient:', error);
    throw error;
  }
};
