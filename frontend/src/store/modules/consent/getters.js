import cookie from 'vue-cookie';

// eslint-disable-next-line import/prefer-default-export
export const isConsentAccepted = (state) => {
  if (state.isConsentAccepted) return true;
  const consentCookie = cookie.get('consent-accepted');
  return !!consentCookie;
};
