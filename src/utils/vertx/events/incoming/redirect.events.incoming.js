// import { REDIRECT, SOCIAL_REDIRECT as SOCIAL } from 'constants';

export const CMD_REDIRECT = message => ({
  type: 'REDIRECT',
  payload: message.redirect_url,
});

export const SOCIAL_REDIRECT = message => ({
  type: 'SOCIAL',
  payload: message,
});
