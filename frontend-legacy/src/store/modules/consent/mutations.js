import cookie from 'vue-cookie';

// eslint-disable-next-line import/prefer-default-export
export const acceptConsent = (state) => {
  cookie.set('consent-accepted', 'true', 360);
  state.isConsentAccepted = true;
};
