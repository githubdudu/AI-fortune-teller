export const ERROR_CAUSES = {
  SIGN_IN_WITH_GOOGLE: 'sign_in_with_google',
  SIGN_IN_WITH_EMAIL: 'sign_in_with_email',
};

/**
 * Error codes reference:
 * https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signinwithpopup
 */
export const ERROR_CODES = {
  AUTH_POPUP_CLOSED_BY_USER: 'auth/popup-closed-by-user',
  AUTH_POPUP_BLOCKED: 'auth/popup-blocked',
  AUTH_CANCELLED_POPUP_REQUEST: 'auth/cancelled-popup-request',
  AUTH_INVALID_EMAIL: 'auth/invalid-email',
  AUTH_USER_DISABLED: 'auth/user-disabled',
  AUTH_USER_NOT_FOUND: 'auth/user-not-found',
  AUTH_WRONG_PASSWORD: 'auth/wrong-password',
  AUTH_INVALID_CREDENTIAL: 'auth/invalid-credential',
};
