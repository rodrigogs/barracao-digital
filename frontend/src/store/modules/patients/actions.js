import * as api from '@/api';

// eslint-disable-next-line import/prefer-default-export
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
