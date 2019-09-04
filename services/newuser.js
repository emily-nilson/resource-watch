import { logger } from 'utils/logs';
import { localAPI, controlTowerAPI } from 'utils/axios';

/**
 * Logs in a user based on email + password combination
 */
export const loginUser = ({ email, password }) => (
  localAPI.post('local-sign-in',
    { email, password },
    { headers: { 'Content-Type': 'application/json' } })
    .then(response => response.data)
);

// sends a request to reset password.
// It generates a token to use in resetPassword
export const forgotPassword = ({ email }) => (
  controlTowerAPI.post('auth/reset-password',
    { email },
    { params: { origin: process.env.APPLICATIONS } })
    .then(response => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;

      if (status >= 300) {
        logger.error('Error requesting token for password reset:', `${status}: ${statusText}`);
        console.error(statusText);
        throw new Error(statusText);
      }
    })
);

/**
 * Register a new user based on email + password combination
 */
export const registerUser = ({ email, password, repeatPassword }) => (
  controlTowerAPI.post('auth/sign-up',
    {
      email,
      password,
      repeatPassword,
      apps: [process.env.APPLICATIONS]
    },
    { headers: { 'Content-Type': 'application/json' } })
    .then((response) => {
      if (response.ok) return response.json();
      throw response;
    })
);

export default {
  loginUser,
  forgotPassword,
  registerUser
};
