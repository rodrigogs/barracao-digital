import cookie from 'vue-cookie';

export const acceptConsent = (state) => {
  cookie.set('consent-accepted', 'true', 360);
  state.isConsentAccepted = true;
};
