import cookie from 'vue-cookie';

export const isConsentAccepted = (state) => {
  if (state.isConsentAccepted) return true;
  const consentCookie = cookie.get('consent-accepted');
  return !!consentCookie;
};
