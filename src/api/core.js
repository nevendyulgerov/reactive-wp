import $ from 'jquery';

const { reactiveWooApi } = window;
const { token, ajaxUrl, restUrl } = reactiveWooApi;

/**
 * @description Rest type
 * @type {*}
 */
export const restType = {
  wp: 'wp',
  woo: 'woo',
  custom: 'custom'
};

/**
 * @description Endpoint
 * @type {*}
 */
export const restEndpoint = {
  products: 'products',
  posts: 'posts',
  pages: 'pages',
  tags: 'tags',
  users: 'users',
  settings: 'settings',
  menuItems: 'menu-items'
};

/**
 * @description Get rest api object
 * @param apiUrl
 * @param type
 * @param endpoint
 * @param data
 * @param callback
 * @returns {{url: string, type: string, data, beforeSend: function(*): *, success: function(*=): *, error: function(*=): *}}
 */
const getRestApiObject = ({ apiUrl, type = 'GET', endpoint, data = {}, callback }) => ({
  url: `${restUrl}${apiUrl}/${endpoint}`,
  type,
  data,
  dataType: 'JSON',
  beforeSend: xhr => xhr.setRequestHeader('X-WP-Nonce', token),
  success: res => callback(undefined, res),
  error: err => callback(err)
});

/**
 * @description Get wp ajax object
 * @param options
 * @returns {*}
 */
const getWpAjaxObject = options => getRestApiObject({
  ...options,
  apiUrl: 'wp/v2'
});

/**
 * @description Get custom ajax object
 * @param options
 * @returns {*}
 */
const getCustomAjaxObject = options => getRestApiObject({
  ...options,
  apiUrl: 'reactive-woo/v1'
});

/**
 * @description Get woo ajax object
 * @param type
 * @param endpoint
 * @param data
 * @param callback
 */
const getWooAjaxObject = ({ type = 'GET', endpoint, data = {}, callback }) => ({
  type: 'POST',
  url: ajaxUrl,
  data: {
    action: 'api',
    token,
    request: { type, endpoint, data }
  },
  dataType: 'JSON',
  success: response => callback(undefined, response),
  error: error => callback(error)
});

/**
 * @description Call rest api
 * @param type
 * @param options
 */
export const callRestApi = (type = restType.wp, options) => {
  let ajaxObject = {};

  switch (type) {
    case restType.wp:
      ajaxObject = getWpAjaxObject(options);
      break;
    case restType.woo:
      ajaxObject = getWooAjaxObject(options);
      break;
    case restType.custom:
      ajaxObject = getCustomAjaxObject(options);
      break;
    default:
      break;
  }

  $.ajax(ajaxObject);
};
