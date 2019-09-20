// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

// API docs: TBD

/**
 * Fetchs dashboards according to params.
 *
 * @param {Object[]} params - params sent to the API.
 * @returns {Object[]} array of serialized dashboards.
 */
export const fetchDashboards = (params = {}, headers = {}) => {
  logger.info('Fetch dashboards');
  return WRIAPI.get('dashboard', {
    headers: {
      ...WRIAPI.defaults.headers,
      ...headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: {
      env: process.env.API_ENV,
      application: [process.env.APPLICATIONS],
      ...params
    }
  }).then(response => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error('Error fetching dashboards:', `${status}: ${statusText}`);
    });
};

/**
 * fetchs data for a specific dashboard.
 *
 * @param {String} id - dashboard id.
 * @returns {Object} serialized specified dashboard.
 */
export const fetchDashboard = (id) => {
  logger.info(`Fetch dashboard ${id}`);
  return WRIAPI.get(`dashboard/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      // TO-DO: forces the API to not cache, this should be removed at some point
      'Upgrade-Insecure-Requests': 1
    },
    params: { env: process.env.API_ENV, application: [process.env.APPLICATIONS] }
  })
    .then(response => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error fetching dashboard: ${id}`, `${status}: ${statusText}`);
    });
};

/**
 * Creates a dashboard with the provided data.
 * This fetch needs authentication.
 *
 * @param {Object} body - data provided to create the new dashboard.
 * @param {String} token - user's token.
 * @returns {Object} serialized created dashboard.
 */
export const createDashboard = (body, token) => {
  logger.info('Create dashboard');
  return WRIAPI.post('dashboard', {
    ...body,
    application: [process.env.APPLICATIONS],
    env: process.env.API_ENV
  }, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then(response => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error creating dashboard ${status}: ${statusText}`);
    });
};

/**
 * Updates a specified dashboard with the provided data.
 * This fetch needs authentication.
 *
 * @param {String} id - dashboard ID to be updated.
 * @param {Object} body - data provided to update the dashboard.
 * @param {String} token - user's token
 * @returns {Object} serialized dashboard with updated data
 */
export const updateDashboard = (id, body, token) => {
  logger.info(`Update dashboard ${id}`);
  return WRIAPI.patch(`dashboard/${id}`, { ...body }, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then(response => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating dashboard ${id} ${status}: ${statusText}`);
    });
};

/**
 * Deletes a specified dashboard.
 * This fetch needs authentication.
 *
 * @param {*} id - dashboard ID to be deleted.
 * @param {string} token - user's token.
 * @returns {Object} fetch response.
 */
export const deleteDashboard = (id, token) => {
  logger.info(`Delete dashboard ${id}`);
  return WRIAPI.delete(`dashboard/${id}`, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then(response => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error deleting dashboard ${id} ${status}: ${statusText}`);
    });
};

/**
 * Clones a topic to convert it into a dashboard based on topic's data.
 * This fetch needs authentication.
 *
 * @param {String} id - topic ID to be cloned.
 * @param {string} token - user's token.
 * @return {Object} serialized dashboard cloned based on the ID topic.
 */
export const cloneDashboard = (id, token) => {
  logger.info(`Clone dashboard from topic ${id}`);
  return WRIAPI.post(`topics/${id}/clone-dashboard`, {}, {
    headers: {
      ...WRIAPI.defaults.headers,
      Authorization: token
    }
  })
    .then(response => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error cloning dashboard from topic ${id} ${status}: ${statusText}`);
    });
};

export default {
  fetchDashboards,
  fetchDashboard,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  cloneDashboard
};
