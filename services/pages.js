import 'isomorphic-fetch';
import { get, post, remove } from 'utils/request';

import sortBy from 'lodash/sortBy';
import { Deserializer } from 'jsonapi-serializer';

export default class PagesService {
  constructor(options = {}) {
    this.opts = options;
  }

  // GET ALL DATA
  fetchAllData() {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/static_page/?published=all&application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        },
        {
          key: 'Upgrade-Insecure-Requests',
          value: 1
        }],
        onSuccess: (response) => {
          new Deserializer({keyForAttribute: 'underscore_case'}).deserialize(response, (err, pages) => {
            resolve(sortBy(pages, 'name'));
          });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  fetchData(id) {
    return new Promise((resolve, reject) => {
      get({
        url: `${process.env.WRI_API_URL}/static_page/${id}?application=${process.env.APPLICATIONS}&env=${process.env.API_ENV}`,
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        },
        {
          key: 'Upgrade-Insecure-Requests',
          value: 1
        }],
        onSuccess: (response) => {
          new Deserializer({keyForAttribute: 'underscore_case'}).deserialize(response, (err, page) => {
            resolve(page);
          });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  saveData({ type, body, id }) {
    return new Promise((resolve, reject) => {
      post({
        url: `${process.env.WRI_API_URL}/static_page/${id}`,
        type,
        body: {
          ...body,
          application: [process.env.APPLICATIONS],
          env: process.env.API_ENV
        },
        headers: [{
          key: 'Content-Type',
          value: 'application/json'
        }, {
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: (response) => {
          new Deserializer({keyForAttribute: 'underscore_case'}).deserialize(response, (err, page) => {
            resolve(page);
          });
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }

  deleteData(id) {
    return new Promise((resolve, reject) => {
      remove({
        url: `${process.env.WRI_API_URL}/static_page/${id}`,
        headers: [{
          key: 'Authorization',
          value: this.opts.authorization
        }],
        onSuccess: (response) => {
          resolve(response);
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  }
}